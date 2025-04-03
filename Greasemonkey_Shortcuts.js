// ==UserScript==
// @name          WikiTree input
// @namespace     https://www.wikitree.com/
// @description   adding some shortcuts and changing some links (see below for details)
// @match https://*.wikitree.com/*
// @include   https://*.wikitree.com/
// ==/UserScript==


//focus on Challenge Tracker after saving profile
if (window.location.href.includes("errcode=saved")) {
  const aTags = document.getElementsByTagName("a");
  for (let i = 0; i < aTags.length; i++) {
    if (
      aTags[i].href != null &&
      aTags[i].href.includes("Challenge.htm") &&
      aTags[i].title.includes("Click here")
    ) {
      aTags[i].focus();
    }
  }
}

// automatically select Germany challenge
if (window.location.href.includes("WTChallenge")) {
  var checkboxes = document.getElementsByName("challengex");
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].value.includes("Germany")) {
      checkboxes[i].checked = true;
      break;
    }
  }

  const buttons = document.getElementsByClassName("btn btn-default");
  buttons[0].focus();
}

//add "and" in parents linking example
var allExamples = document.getElementsByClassName("EXAMPLE");

if (
  allExamples[2].innerHTML != null &&
  allExamples[2].innerHTML.search(/\]\] \[\[/) > -1
) {
  allExamples[2].innerText = allExamples[2].innerHTML.replace(
    "]] [[",
    "]] and [["
  );
}

//show link to add FamilySearch ID if not present
for (
  var i = 0;
  (strongNode = document.getElementsByTagName("strong")[i]);
  i++
) {
  if (strongNode.textContent == "Research") {
    spanRootsSearch =
      strongNode.parentNode.nextSibling.nextSibling.nextSibling.nextSibling
        .nextSibling;
    brBeforeHere = spanRootsSearch.nextSibling.nextSibling;
    if (null == brBeforeHere) {
      var unsafeWindow = window.wrappedJSObject;
      var insertTag = document.createElement("span");
      var linkAddFamilySearch =
        '<a href="https://www.wikitree.com/index.php?title=Special:EditFamilySearch&action=viewUser&user_name=' +
        unsafeWindow["wgPageName"] +
        '">Add FamilySearch ID</a>';
      var linkSearchFamilyTree =
        '<a href="https://www.familysearch.org/tree/find/name">search</a>';
      insertTag.innerHTML =
        /* */ "<h3>" +
        linkAddFamilySearch +
        "</h3><br>" +
        linkSearchFamilyTree; /* */
      spanRootsSearch.parentNode.insertBefore(insertTag, spanRootsSearch);

      /* HTML of profile without FamilySearch ID looks like this
			<span class="large"><strong>Research</strong></span><br/>
			<a href="https://apps.wikitree.com/apps/york1423/rootssearch/?profile=Huber-4117" target="_blank">RootsSearch for Lorenz Huber</a>: conveniently search 20+ genealogy websites.
			<span class="SMALL">[<a href="/wiki/RootsSearch" target="_Help" title="More information about the RootsSearch app">more info</a>]</span>
			</div>
			</div> <!-- end 7 -->
			*/
    } //if
  } //if
} //for

//do not open links from the FamilySearch connection result page in new window
if (window.location.search.match(/Special:EditFamilySearch/)) {
  for (var i = 0; (aNode = document.getElementsByTagName("a")[i]); i++) {
    if ((aNode.target = "_blank")) {
      aNode.target = "";
    }
  }
}

//shortcut e for edit button
for (
  var j = 0;
  (aNode = document.getElementsByClassName("profile-tabs")[0].children[j]);
  j++
) {
  if (
    aNode.title == "Edit Profile and Family Relationships" ||
    aNode.title == "Edit this Profile"
  ) {
    aNode.accessKey = "e";
    break;
  }
}

//go to private view after saving (currently not working for FreeSpace pages
if (window.location.search.match(/errcode=saved/) != null) {
  var personID =
    document.getElementsByClassName("pureCssMenui0")[1].firstChild.innerHTML;
  window.location = "https://www.wikitree.com/wiki/" + personID + "?public=1";
}

//shortcut p for preview button
var previewButton = document.getElementsByName("preview")[0];
if (null != previewButton) {
  previewButton.accessKey = "p";
}

// automatically check "no middle name"
var inputMiddleName = document.getElementById("mMiddleName");
if (null != inputMiddleName) {
  if (inputMiddleName.value == "") {
    document.getElementById("mStatus_MiddleName_blank").checked = true;
  }
}

insert_link_before("span", "previewbox", '<a name="preview_box">');

//copy summary from URL parameter wpSummary into summary field (if provided explicitly)
var match = window.location.search.match(/(\?|&)wpSummary\=([^&]*)/);
if (match != null) {
  var parameterValue = decodeURIComponent(match[2]);
  document.getElementById("wpSummary2").value = parameterValue;
}

//show message box when there is no "Category" present
//except summary was provided, because then I want to be fast
var wpTextbox = document.getElementById("wpTextbox1");

if (wpTextbox != null) {
  //remove right column in edit mode and made textbox bigger
  wpTextbox.cols = "280";

  const lowerSidebar = document.querySelector("#Lower-Sidebar");
  if (lowerSidebar) {
    lowerSidebar.remove();
  }

  const els = document.querySelectorAll(
    "#wpTextbox1, div.CodeMirror, #editform .col-lg-8"
  );

  els.forEach((el) => {
    el.style.setProperty("width", "auto", "important");
  });
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
function insert_link_before(tagname, previous_element, linkcode) {
  var vl_logout = document.getElementById(previous_element);
  if (vl_logout) {
    var ins_li = document.createElement(tagname);
    ins_li.innerHTML = /* */ linkcode; /* */
    vl_logout.parentNode.insertBefore(ins_li, vl_logout);
  }
}
