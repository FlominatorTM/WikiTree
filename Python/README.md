# WikiTree

Python scripts to run at your PC for working with WikiTree

All scripts require python 3.x

## OFBCrawler.py

- tries to find a connection between two given IDs in one family book at http://www.online-ofb.de
- IDs and name of the family book have to be changed directly in code

## PhotosGEDCOM.py

downloads all FILE entries (mostly images) from a GEDCOM, that was exported from WikiTree, into a local subfolder and generates a GEDCOM file that links to the local files

## ProjectMembers.py

- lists members of a given Project and their activity status and other statistics
- installing additional libraries: `pip install -r ProjectMembers_requirements`

## ThonTeamMates.py

opens the Thon register post pages that contain users wanting to join Germany Genies in the default browser