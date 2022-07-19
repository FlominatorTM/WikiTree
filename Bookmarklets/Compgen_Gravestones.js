javascript:
/* usage: visit a gravestone page at grabsteine.genealogy.net , select an entry and click this bookmarklet */
var d = new Date();
var dateFormatted = d.toLocaleString("en-GB", {
    day: 'numeric',
	month: 'long',
	year: 'numeric'
	});
    
var beginning = "Verein für Computergenealogie, Grabstein-Projekt, database and images ";
var urlParams = new URLSearchParams(window.location.search);
var url = "(" +  window.location.origin + window.location.pathname + '?cem=' + urlParams.get('cem') + "&tomb=" + urlParams.get('tomb');
var urlDate = " : accessed " + dateFormatted + ")";
var middle = " gravestone";
var selected = window.getSelection()+ "";
if (selected.length > 0)
{
    middle = middle + " for ''" + selected + "''";
}
middle = middle + " at ";

var cemetery = document.getElementsByTagName("h2")[0].innerText;
var photoby = ", photographed in ";
var year = "";

for (var i=0; imgNode = document.getElementsByTagName("img")[i]; i++)
{
    if(imgNode.src.search("textgrafik.php")>-1)
    {
       var thisYear = imgNode.nextSibling.textContent.replace(",", "").trim();
       if(year.search(thisYear) == -1)
       {
           if(year.length == 0)
           {
               year = thisYear;
           }
           else
           {
               year = year + "/" + thisYear;
           }
       }
    }
}

var citation = beginning + url +  urlDate + middle + cemetery + photoby + year;
prompt("", citation);
;void(0);