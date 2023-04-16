import requests
import os
import sys

i = 0

condition = True
while condition:
    # loop body here
    link = 'https://www.wikitree.com/g2g/1553800/have-you-registered-for-the-april-2023-connect-a-thon-yet?start=' + str(i)
    print(link)
    page = requests.get(link)
   
    i = i + 20
    
    # text_file = open(str(i)+".txt", "w",  encoding='utf8', errors='ignore')
    # text_file.write(page.text)
    # text_file.close()
    
    if "suggestedAnswer" in page.text:
        if "ermany" in page.text:
            os.system("start " + link)
    else: 
        condition = False
    
