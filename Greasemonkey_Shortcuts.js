// ==UserScript==
// @name          WikiTree input
// @namespace     https://www.wikitree.com/
// @description   adding some shortcuts and changing some links
// @match https://www.wikitree.com/*
// @include   https://www.wikitree.com/
// ==/UserScript==

//shortcut e for edit button
for (var i=0; ulNode = document.getElementsByTagName("ul")[i]; i++)
{
  if(ulNode.className == "profile-tabs")
  {
    for (var j=0; aNode = ulNode.children[j]; j++)
    {
      if(aNode.title == "Edit Profile and Family Relationships" || aNode.title == "Edit this Profile")
      {
        aNode.accessKey="e";
        break;
      }
    }
    break;
  }
}


//shortcut p for preview button
var previewButton = document.getElementsByName("preview")[0];
if(null != previewButton)
{
  previewButton.accessKey="p";
}

//remove duplicate shortcut
var wpSaves = document.getElementsByName("wpSave");
if(null != wpSaves)
{
  wpSaves[0].accessKey = "";
}

//show profile after saving
if(window.location == "https://www.wikitree.com/wiki/Special:EditPerson")
{
  var personID = document.getElementsByClassName("pureCssMenui0")[1].firstChild.innerHTML;
  window.location="https://www.wikitree.com/wiki/" + personID;
}

//make middle name empty by default
var inputMiddleName = document.getElementById('mMiddleName');
if(null != inputMiddleName)
{
  if(inputMiddleName.value == "")
  {
    document.getElementById('mStatus_MiddleName_blank').checked = true;
  }
}

insert_link_before("span", "previewbox", '<a name="preview_box">');

var wpTextbox = document.getElementById('wpTextbox1');
if(wpTextbox != null && wpTextbox.value.indexOf("Category") == -1)
{
	alert("Category is missing");
}

//replace German texts
var birthLocation = document.getElementById('mBirthLocation');
if(birthLocation != null)
{
  birthLocation.value = birthLocation.value.replace("Deutschland", "Germany").replace("Vereinigte Staaten", "United States of America");
}

var deathLocation = document.getElementById('mDeathLocation');
if(deathLocation != null)
{
  deathLocation.value = deathLocation.value.replace("Deutschland", "Germany").replace("Vereinigte Staaten", "United States of America");
}


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
