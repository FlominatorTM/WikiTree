javascript:  
/* creates template for a category when being on entry of German Wikipedia article about the place */

var states = ["Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen", "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen", "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen"];

var closestValue = Number.MAX_VALUE;
var statePosition = -1;

for (var i=0; i < states.length ; i++)  
{
	var indexOfCurrentState = window.document.body.innerHTML.indexOf(states[i]);
	if(indexOfCurrentState > -1 && indexOfCurrentState < closestValue )
	{
		statePosition = i;
		closestValue = indexOfCurrentState;
	}
}

theState = states[statePosition];
theCounty = "";
for (var i=0; aTag = document.getElementsByTagName("a")[i]; i++)
{
	if(aTag.innerText.toLowerCase().indexOf("kreis") >- 1 && aTag.innerText != "Landkreis")
	{
		theCounty = aTag.innerText.replace("Landkreis", "");
		if(theCounty.toLowerCase().indexOf("kreis") == -1)
		{
			theCounty = theCounty + " (Kreis)";
		}
		break;
	}
}


var parentPlace = window.getSelection()+ "";

if(parentPlace != "")
{
	theCounty = parentPlace;
}

var lat = "";
var lon = "";
try
{
	lat = document.getElementsByClassName("latitude")[0].innerHTML + ""; 
	lon = document.getElementsByClassName("longitude")[0].innerHTML + ""; 
}
catch(err)
{
	alert("careful: no coordinates found");
}
var coor = "coordinate=" + lat + "," + lon;  
var wikidata = "|wikidataID=";  
var allAnkerNodes = document.getElementsByTagName("a"); 
for (var i=0; i < allAnkerNodes.length ; i++)  
{
	if ( href = allAnkerNodes[i].getAttribute("href")) 
	{ 
		hrefParts = href.split("/"); 
		if(hrefParts[4]=="Special:EntityPage") 
		{ 
			wikidata = wikidata + hrefParts[5]; 
			break; 
		} 
	} 
}  
var output = "{{CategoryInfoBox Location\n|parent=" + theCounty +", " + theState  + "\n|project=Germany\n|team=\n|" + coor + "\n"+ wikidata + "\n}}";
if (navigator.userAgent.includes("Chrome")) 
{
	prompt("", output); 
}
else
{
	alert(output);
}
void(0);