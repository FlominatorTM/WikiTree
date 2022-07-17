javascript:
/* usage: select citation and enter page numbers */
var d = new Date();
var dateFormatted = d.toLocaleString("en-GB", {
    day: 'numeric',
	month: 'long',
	year: 'numeric'
	});

var baseSwedish = window.getSelection()+'';
var baseEnglish = baseSwedish.replace("bildid", "Image ID").replace("sida", "p.");
var number = prompt("nr");
var name = prompt("name");
var customPart = ", nr. " + number +", "+ name + "; ";
var beforeURL = "digital images, Riksarkivet ";
var url = "(" +  window.location.origin + window.location.pathname + " : accessed " + dateFormatted + ")";
var citation = baseEnglish + customPart + beforeURL + url;
prompt("", citation);
;void(0);
