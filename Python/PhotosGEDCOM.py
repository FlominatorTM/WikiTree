import os
import requests
import argparse

parser = argparse.ArgumentParser(description='Downloads all images from a WikiTree GEDCOM file to a subfolder img and updates the GEDCOM file')
parser.add_argument('--gedcom', help='path to GEDCOM file downloaded from WikiTree', default=r'D:\@INBOX\2024-11-28\23097626-0dae70.ged')
parser.add_argument('--folder', help='folder name for images (default: img)', default="img")
args = parser.parse_args()

gedcom = args.gedcom
img_folder = args.folder
gedcom_new = gedcom[0:gedcom.rfind(".")] + "_local.ged"
gedcom_path = os.getcwd()
#os.path.dirname(gedcom)

print(gedcom_new)
img_dir_path = os.path.join(gedcom_path, img_folder)

if not os.path.exists(img_dir_path):
    os.mkdir(img_dir_path)

headers = {'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/113.0'}

prefix = "2 FILE "
url_prefix = "https://www.wikitree.com/photo.php/"
with open(gedcom, "r", encoding="utf8", errors="ignore") as f:
    
    with open(gedcom_new, "w", encoding="utf8") as g:
        for line in f.readlines():
            g.write(line.replace("https://www.WikiTree.com/wiki/Image:", img_folder + "\\"))
            if prefix in line:
                img_page_url = line[len(prefix):]
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


            