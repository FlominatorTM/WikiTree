# Bookmarklets - making your WikiTreer life a little easier
Bookmarklets ([Wikipedia](https://en.wikipedia.org/wiki/Bookmarklet)) are tiny pieces of JavaScript code stored as a bookmark on your browser and executed when clicking on the bookmark. For installation examples, see [Greg's instructions on how to install bookmarklets](https://youtu.be/50M-w_yXHzs) and [a part my video on how to install and use the category bookmarklets](https://youtu.be/okOe7sHjuQs?t=147)

## Citing sources

### [Archion.js](Archion.js)
generates formatted source citations from church books at Archion (e.g. from http://www.archion.de/p/f6ba68d29e/ )

### [ArchivesBasRhin.js](ArchivesBasRhin.js)
generates formatted source citations from church books at http://archives.bas-rhin.fr/

### [Antenati.js](Antenati.js)
calls [Antenati Citation Builder](https://apps.wikitree.com/apps/clarke11007/antenati.php) when being on a record like https://www.antenati.san.beniculturali.it/ark:/12657/an_ua267608/wEKr932

### [Badische Landesbibliothek, Digitale Sammlungen](BLB_Newspapers.js)
generates formatted source citations from newspapers and magazines at https://digital.blb-karlsruhe.de/

### [CCCC.js](CCCC.js)
calls [Canadian Census Citation Creator](https://apps.wikitree.com/apps/clarke11007/CCCC.php) when being on a record like https://recherche-collection-search.bac-lac.gc.ca/eng/home/record?app=census&IdNumber=68778713

### [Compgen Grabstein-Projekt](Compgen_Gravestones.js)
generates formatted source citations from gravestone entries like https://grabsteine.genealogy.net/tomb.php?cem=5385&tomb=481 (supports manual text selection)

### [Compgen Online-OFBs](Compgen_OFBs.js)
generates formatted source citations from people entries like https://www.online-ofb.de/famreport.php?ofb=buehlertal&ID=I7793&nachname=STRAUB  (experimentally supports manual text selection)

### [DFG-Viewer.js](DFG-Viewer.js)
generates formatted source citation for Hessian civil records in LAGIS like https://dfg-viewer.de/show?id=9&tx_dlf%5Bid%5D=https%3A%2F%2Fdigitalisate-he.arcinsys.de%2Fhstam%2F903%2F9121.xml&tx_dlf%5Bpage%5D=164

### [FindAGrave.js](FindAGrave.js)
generates combines the citation prepared by FindAGrave with [external link template](https://www.wikitree.com/wiki/Template:FindAGrave) for the  memorial currently displayed in browser (inpired by [this post](https://www.wikitree.com/g2g/569133/citation-help-findagrave-now-provides-citation-suggestion) by Allison Mackler)

### [LABW.js](LABW.js)
generates formatted source citations from church book duplicates at Landesarchiv Baden-Württemberg (e.g. from https://www2.landesarchiv-bw.de/ofs21/olf/struktur.php?bestand=10028 )

### [Matricula.js](Matricula.js)
generates formatted source citations from church books at Matricula (e.g. from https://data.matricula-online.eu/de/deutschland/paderborn/DE_EBAP_10114/KB001-01-T/?pg=139 )

### [PortaFontium.js](PortaFontium.js)
generates formatted source citations from books at Porta fontium (e.g. from https://www.portafontium.eu/iipimage/30073845/pistov-standesamt-03_0050-o )

### [Riksarkivet.js](Riksarkivet.js)
generates formatted source citations from Swedish Riksarkivet (e.g. https://sok.riksarkivet.se/bildvisning/C0013667_00133 )

### [Vojvodina.js](Vojvodina.js)
generates formatted source citations from Archives of Vojvodina in Novi Sad (e.g. https://maticneknjige.org.rs/mk/maticne-knjige-jasa-tomic-1884-rimokatolici-vencani/ )

### [Volksbund.js](Volksbund.js)
generates formatted source citations from gravesearch online at Volksbund Kriegsgräberfürsorge (e.g. [English entry](https://www.volksbund.de/en/erinnern-gedenken/graebersuche-online/detail/2f1ccd88d5ece3822207243641bbb770), [German entry](https://www.volksbund.de/erinnern-gedenken/graebersuche-online/detail/2f1ccd88d5ece3822207243641bbb770) )

### [WieWasWie.js](WieWasWie.js)
opens WieWasWie formater when being on a WieWasWie detail page (e.g. https://www.wiewaswie.nl/nl/detail/29373347 )

## Creating categories

###[CopyAndRenameCategory.js](CopyAndRenameCategory.js)
creates a category preview based on a given name and the content of the category that one has open in edit mode while triggering this bookmarklet

### [FindAGraveCat.js](FindAGraveCat.js)
Creates an edit window for a cemetery category while being on the cemetery on FindAGrave (e.g. [this one](https://www.findagrave.com/cemetery/2718887/friedhof-lenzkirch)], also opens a window with a Google query for the cemetery name on BillionGraves. This is currently pretty and only rudimentary and probably only works properly in the US. Please get in touch, if you want proper support for other countries.

### [MigrationCategoryHelper.js](MigrationCategoryHelper.js)
creates and inserts template code for a migration category while being on that one's edit category page (e.g. [this one](https://www.wikitree.com/index.php?title=Category:Some%20Place%2C_Immigrants&action=edit) or [this one](https://www.wikitree.com/index.php?title=Category:Migrants_from_Some_Place_to_Some_Other_Place&action=edit)). There is no way of guessing if the category is about a country or an entity, so both parameters are filled. Make sure you delete the inappropriate one.

### [OsmLocationCategories.js](OsmLocationCategories.js)
generates templates code for creating a category from an Open Street Map search result that contains coordinates, e.g. https://www.openstreetmap.org/node/2319824131

### [WikidataLocationCategories.js](WikidataLocationCategories.js)
generates template code for creating a category when being on place entry in Wikidata

### [WikipediaBanatLocationCategories.js](WikipediaBanatLocationCategories.js)
helps creating Banat (and Batschka) location categories in German, Serbian, Hungarian and Romanian. When you are on the Wikipedia article of a village (either in language de, en, ro, hu or hr), select one language version of the village name and click the bookmarklet, it will ask, which language you selected. Then it will show the category code for that language, which will be copied into your clipboard automatically. Afterwards it will open the category for you to insert the copied code.

### [WikipediaDeLocationCategories.js](WikipediaDeLocationCategories.js)
generates template code for creating a category when being on place article in German Wikipedia

### [WikipediaDeLocationCategoriesTNG.js](WikipediaDeLocationCategoriesTNG.js)
generates template code for present-day Germany categories while being on the place article in German Wikipedia, also tries to guess state and district. For parts of a city or villages incorporated into other onces, select the name of the place it is incorporated into (e.g. select the words "Frankfurt am Main", while being on the article about [Frankfurt-Nieder-Eschbach](https://de.wikipedia.org/wiki/Frankfurt-Nieder-Eschbach). A popup is shown, from which you can copy the template code. If you forget it, don't bother, as it is also copied to the clipboard automatically. If you close the popup, the category edit page opens in a new tab. Now paste the source code. Please make sure, you apply the preview feature and common sense, before actually saving and creating the category.

### [WikipediaItLocationCategories.js](WikipediaItLocationCategories.js)
generates template code for creating a category when being on place article in Italian Wikipedia

## other

### [AllEditLinks.js](AllEditLinks.js)
makes all links to wiki pages (e.g. in a contributions list) point directly to "edit profile"

### [EastPrussiaPoland.js](EastPrussiaPoland.js)
marks all links containing counties in East Prussia that do not completely belong to present-day Poland as italic and adds small caps, in case they are shared with Poland.

### [GermanyLocationCleanup.js](GermanyLocationCleanup.js)
trying to convert FamilySearch suggested location places to something more in line with [Space:Germany_Project_Location_Field_Guidelines](https://www.wikitree.com/wiki/Space:Germany_Project_Location_Field_Guidelines)

### [Profile2G2G.js](Profile2G2G.js)
copies link to the profile to clipboard having the persons name displayed, that can be pasted in G2G directly

### [ThonNormalized.js](ThonNormalized.js)
generates scores normalized points based on the official score sheet for [SourceAThon](https://wikitree.sdms.si/Challenges/SourceAThon/TeamAndUser.htm) and [ConnectAThon](https://wikitree.sdms.si/Challenges/ConnectAThon/TeamAndUser.htm)

### [TrustedListEmail.js](TrustedListEmail.js)
collects all email adresses from one page (e.g. the Trusted List of a profile) and puts them into a new email

### [WikipediaDeFromSelectedText.js](WikipediaDeFromSelectedText.js)
opens a new German Wikipedia tab by using the text selected in the current tab

### [WikiTreeCountDescendants.js](WikiTreeCountDescendants.js)
displays the number of descendants (per generation and in total) when being on "Descendant List" like https://www.wikitree.com/genealogy/Molesworth-Descendants-131
