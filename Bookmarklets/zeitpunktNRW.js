javascript:
var library = document.title.substring(0, document.title.indexOf(" / "));
var newspaper = document.querySelector('.newspaper').innerText;
var vol = document.querySelector('.journal_volume').innerText;
var dateLink = document.querySelector('.vl-plinks-date').firstChild.href;
var dateIso = dateLink.substring(dateLink.indexOf("=")+"=".length);
var dateParts = dateIso.split("-");

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var dateEnglish = dateParts[2] + ' ' + months[dateParts[1]-1] + ' ' + dateParts[0];

var d = new Date();
var dateFormatted = d.toLocaleString("en-GB", {
    day: 'numeric',
	month: 'long',
	year: 'numeric'
	});
    
var urlDate = " : accessed " + dateFormatted + ")";

var citation = newspaper + ', volume ' + vol + ", "  + dateEnglish + " ([" + window.location +" zeit.punktNRW via " + library+ "]"+ urlDate;

prompt("",citation);
void(0);
