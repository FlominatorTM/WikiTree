javascript: 
/* 
 this will temporarily change all links to wiki pages to directly open in edit view
 one can also add customer parameters like wpSummary (which will fill the summary field
 in combination with Greasemonkey_Shortcuts.js
*/
var strNewHref = prompt('enter URL part that links should be replaced by', '/index.php?action=edit&wpSummary=&title=');
for (var i=0; aNode = document.getElementsByTagName("a")[i]; i++) 
{     
	if ( href = aNode.getAttribute("href") )     
	{      
		href = href.replace(/\/wiki\//, strNewHref);
		aNode.setAttribute("href", href);  
	} 
} 
void(0);

