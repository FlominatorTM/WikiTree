javascript: 
var d = new Date(); 
var dateFormatted = d.toLocaleString("en-GB", {     day: 'numeric', month: 'long', year: 'numeric' });  
var indexOfFirstPipe = document.title.indexOf("•");
if(indexOfFirstPipe>-1)
{
	var name = document.title.toString().substring(0, indexOfFirstPipe).replace("(Deceased)", "").trim();
	var url = " (" +  window.location.origin + window.location.pathname + " : accessed " + dateFormatted + ")"; 
	var citation = name + ", FamilySearch, profile with linked sources" + url + " [temporary source until all children's profiles were created][[Category:Baden-Württemberg, Needs Profiles Created]]";
	prompt("", citation); 
}
void(0);