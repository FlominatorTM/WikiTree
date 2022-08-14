import sys, networkx as nx

G = nx.Graph()
f = open("connection.txt", "r")
for line in f.readlines():
    parts = line.split(";")
    #print (parts)
    G.add_edge(parts[0], parts[2], weight=int(parts[3]))
f.close()

for node in G.nodes:
    path =nx.dijkstra_path(G, "I2770", node) 
    f = open("dconnection.txt", "a")
    f.write(str(node) + ";" + str(len(path)) + ";" + str(path) + "\n" )
    f.close()
