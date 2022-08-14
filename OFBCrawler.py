import requests, sys, networkx as nx
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
        G.add_edge(this_id, coming_from_id, weight=steps)
        print_and_optimize(start, searching_for)
        print("we're done here in theory, but let's see if we can find something shorter anyway")
        return
    
    visited_ids.append(this_id)
    print(url)
    soup = BeautifulSoup(requests.get(url).content, "html.parser")
    name = get_name_from_title(soup.find("title").contents[0])
    info_line = "#" + (str) (len(visited_ids)) + ": " + this_id + " => "+ name +" coming from " + coming_from_id
    print (info_line)
    G.add_edge(this_id, coming_from_id, weight=steps)
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
                        except RecursionError: 
                            print ("too many recursions")
                    else:
                        G.add_edge(other_id, this_id, weight=(steps+1))
                        
def print_and_optimize (node_from, node_to):
    path =nx.dijkstra_path(G, node_from, node_to) 
    f = open("paths_from_"+ start +".txt", "a")
    f.write(str(node_to) + ";" + str(len(path)) + ";" + str(path) + "\n" )
    f.close()

#via https://www.codingem.com/python-maximum-recursion-depth/
class recursion_depth:
    def __init__(self, limit):
        self.limit = limit
        self.default_limit = sys.getrecursionlimit()
    def __enter__(self):
        sys.setrecursionlimit(self.limit)
    def __exit__(self, type, value, traceback):
        sys.setrecursionlimit(self.default_limit)
        
G = nx.Graph()
visited_ids = []
start = "I5319";
searching_for = "I2770"

with recursion_depth(10000):
    get_related_ids('https://www.online-ofb.de/famreport.php?ofb=asslar&ID='+start, "initial call searching for " + searching_for, 0)

for node in G.nodes:
    print_and_optimize(start, node)

