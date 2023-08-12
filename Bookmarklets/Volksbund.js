javascript:
/* copies data from volksbund.de in any language version */
var citation = "[[Space:Volksbund_Deutsche_Kriegsgräberfürsorge|Volksbund Deutsche Kriegsgräberfürsorge]], ";
citation += document.getElementsByClassName('title')[0].innerText + ", ";

/* name */
citation += document.getElementsByClassName('detail-headline')[0].innerText;

var da = new Date();
var dateFormatted = da.toLocaleString("en-GB", {
    day: 'numeric',
	month: 'long',
	year: 'numeric'
	});

citation += " (" + window.location + " : accessed " + dateFormatted + ") citing: ";

tableText = document.getElementsByClassName('row overview')[0].innerText;
tableParts = tableText.split("\n");

for(var i=0;i<tableParts.length; i++)
{
    if(tableParts[i].length > 1)
    {
        citation+=tableParts[i];
        if(i+1 < tableParts.length)
        {
            if(tableParts[i+1] != "")
            {
                citation+=": ";
            }
            else
            {
               citation+=", "; 
            }
        }
    }
}
alert(citation);
