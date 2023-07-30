javascript:  
var pageLang = window.location.hostname.split('.')[0];
var serbiaInPageLang = "";
var romaniaInPageLang = "";
switch(pageLang)
{
	case "de":
	{
		serbiaInPageLang = "Serbien";
		romaniaInPageLang = "Rumänien";
		break;
	}
	case "hu":
	{
		serbiaInPageLang = "Szerbia";
		romaniaInPageLang = "Románia";
		break;
	}	
	case "en":
	{
		serbiaInPageLang = "Serbia";
		romaniaInPageLang = "Romania";
		break;
	}
	case "ro":
	{
		serbiaInPageLang = "Serbia";
		romaniaInPageLang = "România";
		break;
	}
	case "hr":
	{
		serbiaInPageLang = "Srbija";
		romaniaInPageLang = "Rumunjska";
		break;
	}
}

lang = prompt("Enter language", "");
var parent1 = "";
switch(lang)
{
	case "hu":
	{
		var nameSerbia = "Szerbia";
		var nameRomania = "Románia";
		var parent1 = "Torontál vármegye or Temes vármegye";
		break;
	}
	case "de":
	{
		var nameSerbia = "Serbien";
		var nameRomania = "Rumänien";
		break;
	}
	case "ro":
	{
		var nameSerbia = "Serbia";
		var nameRomania = "România";
		break;
	}
	case "sr":
	{
		var nameSerbia = "Srbija";
		var nameRomania = "Rumunjska";
		break;
	}
}

var articleName = document.getElementsByClassName("mw-page-title-main")[0].innerText;
var akaTemplate = "";
var country = "";
var catParent = "";

var indexSerbia = document.body.innerHTML.indexOf(serbiaInPageLang);
var indexRomania = document.body.innerHTML.indexOf(romaniaInPageLang);


if(indexSerbia > -1 && ( indexRomania == -1 || indexSerbia < indexRomania))
{
	country = nameSerbia;
	catParent = country;
	if(lang == "sr")
	{
		catParent = "Vojvodina";
	}
	akaTemplate = "{{Aka|" + articleName + ", " + "Srbija" + "|" + lang + "}}";
}

else if(indexRomania > -1 && (indexSerbia == -1 || indexRomania < indexSerbia))
{
	country = nameRomania;
	catParent = country;
	if(lang == "ro")
	{
		catParent = "Judeţul Timiș or Judeţul Arad or ...";
	}
	akaTemplate = "{{Aka|" + articleName + ", " + "România" + "|" + lang + "}}";
}

else
{
	alert("didn't find the German country names for Serbia and Romania, trying English");
}


var village = window.getSelection()+ "";
var catName = village.trim() + ", " + country;

/* creates template for a category when being on entry of German Wikipedia article about the place */
var lat = "";
var lon = "";
var coor = "";  
try
{
	lat = document.getElementsByClassName("latitude")[0].innerHTML + ""; 
	lon = document.getElementsByClassName("longitude")[0].innerHTML + ""; 
	coor = "coordinate=" + lat + "," + lon; 
	if(coor.indexOf("°")>-1)
	{
		coor = "coordinate=" + document.getElementsByClassName("geo")[0].innerText.replace("; ", ",");
	}
}
catch(err)
{
	alert("careful: no coordinates found");
}

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
var output = akaTemplate + "\n" + "{{CategoryInfoBox Location\n|parent=" + catParent + "\n|parent1=" + parent1  + "\n|project=\n|team=\n|" + coor + "\n"+ wikidata + "\n}}";
if (navigator.userAgent.includes("Chrome")) 
{
	prompt("", output); 
}
else
{
	alert(output);
}

 navigator.clipboard.writeText(output);

var newWin = window.open("https://www.wikitree.com/index.php?title=Category:" + catName +"&action=edit", "");
if(lang == "hu")
{
	var temes = window.open("http://www.hungarianvillagefinder.com/HVFIndex2/50_TEMES.html");
	var torontal = window.open("http://www.hungarianvillagefinder.com/HVFIndex2/53_TORONTAL.html");
}
void(0);