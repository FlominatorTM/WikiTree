import datetime
import json
import requests
from requests import Session
import re
import urllib
import argparse
from typing import Optional, Tuple, List # Import Optional, Tuple, and List from the typing module

# WikiTree API endpoints
API_URL = "https://api.wikitree.com/api.php"
WIKITREE_PLUS_URL = "https://plus.wikitree.com/function/WTWebProfileSearch/WikiTreePlus2GEDCOM.json"

def format_date(date_str: str) -> Optional[str]:
    """
    Formats a date string, handling full dates (YYYY-MM-DD), partial dates (YYYY-MM),
    and year-only dates (YYYY), as well as dates with '00' for day or month.
    
    The function tries to parse the most specific format first and falls back to
    less specific ones if parsing fails or if the month/day is '00'.
    - 'YYYY-MM-DD' becomes 'DD MMM YYYY'
    - 'YYYY-MM-00' or 'YYYY-MM' becomes 'MMM YYYY'
    - 'YYYY-00-00' or 'YYYY-00' or 'YYYY' becomes 'YYYY'
    
    Returns None if the date is invalid or empty.
    """
    if not date_str or date_str == '0000-00-00':
        return None
    
    parts = date_str.split('-')
    
    # Case 1: Handle YYYY-MM-DD with a valid day
    if len(parts) == 3 and parts[2] != '00':
        try:
            dt_obj = datetime.datetime.strptime(date_str, '%Y-%m-%d')
            return dt_obj.strftime('%d %b %Y').upper()
        except ValueError:
            pass # Fall through to the next check
    
    # Case 2: Handle YYYY-MM or YYYY-MM-00 with a valid month
    if len(parts) >= 2 and parts[1] != '00':
        try:
            # We construct a YYYY-MM string to parse correctly
            dt_obj = datetime.datetime.strptime(f"{parts[0]}-{parts[1]}", '%Y-%m')
            return dt_obj.strftime('%b %Y').upper()
        except ValueError:
            pass # Fall through to the next check
    
    # Case 3: Handle YYYY or YYYY-00-00 or YYYY-00
    if len(parts) >= 1 and len(parts[0]) == 4:
        return parts[0]

    return None

def authenticate_session(session: Session, email: str, password: str) -> None:
    """Authenticates the session with provided credentials"""
    # Step 1: Obtain the authcode - will be sent from the API in Location header
    print("Attempting to authenticate...")
    data = {
        "action": "clientLogin",
        "doLogin": 1,
        "wpEmail": email,
        "wpPassword": password,
    }
    try:
        resp = session.post(
            API_URL,
            data=data,
            allow_redirects=False,  # necessary to POST without redirect, we need to capture the Location header
        )
        resp.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error during first authentication step: {e}")
        return

    location = resp.headers.get("Location")
    if (
        resp.status_code != 302
        or location is None
        or "authcode" not in location
    ):
        print("Cannot authenticate with Wikitree API: authcode was not obtained")
        return

    matches = re.search(r"authcode=(?P<authcode>.+$)", location)
    if matches is None:
        print("Cannot authenticate with Wikitree API: authcode was not obtained")
        return
    
    authcode = matches.groupdict().get("authcode")

    # Step 2: Send back the authcode to finish the authentication
    data = {"action": "clientLogin", "authcode": authcode}
    try:
        resp = session.post(API_URL, data=data, allow_redirects=False)
        resp.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error during second authentication step: {e}")
        return

    if not resp.ok:
        print("Cannot authenticate with Wikitree API: failed the authcode verification")
        return

    cookies = session.cookies.get_dict()
    if "wikidb_wtb__session" not in cookies:
        print("Cannot authenticate with Wikitree API: cookies were not set properly")
        return

    # More verbose success message
    username = urllib.parse.unquote(cookies.get("wikidb_wtb_UserName", "Unknown User"))
    print(f'User "{username}" is successfully authenticated!')

def prepare_session(email: Optional[str], password: Optional[str]) -> Session:
    """
    Prepares the session for the communication with Wikitree API,
    for authenticated access to API, fill in optional fields: email & password
    """
    session: Session = Session()

    if email and password:
        authenticate_session(session, email, password)
    else:
        print("Running without authentication. Private profiles will not be accessible.")

    return session

def fetch_wikitree_plus_keys(query: str) -> List[str]:
    """
    Fetches a list of WikiTree profile keys (numerical IDs) from WikiTree+
    based on a text search query. This API does not require authentication.

    Args:
        query (str): The search term (e.g., 'Hinterzarten').
        
    Returns:
        list: A list of WikiTree numerical profile IDs (as strings).
    """
    print(f"\nSearching WikiTree+ for '{query}'...")
    params = {
        "Query": query,
        "Format": "JSON"
    }

    try:
        response = requests.get(WIKITREE_PLUS_URL, params=params, verify=False)
        response.raise_for_status()
        
        result = response.json()
        if 'response' in result and 'profiles' in result['response']:
            # The API returns integers, but the main function needs them as strings
            keys = [str(key) for key in result['response']['profiles']]
            print(f"Found {len(keys)} profiles for the query '{query}'.")
            return keys
        else:
            print("No profiles found in the WikiTree+ search result.")
            return []

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from WikiTree+ API: {e}")
        return []
    except json.JSONDecodeError:
        print("Error: Could not decode JSON response from WikiTree+.")
        return []


def fetch_wikitree_data(session: Session, keys: list) -> dict:
    """
    Fetches profile data for multiple people and their spouses from the WikiTree API,
    using an authenticated session. This function uses the 'getRelatives' action
    to also retrieve spouse and marriage data.

    Args:
        session (Session): An authenticated requests session object.
        keys (list): A list of WikiTree profile keys.

    Returns:
        dict: A dictionary containing all the WikiTree profile data, including spouses.
    """
    if not keys:
        print("No keys provided to fetch from WikiTree.")
        return {}

    people_data = {}
    chunk_size = 1000
    
    # Process the list of keys in chunks of 1000
    for i in range(0, len(keys), chunk_size):
        chunk = keys[i:i + chunk_size]
        key_string = ",".join(chunk)
        
        # We now use a POST request with 'getRelatives' to get spouse data
        payload = {
            "action": "getRelatives",
            "keys": key_string,
            "fields": "Id,PageId,Name,FirstName,LastNameAtBirth,BirthDate,DeathDate,Father,Mother,Gender,BirthLocation,DeathLocation",
            "getSpouses": 1,
            "appId" : "WikiTreePlus2GEDCOM"
        }
        
        try:
            print(f"Fetching chunk {i // chunk_size + 1} of {len(keys) // chunk_size + 1} with {len(chunk)} keys...")
            response = session.post(API_URL, data=payload)
            response.raise_for_status()  # Raise an exception for bad status codes
            
            # The API returns a list with a single dictionary, so we access the first element
            result = response.json()
            if result and result[0].get('items'):
                for item in result[0]['items']:
                    person = item['person']
                    # Add the main person's data
                    people_data[str(person['Id'])] = person
                    
                    # Add spouse data if available
                    if 'Spouses' in person and person['Spouses']:
                        for spouse_id, spouse_data in person['Spouses'].items():
                            people_data[str(spouse_id)] = spouse_data
                print(f"Successfully fetched data for {len(people_data)} people from this chunk.")
            else:
                print("No people data returned for this chunk.")
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching data from WikiTree API: {e}")
            # Continue to the next chunk even if one fails
            continue
            
    print(f"\nAll chunks fetched. Total profiles retrieved: {len(people_data)}")
    return people_data

def _process_location(location_str: Optional[str]) -> Optional[str]:
    """
    Splits a location string by the first comma and returns the first part.
    This is an internal helper function.
    """
    if location_str and isinstance(location_str, str):
        return location_str.split(',')[0].strip()
    return None

def process_wikitree_data(people_data: dict, first_location_only: bool) -> Tuple[list, list]:
    """
    Processes WikiTree API JSON data from getRelatives and generates GEDCOM-compliant lists
    for individuals and families, including marriage data.

    Args:
        people_data (dict): A dictionary with WikiTree people data.
        first_location_only (bool): If True, only the first part of the location string is used.

    Returns:
        tuple: A tuple containing lists of individuals and families.
    """
    print("\nStarting to process WikiTree data...")
    individuals_dict = {}
    families_dict = {}

    # First pass: Create individual records for all people and prepare family links
    for person_id, person_data in people_data.items():
        xref_id = f"I{person_id}"
        
        # Determine the location string based on the command-line flag
        birth_location_str = person_data.get('BirthLocation')
        death_location_str = person_data.get('DeathLocation')
        
        if first_location_only:
            birth_location = _process_location(birth_location_str)
            death_location = _process_location(death_location_str)
        else:
            birth_location = birth_location_str
            death_location = death_location_str

        individuals_dict[xref_id] = {
            'xref': xref_id,
            'given_name': person_data.get('FirstName'),
            'surname': person_data.get('LastNameAtBirth'),
            'wikitree_name': person_data.get('Name'),
            'sex': person_data.get('Gender'),
            'birth_date': format_date(person_data.get('BirthDate')),
            'birth_place': birth_location,
            'death_date': format_date(person_data.get('DeathDate')),
            'death_place': death_location,
            'Spouses': person_data.get('Spouses', {}) # Store spouse data temporarily
        }

    # Second pass: Create families based on parent-child and spousal relationships
    family_counter = 0
    for person_id, person_data in people_data.items():
        child_xref = f"I{person_id}"
        father_id = person_data.get('Father')
        mother_id = person_data.get('Mother')

        father_xref = f"I{father_id}" if father_id and f"I{father_id}" in individuals_dict else None
        mother_xref = f"I{mother_id}" if mother_id and f"I{mother_id}" in individuals_dict else None

        if father_xref or mother_xref:
            # Create a unique key for the family based on the parents' xrefs
            family_key = tuple(sorted(list(filter(None, [father_xref, mother_xref]))))
            
            if family_key not in families_dict:
                family_counter += 1
                family_xref = f"F{family_counter}"
                families_dict[family_key] = {
                    'xref': family_xref,
                    'husband_xref': father_xref,
                    'wife_xref': mother_xref,
                    'children_xrefs': [],
                    'marriage_date': None,
                    'marriage_place': None
                }
            
            family_record = families_dict[family_key]
            if child_xref not in family_record['children_xrefs']:
                family_record['children_xrefs'].append(child_xref)
            individuals_dict[child_xref]['family_as_child'] = family_record['xref']
            
        # Process spouse data to create or update family records
        spouses = individuals_dict[child_xref].get('Spouses')
        if spouses:
            for spouse_id, spouse_data in spouses.items():
                spouse_xref = f"I{spouse_id}"
                
                # Determine who is the husband and who is the wife
                husband_xref = child_xref if individuals_dict[child_xref].get('sex') == 'Male' else spouse_xref
                wife_xref = child_xref if individuals_dict[child_xref].get('sex') == 'Female' else spouse_xref
                
                # Create a unique key for the family based on spouses' xrefs
                family_key = tuple(sorted(list(filter(None, [husband_xref, wife_xref]))))

                # Process marriage location based on the flag
                marriage_location_str = spouse_data.get('marriage_location')
                if first_location_only:
                    marriage_location = _process_location(marriage_location_str)
                else:
                    marriage_location = marriage_location_str

                if family_key not in families_dict:
                    family_counter += 1
                    family_xref = f"F{family_counter}"
                    families_dict[family_key] = {
                        'xref': family_xref,
                        'husband_xref': husband_xref,
                        'wife_xref': wife_xref,
                        'children_xrefs': [],
                        'marriage_date': format_date(spouse_data.get('marriage_date')),
                        'marriage_place': marriage_location
                    }
                else:
                    # Update existing family with marriage data if it's new
                    if not families_dict[family_key].get('marriage_date') and spouse_data.get('marriage_date'):
                        families_dict[family_key]['marriage_date'] = format_date(spouse_data.get('marriage_date'))
                    if not families_dict[family_key].get('marriage_place') and marriage_location:
                        families_dict[family_key]['marriage_place'] = marriage_location

                family_xref = families_dict[family_key]['xref']
                individuals_dict[child_xref]['family_as_spouse'] = family_xref
                individuals_dict[spouse_xref]['family_as_spouse'] = family_xref


    # Clean up temporary data
    for individual in individuals_dict.values():
        del individual['Spouses']
    
    families_list = list(families_dict.values())
    print(f"Processing complete. Found {len(individuals_dict)} individuals and {len(families_list)} families.")
    return list(individuals_dict.values()), families_list


def create_gedcom_file(filename: str, individuals: list, families: list) -> None:
    """
    Creates a simple GEDCOM file from a list of individuals and families.
    Each individual profile now includes a source link to their WikiTree page.

    Args:
        filename (str): The name of the file to create (e.g., 'my_family.ged').
        individuals (list): A list of dictionaries, each representing an individual.
        families (list): A list of dictionaries, each representing a family.
    """
    try:
        print(f"\nCreating GEDCOM file: {filename}...")
        with open(filename, 'w', encoding='utf-8-sig') as f:
            # 0 HEAD - Header record
            f.write("0 HEAD\n")
            f.write("1 GEDC\n")
            f.write("2 VERS 5.5.5\n")
            f.write("2 FORM LINEAGE-LINKED\n")
            f.write(f"1 DATE {datetime.date.today().strftime('%d %b %Y').upper()}\n")
            f.write(f"1 FILE {filename}\n")
            f.write("1 CHAR UTF-8\n")
            f.write("1 SUBM @SUB1@\n") # Reference to a submitter record

            # Submitter record
            f.write("0 @SUB1@ SUBM\n")
            f.write("1 NAME My GEDCOM Generator\n")
            
            # --- Individuals ---
            for individual in individuals:
                f.write(f"0 @{individual['xref']}@ INDI\n")
                # Use a specific structure for the name to handle empty given names
                given_name = individual.get('given_name') or ''
                surname = individual.get('surname') or ''
                f.write(f"1 NAME {given_name} /{surname}/\n")
                
                # Add a source record for each profile that links to their WikiTree page
                if individual.get('wikitree_name'):
                    source_xref = f"S{individual['xref'][1:]}" # S<the numeric part of the xref>
                    f.write(f"1 SOUR @{source_xref}@\n")
                
                # Add the WikiTree Name as a NOTE field for additional information
                if individual.get('wikitree_name'):
                    f.write(f"1 NOTE WikiTree Name: {individual['wikitree_name']}\n")
                
                if individual.get('sex'):
                    f.write(f"1 SEX {individual['sex']}\n")
                
                if individual.get('birth_date') or individual.get('birth_place'):
                    f.write("1 BIRT\n")
                    if individual.get('birth_date'):
                        f.write(f"2 DATE {individual['birth_date']}\n")
                    if individual.get('birth_place'):
                        f.write(f"2 PLAC {individual['birth_place']}\n")
                
                if individual.get('death_date') or individual.get('death_place'):
                    f.write("1 DEAT\n")
                    if individual.get('death_date'):
                        f.write(f"2 DATE {individual['death_date']}\n")
                    if individual.get('death_place'):
                        f.write(f"2 PLAC {individual['death_place']}\n")
                        
                if individual.get('family_as_child'):
                    f.write(f"1 FAMC @{individual['family_as_child']}@\n")
                
                if individual.get('family_as_spouse'):
                    f.write(f"1 FAMS @{individual['family_as_spouse']}@\n")

            # --- Source Records ---
            for individual in individuals:
                if individual.get('wikitree_name'):
                    source_xref = f"S{individual['xref'][1:]}"
                    wikitree_url = f"https://www.wikitree.com/wiki/{individual['wikitree_name']}"
                    f.write(f"0 @{source_xref}@ SOUR\n")
                    f.write(f"1 TITL {wikitree_url}\n")

            # --- Families ---
            for family in families:
                f.write(f"0 @{family['xref']}@ FAM\n")
                if family.get('husband_xref'):
                    f.write(f"1 HUSB @{family['husband_xref']}@\n")
                if family.get('wife_xref'):
                    f.write(f"1 WIFE @{family['wife_xref']}@\n")
                
                if family.get('marriage_date') or family.get('marriage_place'):
                    f.write("1 MARR\n")
                    if family.get('marriage_date'):
                        f.write(f"2 DATE {family['marriage_date']}\n")
                    if family.get('marriage_place'):
                        f.write(f"2 PLAC {family['marriage_place']}\n")

                for child_xref in family.get('children_xrefs', []):
                    f.write(f"1 CHIL @{child_xref}@\n")

            # 0 TRLR - Trailer record
            f.write("0 TRLR\n")
        
        print(f"Successfully created {filename} with {len(individuals)} individuals and {len(families)} families.")

    except IOError as e:
        print(f"Error writing to file: {e}")


if __name__ == '__main__':
    # Set up argument parsing
    parser = argparse.ArgumentParser(description='Fetch results of a Wikitree+ query and create a GEDCOM file.')
    parser.add_argument('--email', '-e', required=True, help='Your WikiTree login email.')
    parser.add_argument('--password', '-p', required=True, help='Your WikiTree password.')
    parser.add_argument('--query', '-q', required=True, help='The WikiTree+ search query.')
    # Added new optional argument to control location splitting
    parser.add_argument(
        '--first-location-only',
        action='store_true',
        help='Use only the first part of the location string before the first comma.'
    )
    
    args = parser.parse_args()

    # Get credentials and query from the parsed arguments
    email = args.email
    password = args.password
    query = args.query

    # First, fetch the keys from WikiTree+ without a max profile limit
    wikitree_keys = fetch_wikitree_plus_keys(query)
    
    if wikitree_keys:
        # If keys are found, prepare an authenticated session
        session = prepare_session(email, password)

        # Fetch data from WikiTree using the new batching logic and the authenticated session
        wikitree_data = fetch_wikitree_data(session, wikitree_keys)

        if wikitree_data:
            # Process the fetched data to get GEDCOM-compliant lists
            individuals_list, families_list = process_wikitree_data(wikitree_data, args.first_location_only)

            # Call the function to create the file
            create_gedcom_file('wikitree_data.ged', individuals_list, families_list)
