javascript:
 
var citation = "Archion";
var breadCrumbList =[0];
for (var i=1; valNode = document.getElementsByClassName('breadcrumb-item mb-0')[i]; i++)
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
