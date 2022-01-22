javascript:  
/* based on https://www.wikitree.com/g2g/569133/citation-help-findagrave-now-provides-citation-suggestion */
var dateHolder = document.getElementById('dateHolder');

var templateCode = "''Find A Grave,'' database and images (https://www.findagrave.com : accessed " 
	+ dateHolder.innerText 
	+ dateHolder.nextSibling.wholeText.replace('Find a Grave Memorial ID', '')
	+ "{{FindAGrave|" + dateHolder.nextSibling.nextSibling.innerText +"}}"
	+ dateHolder.nextSibling.nextSibling.nextSibling.wholeText
		.replace( /[\r\n\t]+/gm, "") /* remove newlines etc. */
		.replace(/  +/g, ' ') /* remove multiple blanks */
	+ dateHolder.nextSibling.nextSibling.nextSibling.nextSibling.innerText
	+ ")"; 
prompt("", templateCode);
void(0);