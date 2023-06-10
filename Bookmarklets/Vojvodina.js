javascript:
var url = window.location + "";

var confession = "";
if(url.indexOf("rimokatolici")>-1)
{
	confession = "Roman Catholic";
}
else if(url.indexOf("ravoslavni-srbi")>-1)
{
	confession = "Serbian Orthodox";
}

var type = "";
if(url.indexOf("krsteni")>-1)
{
	type = "baptisms (probably duplicates), ";
}
else if(url.indexOf("umrli")>-1)
{
	type = "burials (probably duplicates), ";
}
else if(url.indexOf("vencani")>-1)
{
	type = "marriages (probably duplicates), ";
}

var year = "";
var urlParts = url.split("-");
var yearIndex = -1;
for(var i = 0; i < urlParts.length; i++)
{
	if(!isNaN(parseFloat(urlParts[i])) && isFinite(urlParts[i]))
	{
		year = urlParts[i];
		yearIndex = i;
		break;
	}
}

var placeIndex = 2;
var place = "";
while(placeIndex < yearIndex)
{
	place = place.trim() + " " + urlParts[placeIndex].charAt(0).toUpperCase() + urlParts[placeIndex].slice(1);	
	placeIndex++;
}
place = place + ", ";


var d = new Date();
var dateFormatted = d.toLocaleString("en-GB", {
    day: 'numeric',
	month: 'long',
	year: 'numeric'
	});

var year_and_image = year;
num_image_input = prompt("Image number?", "000");
if(num_image_input != null && num_image_input != "" && num_image_input != "000")
{
	year_and_image = year + ", image " + num_image_input + " ";
}


var urlDate = " : accessed " + dateFormatted + ")";

var citation = "Archives of Vojvodina in Novi Sad, " + place  + confession + " " + type + year_and_image + " (" + url + urlDate;

prompt("",citation);
void(0);
