javascript:
/* usage: visit a person's page at online-ofbs.de and click this bookmarklet */
var author = "";
for (var i=0; aNode = document.getElementsByTagName("a")[i]; i++) 
{    
    href = aNode.getAttribute("href");
    if (href && (""+href).startsWith("mailto:"))     
    {      
        author = aNode.innerHTML;
    }
} 

var urlParams = new URLSearchParams(window.location.search);

var url = " (" +  window.location.origin + window.location.pathname + '?ofb=' + urlParams.get('ofb') + "&ID=" + urlParams.get('ID');

var d = new Date();
var dateFormatted = d.toLocaleString("en-GB", {
    day: 'numeric',
	month: 'long',
	year: 'numeric'
	});
    
var urlDate = " : accessed " + dateFormatted + ")";

var citation= author +': ' + document.title.replace(":", ",") + url+ urlDate;
var selected = window.getSelection()+ "";
if (selected.length > 0)
{
    citation = citation + " citing: " + selected.replace("\n", " // ");
}

prompt("",citation);
void(0);