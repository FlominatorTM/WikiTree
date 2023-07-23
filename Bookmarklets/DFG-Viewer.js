javascript:

var unknown = "unknown document structure, please report to Straub-620";
var labelTitle = document.getElementsByClassName("tx-dlf-title")[0].innerText;

if(labelTitle != "Titel")
{
	alert(unknown);
}

var ddTitle = document.getElementsByClassName("tx-dlf-title")[1];
var ddAuthor = ddTitle.nextSibling.nextSibling;
var title = ddTitle.innerText;
var author = ddAuthor.innerText;
var urlParts = window.location.search.substr(1).split("&");
var page ="";
var signature = "";
for (var i=1; urlParameter = urlParts[i]; i++)
{
	
	urlParameter = decodeURIComponent(urlParameter);
	if(urlParameter.indexOf("tx_dlf[page]") > -1)
	{
		page = urlParameter.split("=")[1];
	}
	
	/* https://digitalisate-he.arcinsys.de/hstam/903/9121.xml */
	if(urlParameter.indexOf("tx_dlf[id]") > -1)
	{
		urlParameter = urlParameter.replace(".xml", "").replace("https://", "");
		parameterParts = urlParameter.split("/");
		if(parameterParts[1] == "hstam")
		{
			signature = "HStAM Bestand " + parameterParts[2] + " Nr. " + parameterParts[3];
		}
		else
		{
			alert(unknown);
		}
	}
}

var d = new Date();
var dateFormatted = d.toLocaleString("en-GB", {
    day: 'numeric',
	month: 'long',
	year: 'numeric'
	});
    
var urlDate = " : accessed " + dateFormatted + ")";

var citation = "";

if(signature != "")
{
	citation += signature + ", ";
}

citation += author + ", " + title + ", image " + page + " ([" + window.location +" DFG-Viewer]"+ urlDate;

prompt("",citation);
void(0);
