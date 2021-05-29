// ==UserScript==
// @name          FamilySearch source info
// @namespace     https://www.familysearch.org/
// @description   adding microfilm and page number to source information
// @match https://www.familysearch.org/*
// @include   https://www.familysearch.org/
// ==/UserScript==

window.setTimeout(addFilmInfo, 2000);

function addFilmInfo()
{
  if((window.location +"").indexOf("ark") > 0)
  {
	var strFilmNumberPrefix = "filmNumber=";
	var filmNumber;
	var pageNumber;
  
    for(var i=0; aNode = document.getElementsByTagName("a")[i]; i++)
    {
        var indexOfFilmNr = aNode.href.indexOf(strFilmNumberPrefix);
        if(indexOfFilmNr > 0)
        {
            filmNumber = aNode.innerHTML;
            var tbody = aNode.parentNode.parentNode.parentNode.parentNode;
			//iterate over all table cells, assuming the last one without link is the image number
			for(var j=0; trNode = tbody.childNodes[j]; j++)
			{
				secondTd= trNode.childNodes[1].childNodes[0]
				if(secondTd.innerHTML.indexOf("<a") == -1)
				{
					pageNumber = secondTd.innerHTML;
				}
			}
            break;

          /* 	above code navigates through this DOM tree:

		<table class="css-gx1ll4">
		   <tbody><!-- this is the tbody after calling parentNode 4 times -->
			  <tr class="css-17zuftn">
				 <th scope="row" class="css-18jjc9d"><span secondary="" class="css-wikv0x"><strong>Digitale Ordnernummer</strong></span></th>
				 <td class="css-18jjc9d"><span secondary="" class="css-wikv0x"><!-- there are iterated in order to find an optional page number --><a href="https://www.familysearch.org/search/record/results?q.filmNumber=4122953" class="css-1ejm1ub-linkCss"><!-- this is the film number -->4122953</a></span></td>
			  </tr>
			  <tr class="css-17zuftn">
				 <th scope="row" class="css-18jjc9d"><span secondary="" class="css-wikv0x"><strong>GS-Filmnummer</strong></span></th>
				 <td class="css-18jjc9d"><span secondary="" class="css-wikv0x"><!-- and this one --><a href="https://www.familysearch.org/search/record/results?q.filmNumber=1946775" class="css-1ejm1ub-linkCss">1946775</a></span></td>
			  </tr>
			  <tr class="css-17zuftn">
                <th scope="row" class="css-18jjc9d"><span secondary="" class="css-wikv0x"><strong>Aufnahmenummer</strong></span></th><!-- child 0 -->
                  <td class="css-18jjc9d">
                    <span secondary="" class="css-wikv0x"><!-- and this one -->00290</span> <tr class="css-17zuftn">
				 </td>
			  </tr>
		   </tbody>
		</table>*/
        }
    }

	var pageNumberInt = parseInt(pageNumber, 10);
    var filmInfo = "FHL microfilm " + parseInt(filmNumber, 10);
	
    if(!isNaN(pageNumberInt)) //not all sources have image numbers
    {
      filmInfo = filmInfo + ", image " + pageNumberInt;
    }

    /* "Deutschland, Rheinland-Pfalz, Diözese Mainz, Katholische Kirchenbücher, 1540-1952", database, FamilySearch (https://www.familysearch.org/ark:/61903/1:1:DTBJ-FL3Z : 8 December 2020), Georg Fertig, 1831. */
    var citation = document.getElementById('citation').innerHTML;
	//already has microfilm number?	
	if(citation.indexOf("FHL microfilm") == -1)
	{
		// now let's insert the filmInfo before the name
		//and replace the existing citation by the new one
		document.getElementById('citation').innerHTML = citation.replace("),", "), " + filmInfo +",");
	}
  }
}