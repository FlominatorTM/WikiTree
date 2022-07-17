javascript:
/* usage: select citation and enter page numbers */
var d = new Date();
var dateFormatted = d.toLocaleString("en-GB", {
    day: 'numeric',
	month: 'long',
	year: 'numeric'
	});

var baseSwedish = '';
for (var i=0; valNode = document.getElementsByClassName("value")[i]; i++)
{
	if(valNode.innerText.search("sida")>-1)
	{
		baseSwedish = valNode.innerText;
	}
}
var baseEnglish = baseSwedish.replace("bildid", "Image ID").replace("sida", "p.");
var number = prompt("nr");
var name = prompt("name");
var customPart = ", nr. " + number +", "+ name + "; ";
var beforeURL = "digital images, Riksarkivet ";
var url = "(" +  window.location.origin + window.location.pathname + " : accessed " + dateFormatted + ")";
var citation = baseEnglish + customPart + beforeURL + url;
prompt("", citation);
;void(0);
