javascript:
var citation = "Matricula online";

var breadCrumbList = document.getElementsByClassName('breadcrumb')[0];

for (var i=1; valNode = breadCrumbList.getElementsByTagName("a")[i]; i++)
{
	citation += " > " + valNode.innerText;
}

var infoTable = document.getElementsByClassName("table table-register-data")[0];
var signature = infoTable.getElementsByTagName("td")[1].innerText;
var bookType = infoTable.getElementsByTagName("td")[2].innerText;
var from = infoTable.getElementsByTagName("td")[3].innerText;
var until = infoTable.getElementsByTagName("td")[4].innerText;    
var imageName = document.getElementsByClassName("active")[2].innerText.replace("_", " ");

citation+= " > " + bookType + " (" + from + " – " + until + ", " + signature + ") > picture [" + window.location + " " + imageName +"], #";

prompt("", citation);
;void(0);

