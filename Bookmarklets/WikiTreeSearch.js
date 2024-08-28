javascript: var selectedText = window.getSelection() + "";
/* searches for a selected name in WikiTree by splitting it at the last blank */

if (selectedText == "") {
  selectedText = prompt("please enter search text");
  if (selectedText == null || selectedText == "") {
    throw new Error("empty search string");
  }
}

selectedText = selectedText.trim();

selectedText = selectedText
  .replace(" von ", " von_")
  .replace(" van ", " van_")
  .replace(" de ", " de_")
  .replace(" din ", " din_");
var selectedParts = selectedText.split(" ");
var lastSelectedWord = selectedParts[selectedParts.length - 1];
var firstName = "";
if (selectedParts.length > 1) {
  firstName = selectedText.replace(" " + lastSelectedWord, "");
}
firstName = firstName.toLowerCase();

var lastName = lastSelectedWord.replace("_", " ");

let replacements = {
  josef: "jose*",
  joseph: "jose*",
};

if(replacements[firstName] != null)
{
  firstName = replacements[firstName];
}

window.open(
  "https://apps.wikitree.com/apps/straub620/wt_search.php?first_name=" +
    firstName +
    "&last_name=" +
    lastName
);
void(0);
