import os
import requests
import argparse
import re
import urllib
def add_found_links(bio, links, src):
    pattern = r"\[\[(.*?)\]\]"
    for bracket_content in re.findall(r"\[\[(.*?)\]\]", bio, re.DOTALL):
        if not ":" in bracket_content and bracket_content[0] != "#":
            piped_parts = bracket_content.split("|")
            id = piped_parts[0].strip()
            alias = id
            if len (piped_parts) == 2:
                alias = piped_parts[1]
            # elif len(piped_parts) == 1:
            #     links[piped_parts[0]] = piped_parts[0]
            links[id] = { "id": id, "alias": alias, "from" : src }

parser = argparse.ArgumentParser(description='Downloads all images from a WikiTree GEDCOM file to a subfolder img and updates the GEDCOM file')
parser.add_argument('--gedcom', help='path to GEDCOM file downloaded from WikiTree', default=r'D:\@INBOX\2024-11-28\23097626-0dae70.ged')
parser.add_argument('--folder', help='folder name for images (default: img)', default="img")
args = parser.parse_args()

gedcom = args.gedcom
img_folder = args.folder
gedcom_new = gedcom[0:gedcom.rfind(".")] + "_local.ged"
gedcom_path = os.getcwd()
whitelist = "gedcom_whitelist.txt"
#os.path.dirname(gedcom)

print(gedcom_new)
img_dir_path = os.path.join(gedcom_path, img_folder)

if not os.path.exists(img_dir_path):
    os.mkdir(img_dir_path)

headers = {'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/113.0'}

found_profiles = []

if os.path.exists(whitelist):
    with open(whitelist, encoding="utf8") as f:
        for whitelist_line in f.readlines():
            if not whitelist_line[0] == '#':
                found_profiles.append(whitelist_line.strip())
        print(found_profiles)
        input()

linked_profiles = {}
cont_lines = ""
url_prefix = "https://www.wikitree.com/photo.php/"
with open(gedcom, "r", encoding="utf8", errors="ignore") as f:
    with open(gedcom_new, "w", encoding="utf8") as g:
        wt_id = ""
        for line in f.readlines():
            g.write(line.replace("https://www.WikiTree.com/wiki/Image:", img_folder + "\\"))
            if "2 FILE " in line:
                img_page_url = line[len("2 FILE "):]
                img_name = img_page_url.split("Image:")[1].strip()
                img_base_name = img_name[0:img_name.rfind(".")]
                print(img_name)
                img_page_file_path = os.path.join(img_dir_path, img_base_name) + ".htm"
                img_file_path = os.path.join(img_dir_path, img_name)

                if os.path.exists(img_page_file_path) and os.path.exists(img_file_path):
                    print("already exists, skipping")
                    continue
                
                img_page = requests.get(img_page_url, headers=headers)
                
                with open (img_page_file_path, "w", encoding="utf8") as img_page_file:
                    img_page_file.write(img_page.text)

                # https://www.wikitree.com/photo.php/6/6d/Gimpel-2.jpg
                img_src_name = img_page.text.split("photo.php/")[1].split('"')[0]
                img_url = url_prefix + img_src_name

                print("download")
                response = requests.get(img_url, stream=True, headers=headers)
                response.raw.decode_content = True
                with open(img_file_path, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=1024): 
                        f.write(chunk)
                print("done")
            if "1 WWW " in line:
                wt_id = line.split("https://www.WikiTree.com/wiki/")[1].strip();
                found_profiles.append(wt_id)
            if " INDI" in line:
                add_found_links(cont_lines, linked_profiles, wt_id)
                if "Nally" in cont_lines:
                    input(cont_lines)

            if "1 NOTE " in line:
                #this is the whole bio of the previous person
                #print(cont_lines)
                cont_lines = line.split("1 NOTE ")[1]
            if "2 CONT " in line:
                cont_lines += line.split("2 CONT ")[1]


print ("missing")
for linked_profile_id in linked_profiles:
    if linked_profile_id not in found_profiles:
        wt_id = linked_profiles[linked_profile_id]["id"]
        alias = linked_profiles[linked_profile_id]["alias"]
        src = linked_profiles[linked_profile_id]["from"]
        print(f"from https://www.wikitree.com/wiki/{urllib.parse.quote(src)} to {alias}\n => https://www.wikitree.com/index.php?title={urllib.parse.quote(wt_id)}&action=joinnetwork")



#print(missing_profiles)




            