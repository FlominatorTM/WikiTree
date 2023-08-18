javascript:
var IS_BOOKMARKLET = true;
var _id = document.getElementsByClassName('copyme')[0].innerText;
var _name = document.querySelector('[itemprop=name]').innerText;

var _lat = "";
var _lon = "";

try
{
_lat = document.querySelector('[title=Latitude\\:]').innerText;
_lon = document.querySelector('[title=Longitude\\:]').innerText;
}
catch
{}

var _location = document.querySelector('[itemprop=addressLocality]').innerText;
var _locationParts = _location.split(", ");
var _county = _locationParts[_locationParts.length-1];
var _state =  document.querySelector('[itemprop=addressRegion]').innerText;
var _locationCategory = _county + ", " + _state;
if(!IS_BOOKMARKLET && _locationParts.length > 1)
{
const potentialCityCategory = _locationParts[0] + ", " + _state;
let catUrl = "https://www.wikitree.com/wiki/Category:" + encodeURI(potentialCityCategory);
let xmlHttp = new XMLHttpRequest();
xmlHttp.open("GET", catUrl, false); /* false for synchronous request */
xmlHttp.send(null);
if (xmlHttp.status < 400) {
  _locationCategory = potentialCityCategory;
} 
}

/*var _country = document.querySelector('[itemprop=addressCountry]').innerText;*/
var _catName = _name + ", " + _locationParts[0] + ", " + _state;
var _address = "";
try 
{
  _address = document.querySelectorAll('[itemprop=address]')[1].innerHTML.replace("<br>", ", ").trim();
}
catch 
{
}

var _aka = "";
try 
{
  _aka = document.querySelector('[itemprop=alternateName]').innerText;
}
catch 
{

}

var output = "{{CategoryInfoBox Cemetery " +
"\n|name=" + _name +
"\n|aka=" + _aka  +
"\n|address=" + _address +
"\n|parent=" + _county + ", " + _state +
"\n|location=" + _locationCategory +
"\n|spacepage= "+
"\n|wikidataID="+
"\n|findagraveID=" + _id +
"\n|billiongravesID= "+
"\n|webpage= "+
"\n|searchwebpage= "+
"\n|coordinate="+ _lat + "," + _lon +
"\n|startdate= "+
"\n|enddate=\n}}";

if (navigator.userAgent.includes("Chrome")) 
{
	prompt("", output); 
}
else
{
	alert(output);
}

var otherWin = window.open("https://www.wikitree.com/index.php?title=Category:" + _catName + "&action=edit");


var billon = "https://www.google.com/search?q=" + encodeURIComponent("site:https://billiongraves.com " + _name + " " + _location);
var win = window.open(billon);
void(0);