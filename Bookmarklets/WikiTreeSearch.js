javascript: var selectedText = window.getSelection() + "";
/* searches for a selected name in WikiTree by splitting it at the last blank */
document.write(
  '<form action="https://www.wikitree.com//wiki/Special:SearchPerson" method="POST" id="theForm">'
);
document.write('<input type="text" name="wpFirst" id="wpFirst" size="35" ">');
document.write('<input type="text" name="wpLast" id ="wpLast" size="35">');
document.write(
  '<input class="button white" type="submit" name="wpSearch" id="wpSearch" value="Search">'
);
document.write("</form>");

var selectedParts = selectedText.split(" ");
var lastSelectedWord = selectedParts[selectedParts.length - 1];

if (selectedParts.length > 1) {
  document.getElementById("wpFirst").value = selectedText.replace(
    " " + lastSelectedWord,
    ""
  );
}
document.getElementById("wpLast").value = lastSelectedWord;
document.getElementById("wpSearch").click();
