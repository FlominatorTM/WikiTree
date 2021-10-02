// ==UserScript==
// @name          WikiTree input
// @namespace     https://www.wikitree.com/
// @description   adding some shortcuts and changing some links (see below for details)
// @match https://www.wikitree.com/*
// @include   https://www.wikitree.com/
// ==/UserScript==

/*
Features:
- keyboard shortcuts for edit (E) and preview (P), see browser manual for details (in Firefox is ALT + SHIFT + shortcut)
- showing private profile after saving instead of leaving edit mask open
- automatically select "no middle name" if field is empty when editing a profile
- show message box when there is no category present
- copy URL parameter wpSummary into the summary field 
- show "Add FamilySearch ID" if needed
- do not open links on result page of "Add FamilySearch ID" in new window
*/

//show link to add FamilySearch ID if not present
for (var i=0; strongNode = document.getElementsByTagName("strong")[i]; i++)
{
	if(strongNode.textContent == "Research")
	{
		spanRootsSearch = strongNode.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
		brBeforeHere = spanRootsSearch.nextSibling.nextSibling;
		if(null == brBeforeHere)
		{
      var unsafeWindow = window.wrappedJSObject;
      var insertTag = document.createElement("span");
      var linkAddFamilySearch = '<a href="https://www.wikitree.com/index.php?title=Special:EditFamilySearch&action=viewUser&user_name='+unsafeWindow['wgPageName']+'">Add FamilySearch ID</a>';
      var linkSearchFamilyTree = '<a href="https://www.familysearch.org/tree/find/name">search</a>';
			insertTag.innerHTML=/* */'<h3>'+ linkAddFamilySearch +'</h3><br>' + linkSearchFamilyTree ;/* */
			spanRootsSearch.parentNode.insertBefore(insertTag, spanRootsSearch);
		 
			/* HTML of profile without FamilySearch ID looks like this
			<span class="large"><strong>Research</strong></span><br/>
			<a href="https://apps.wikitree.com/apps/york1423/rootssearch/?profile=Huber-4117" target="_blank">RootsSearch for Lorenz Huber</a>: conveniently search 20+ genealogy websites.
			<span class="SMALL">[<a href="/wiki/RootsSearch" target="_Help" title="More information about the RootsSearch app">more info</a>]</span>
			</div>
			</div> <!-- end 7 -->
			*/
		}//if
	}//if
}//for

//do not open links from the FamilySearch connection result page in new window
if (window.location.search.match(/Special:EditFamilySearch/))
{
  for (var i=0; aNode = document.getElementsByTagName("a")[i]; i++)
  {
    if(aNode.target="_blank")
    {
      aNode.target="";
    }
  }
}

//shortcut e for edit button
for (var j=0; aNode = document.getElementsByClassName("profile-tabs")[0].children[j]; j++)
{
  if(aNode.title == "Edit Profile and Family Relationships" || aNode.title == "Edit this Profile")
  {
    aNode.accessKey="e";
    break;
  }
}


//go to private view after saving
if(window.location.search.match(/errcode=saved/) != null)
{
  var personID = document.getElementsByClassName("pureCssMenui0")[1].firstChild.innerHTML;
  window.location="https://www.wikitree.com/wiki/" + personID + "?public=1";
}

//shortcut p for preview button
var previewButton = document.getElementsByName("preview")[0];
if(null != previewButton)
{
  previewButton.accessKey="p";
}

  
// automatically check "no middle name"
var inputMiddleName = document.getElementById('mMiddleName');
if(null != inputMiddleName)
{
  if(inputMiddleName.value == "")
  {
    document.getElementById('mStatus_MiddleName_blank').checked = true;
  }
}

insert_link_before("span", "previewbox", '<a name="preview_box">');


//copy summary from URL parameter wpSummary into summary field (if provided explicitly)
var match = window.location.search.match(/(\?|&)wpSummary\=([^&]*)/);
if(match!=null)
{
	var parameterValue = decodeURIComponent(match[2]);
	document.getElementById('wpSummary2').value = parameterValue;
}

//show message box when there is no "Category" present
//except summary was provided, because then I want to be fast
var wpTextbox = document.getElementById('wpTextbox1');
if(match==null && wpTextbox != null && wpTextbox.value.indexOf("Category") == -1)
{
	alert("Category is missing");
}

//replace German country names by English ones
/*
var birthLocation = document.getElementById('mBirthLocation');
if(birthLocation != null)
{
  birthLocation.value = birthLocation.value.replace("Deutschland", "Germany").replace("Vereinigte Staaten", "United States");
}

//replace German country names by English ones
var deathLocation = document.getElementById('mDeathLocation');
if(deathLocation != null)
{
  deathLocation.value = deathLocation.value.replace("Deutschland", "Germany").replace("Vereinigte Staaten", "United States");
}*/

//Insert any tag before any element with an id
function insert_link_before(tagname, previous_element, linkcode)
{
	var vl_logout = document.getElementById(previous_element);
 	if (vl_logout) 
 	{
 		var ins_li = document.createElement(tagname);
 		ins_li.innerHTML=/* */linkcode;/* */
 		 vl_logout.parentNode.insertBefore(ins_li, vl_logout);
 	}
}
