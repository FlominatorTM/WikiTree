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
  var strFilmNumberPrefix = "filmNumber=";
  var filmNumber;
  var pageNumber;
  
  for(var i=0; aNode = document.getElementsByTagName("a")[i]; i++)
  {
      var indexOfFilmNr = aNode.href.indexOf(strFilmNumberPrefix);
      if(indexOfFilmNr > 0)
      {
          filmNumber = aNode.innerHTML;
          var tr = aNode.parentNode.parentNode.parentNode;
          var tdWithPageNumber= tr.nextSibling.childNodes[1];
          pageNumber = tdWithPageNumber.firstChild.innerHTML;
          break;
        
        /* 	above code navigates through this DOM tree:
        
						<a href="https://www.familysearch.org/search/record/results?q.filmNumber=008114118" class="css-1ejm1ub-linkCss">008114118</a>
					</span>
         </td>
        </tr><!-- this is the tr after calling parentNode 3 times -->
						<tr class="css-17zuftn"><!-- this is the next sibling -->
            	<th scope="row" class="css-18jjc9d"><span secondary="" class="css-wikv0x"><strong>Aufnahmenummer</strong></span></th><!-- child 0 -->
                <td class="css-18jjc9d"><!-- child 1: tdWithPageNumber-->
                	<span secondary="" class="css-wikv0x"><!-- innerHTML of first child-->00290</span>        */
      }
  }

  var pageNumberInt = parseInt(pageNumber, 10);
  var filmInfo = "FHL film " + parseInt(filmNumber, 10);
  if(!isNaN(pageNumberInt)) //not all sources have image numbers
  {
    filmInfo = filmInfo + ", image " + pageNumberInt;
  }

  
  /* "Deutschland, Rheinland-Pfalz, Diözese Mainz, Katholische Kirchenbücher, 1540-1952", database, FamilySearch (https://www.familysearch.org/ark:/61903/1:1:DTBJ-FL3Z : 8 December 2020), Georg Fertig, 1831. */
  // now let's insert the filmInfo before the name
  var citation = document.getElementById('citation').innerHTML.replace("),", "), " + filmInfo +",");
  //and replace the existing citation by the new one
  document.getElementById('citation').innerHTML = citation;
}