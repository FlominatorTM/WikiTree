javascript:  
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
var output = "{{CategoryInfoBox Location\n|parent=\n|project=\n|team=\n|" + coor + "\n"+ wikidata + "\n}}";
if (navigator.userAgent.includes("Chrome")) 
{
	prompt("", output); 
}
else
{
	alert(output);
}
void(0);