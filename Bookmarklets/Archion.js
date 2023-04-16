javascript:
 
var citation = "Archion";
var breadCrumbList = document.getElementsByClassName('dvbreadcrumb')[0];
for (var i=1; valNode = breadCrumbList.getElementsByTagName("a")[i]; i++)
{
	citation += " > " + valNode.innerText;
}

var permaLinkDivs = document.getElementsByClassName("inner");
var permaLink;
if(null != permaLinkDivs && permaLinkDivs.length > 0)
{
	permaLinkDiv = permaLinkDivs[0];
	permaLink = permaLinkDiv.getElementsByTagName("a")[0].innerText;
}
else
{
	permaLink = prompt("Please enter permalink or enable permalink and try again");
}

if (permaLink != null)
{
	var select_id = document.getElementsByClassName("page-select")[0];
	var imageName = select_id.options[select_id.selectedIndex].text;

	citation += " > picture [" + permaLink + " " + imageName +"], #";

	alert(citation);
}
void(0);
