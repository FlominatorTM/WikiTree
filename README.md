# WikiTree
tools for working with WikiTree

## Bookmarklets
see [Wikipedia's article about bookmarklets](https://en.wikipedia.org/wiki/Bookmarklet), [Greg's instructions on how to install bookmarklets](https://youtu.be/50M-w_yXHzs) and [my video on how to install and use the category bookmarklets](https://www.youtube.com/watch?v=okOe7sHjuQs&t=51s)

### AllEditLinks
makes all links to wiki pages (e.g. in a contributions list) point directly to "edit profile"

### Archion
generates formatted source citations from church books at Archion (e.g. from http://www.archion.de/p/f6ba68d29e/ )

### ArchivesBasRhin
generates formatted source citations from church books at http://archives.bas-rhin.fr/

### Antenati
calls [Antenati Citation Builder](https://apps.wikitree.com/apps/clarke11007/antenati.php) when being on a record like https://www.antenati.san.beniculturali.it/ark:/12657/an_ua267608/wEKr932

### Compgen Grabstein-Projekt
generates formatted source citations from gravestone entries like https://grabsteine.genealogy.net/tomb.php?cem=5385&tomb=481 (supports manual text selection)

### Compgen Online-OFBs
generates formatted source citations from people entries like https://www.online-ofb.de/famreport.php?ofb=buehlertal&ID=I7793&nachname=STRAUB  (experimentally supports manual text selection)

### FindAGrave
generates combines the citation prepared by FindAGrave with [external link template](https://www.wikitree.com/wiki/Template:FindAGrave) for the  memorial currently displayed in browser (inpired by [this post](https://www.wikitree.com/g2g/569133/citation-help-findagrave-now-provides-citation-suggestion) by Allison Mackler)

### LABW
generates formatted source citations from church book duplicates at Landesarchiv Baden-Württemberg (e.g. from https://www2.landesarchiv-bw.de/ofs21/olf/struktur.php?bestand=10028 )

### Matricula
generates formatted source citations from church books at Matricula (e.g. from https://data.matricula-online.eu/de/deutschland/paderborn/DE_EBAP_10114/KB001-01-T/?pg=139 )

### Riksarkivet
generates formatted source citations from Swedish Riksarkivet (e.g. https://sok.riksarkivet.se/bildvisning/C0013667_00133 )

### ThonNormalized
generates scores normalized points based on the official score sheet for [SourceAThon](https://wikitree.sdms.si/Challenges/SourceAThon/TeamAndUser.htm) and [ConnectAThon](https://wikitree.sdms.si/Challenges/ConnectAThon/TeamAndUser.htm)

### TrustedListEmail
collects all email adresses from one page (e.g. the Trusted List of a profile) and puts them into a new email

### WieWasWie
opens WieWasWie formater when being on a WieWasWie detail page (e.g. https://www.wiewaswie.nl/nl/detail/29373347 )

### WikidataLocationCategories
generates template code for creating a category when being on place entry in Wikidata

### WikipediaDeLocationCategories
generates template code for creating a category when being on place article in German Wikipedia

### WikipediaDeFromSelectedText
opens a new German Wikipedia tab by using the text selected in the current tab

### WikipediaItLocationCategories
generates template code for creating a category when being on place article in Italian Wikipedia

### WikiTreeCountDescendants
displays the number of descendants (per generation and in total) when being on "Descendant List" like https://www.wikitree.com/genealogy/Molesworth-Descendants-131

## Greasemonkey scripts
see https://addons.mozilla.org/de/firefox/addon/greasemonkey/
### Shortcuts
modifies WikiTree's user interface, see https://github.com/FlominatorTM/WikiTree/blob/master/Greasemonkey_Shortcuts.js for details on features

### FamilySearch
adds microfilm and (if available) image number to the citation template (only works for manual copy and paste, not for the copy link provided by FamilySearch) 

### LocationCleanup
removes prefixes from location fields coming from FamilySearch

## Misc
### inventory.php
category monitoring as implemented at https://www.wikitree.com/index.php?title=Space:Germany_Needs_Birth_Record_Category_Content
### OFBCrawler.py
tries to find a connection between two given IDs in one family book at http://www.online-ofb.de
### ProjectMembers.py
lists members of the Germany Project and their activity status

### ThonTeamMates.py
opens the Thon register post pages that contain users wanting to join Germany Genies in the default browser
