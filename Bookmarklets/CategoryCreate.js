javascript: var textArea = document.getElementById("wpTextbox1");
var val = textArea.value;
var len = textArea.selectionEnd - textArea.selectionStart;
var selected = val.substr(textArea.selectionStart, len);
var win = window.open(
  "https://www.wikitree.com/index.php?title=Category:" +
    selected +
    "&action=edit"
);
