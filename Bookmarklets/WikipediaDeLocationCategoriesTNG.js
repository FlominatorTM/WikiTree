javascript:  
/* creates template for a category when being on entry of German Wikipedia article about the place */

var states = ["Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen", "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen", "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen"];

var closestValue = Number.MAX_VALUE;
var statePosition = -1;

var startIntro = window.document.body.innerHTML.indexOf("<b>");
var endIntro = window.document.body.innerHTML.indexOf("mw-toc-heading");
var intro = window.document.body.innerHTML.substring(startIntro, endIntro);

for (var i=0; i < states.length ; i++)  
{
	var indexOfCurrentState = intro.indexOf(states[i]);

	if(indexOfCurrentState > -1 && indexOfCurrentState < closestValue )
	{
		statePosition = i;
		closestValue = indexOfCurrentState;
	}
}


theState = states[statePosition];
theCounty = "";

var hasVerbandsgemeinde = intro.indexOf("Verbandsgemeinde") > -1;
var parentPlace = window.getSelection()+ "";

if(parentPlace != "")
{
	theCounty = parentPlace;
}
else
{
	for (var i=0; aTag = document.getElementsByTagName("a")[i]; i++)
	{
		if(aTag.innerText.toLowerCase().indexOf("kreis") >- 1 && aTag.innerText != "Landkreis" && aTag.innerText != "Kreis")
		{
			theCounty = aTag.innerText.replace("Landkreis", "");
            if(theCounty.indexOf("Kreis")==0)
            {
                theCounty = theCounty.replace("Kreis", "");
            }
			if(theCounty.toLowerCase().indexOf("kreis") == -1)
			{
				theCounty = theCounty + " (Kreis)";
			}
			if(!hasVerbandsgemeinde)
			{
				/* might come later */
				break;
			}
		}
		else if(aTag.innerText.startsWith("Verbandsgemeinde")&& aTag.innerText != "Verbandsgemeinde")
		{
			var indexSpace = aTag.innerText.indexOf(" ") + " ".length;
			theCounty = aTag.innerText.substring(indexSpace) + " (Verbandsgemeinde)";
			break;
		}

	}
}
theCounty = theCounty.trim();

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

 navigator.clipboard.writeText(output);

var article = document.getElementsByClassName('mw-page-title-main')[0].innerText;
var new_window = window.open("https://www.wikitree.com/index.php?title=Category:" + article  + ", " + theState+ "&action=edit");
void(0);
