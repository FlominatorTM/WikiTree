javascript:
/* usage: open entry at https://www.wgff-tz.de/ and click this bookmark */
var name = document.getElementsByTagName("h2")[1].innerText;    
var nameParts = name.split(", ");
var firstName = nameParts[1];
var lastName = nameParts[0];

var deathDateSpan = document.getElementById("tzSterbe_Datum");
var deathDate = deathDateSpan != null ? deathDateSpan.innerText : "";

var collection = "Westdeutsche Gesellschaft für Familienkunde e.V.";

var d = new Date();
var dateFormatted = d.toLocaleString("en-GB", {
    day: 'numeric',
	month: 'long',
	year: 'numeric'
	});
    
var urlDate = " : accessed " + dateFormatted + ")";

var citation = "Totenzettel" + ", " + firstName + " " + lastName + ", " + deathDate + ", " + collection + " (" + window.location + urlDate;

prompt("",citation);
void(0);
