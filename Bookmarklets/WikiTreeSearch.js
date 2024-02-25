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

win = window.open("");
win.document.write(
  '<form action="https://www.wikitree.com/wiki/Special:SearchPerson" method="POST" id="theForm">'
);
win.document.write(
  '<input type="text" name="wpFirst" id="wpFirst" size="35" value="' +
    firstName +
    '">'
);
win.document.write(
  '<input type="text" name="wpLast" id="wpLast" size="35" value="' +
    lastSelectedWord +
    '">'
);
win.document.write(
  '<input class="button white" type="submit" name="wpSearch" id="wpSearch" value="Search">'
);
win.document.write("</form>");
win.document.getElementById("wpLast").value = lastSelectedWord.replace(
  "_",
  " "
);

win.document.getElementById("wpSearch").click();
