javascript:
var navPath = document.getElementById('navPath');
var newspaper = navPath.firstChild.firstChild.innerText;
var spans = navPath.getElementsByTagName('span');
var dateAndMaybeIssue = spans[spans.length-1].innerText;
var dateParts = dateAndMaybeIssue.split('.');

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var dateEnglish = dateParts[0] + ' ' + months[dateParts[1]-1] + ' ' + dateParts[2];

/* potential issue number etc. */
for (let i = 3; i < dateParts.length; i++) 
{
    dateEnglish = dateEnglish + '.' + dateParts[i];
}

dateEnglish = dateEnglish.replace(' (', ', ').replace(')','');

var d = new Date();
var dateFormatted = d.toLocaleString("en-GB", {
    day: 'numeric',
	month: 'long',
	year: 'numeric'
	});
    
var urlDate = " : accessed " + dateFormatted + ")";

var citation = newspaper + ', ' + dateEnglish + " ([" + window.location +" Badische Landesbibliothek]"+ urlDate;

prompt("",citation);
void(0);
