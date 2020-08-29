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
- removing redundant shortcut for save in order to make it work (this is a bug in the WikiTree UI)
- showing private profile after saving instead of leaving edit mask open
- automatically select "no middle" name if field is empty when editing a profile

*/

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


if((window.location + "").indexOf("?") == -1 && ""+document.title.indexOf("Edit") != -1)
{
  //remove "Edit Profile of" from tab title after saving
	//document.title = document.getElementsByTagName("h1")[0].innerText.replace("Edit Profile of", "");
  
  //go to private view after saving
  window.location=window.location+"?public=1";
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


var inputMiddleName = document.getElementById('mMiddleName');
if(null != inputMiddleName)
{
  if(inputMiddleName.value == "")
  {
    document.getElementById('mStatus_MiddleName_blank').checked = true;
  }
}
