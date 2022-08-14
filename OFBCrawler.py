import requests, sys
from bs4 import BeautifulSoup

def get_id_from_url(url):
    id = ""
    for and_part in url.split('&'):
        if and_part.startswith("ID="):
            id = and_part[3:]
    return id

def get_name_from_title(title):
    index_of_colon = title.index(":")+ len(":")
    name = title[index_of_colon:]
    return name

def get_related_ids(url, coming_from_id, steps):
    this_id = get_id_from_url(url)
    if this_id == searching_for:
        print("we're done here")
        sys.exit()
    
    visited_ids.append(this_id)
    print(url)
    soup = BeautifulSoup(requests.get(url).content, "html.parser")
    name = get_name_from_title(soup.find("title").contents[0])
    info_line = "#" + (str) (len(visited_ids)) + ": " + this_id + " => "+ name +" coming from " + coming_from_id
    print (info_line)
    f = open("connection.txt", "a")
    f.write(this_id+";" + name.replace("\"", "") +";"+coming_from_id +";" + str(steps)+"\n")
    f.close()
    for a_tag in soup.findAll("a"):
        href = (str) (a_tag.attrs.get("href"))
        if href is not None and href is not "":
            if this_id not in href:
                other_id = get_id_from_url(href)
                
                if other_id is not "":
                    if other_id not in visited_ids:
                        # print (other_id)
                        # other_ids.append(other_id)
                        try:
                            get_related_ids("https://www.online-ofb.de/" + href, this_id, steps+1)
                        except: 
                            print ("too many recursions")
                    else:
                        line = other_id+";" + "dupe" +";"+this_id +";" + str(steps+1)+"\n";
                        f = open("connection.txt", "a")
                        f.write(line)
                        f.close()   

visited_ids = []
searching_for = "I2770"

f = open("connection.txt", "w")
f.write("ID;Name;Origin;Steps\n")
f.close()
    
get_related_ids('https://www.online-ofb.de/famreport.php?ofb=asslar&ID=I5319', "initial call searching for " + searching_for, 0)



# f = requests.get(url)
# memberPageContent = f.text
# print(f.text)


