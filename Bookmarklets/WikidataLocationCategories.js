javascript:  
/* creates template for a category when being on entry of a Wikidata entry about the place */

var geoHackLink = document.getElementsByClassName("mw-kartographer-map")[0];
var lat = geoHackLink.getAttribute("data-lat");
var lon = geoHackLink.getAttribute("data-lon");
var coor = "coordinate=" + lat + "," + lon;  

var wikidata = "|wikidataID=";  
urlParts = window.location.toString().split("/");
wikidata = wikidata + urlParts[(urlParts.length-1)];

alert("{{CategoryInfoBox Location\n|parent=\n|project=\n|team=\n|" + coor + "\n"+ wikidata + "\n}}"); 
void(0);
