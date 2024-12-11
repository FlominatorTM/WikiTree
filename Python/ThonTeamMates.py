import requests
import os
import sys

i = 0

condition = True
while condition:
    # loop body here
    link = 'https://www.wikitree.com/g2g/1628429/register-now-for-the-2023-source-a-thon?start=' + str(i)
    print(link)
    headers = {'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/113.0'}
    page = requests.get(link, headers=headers)
   
    i = i + 20
    
    # text_file = open(str(i)+".txt", "w",  encoding='utf8', errors='ignore')
    # text_file.write(page.text)
    # text_file.close()
    
    if "suggestedAnswer" in page.text:
        if "Genies" in page.text:
            os.system("start " + link)
    else: 
        condition = False
    
