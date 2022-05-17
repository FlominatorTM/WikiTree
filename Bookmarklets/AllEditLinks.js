javascript: 
/* 
 this will temporarily change all links to wiki pages to directly open in edit view
 one can also add customer parameters like wpSummary (which will fill the summary field
 in combination with Greasemonkey_Shortcuts.js
*/
var strNewHref = prompt('enter URL part that links should be replaced by (w= for IDs like Straub-620, u= is for numbers', '/index.php?title=Special:EditPerson&wpSummary=&w=');
var allAnkerNodes = document.getElementsByTagName("a");
for (var i=0; i < allAnkerNodes.length ; i++) 
{     
	if ( href = allAnkerNodes[i].getAttribute("href") )     
	{ 
		href = href.replace(/\/wiki\//, strNewHref);
		allAnkerNodes[i].setAttribute("href", href);  
	} 
} 
void(0);
