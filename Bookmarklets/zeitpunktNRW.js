javascript:
var library = document.title.substring(0, document.title.indexOf(" / "));
var newspaper = document.querySelector('.newspaper').innerText;
var vol = document.querySelector('.journal_volume').innerText;
var twitterTag = document.querySelector('meta[name="twitter:title"]').content;
var dateBracket = twitterTag.match(/\d{1,2}\.\d{1,2}\.\d{4}/)[0];
var dateDe = dateBracket.replace("(", "").replace(")", "");
var dateParts = dateDe.split(".");
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var dateEnglish = dateParts[0] + ' ' + months[dateParts[1]-1] + ' ' + dateParts[2];

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
