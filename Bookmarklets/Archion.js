javascript:
 
var citation = "Archion";
var breadCrumbList = document.getElementsByClassName('dvbreadcrumb')[0];
for (var i=1; valNode = breadCrumbList.getElementsByTagName("a")[i]; i++)
{
	citation += " > " + valNode.innerText;
}

var permaLinkDiv = document.getElementsByClassName("inner")[0];
var permaLink = permaLinkDiv.getElementsByTagName("a")[0].innerText;
var select_id = document.getElementsByClassName("page-select")[0];
var imageName = select_id.options[select_id.selectedIndex].text;

citation += "> picture [" + permaLink + " " + imageName +"], #";

alert(citation);