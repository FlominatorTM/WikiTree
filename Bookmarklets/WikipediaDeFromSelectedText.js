javascript: var dummy = "";
/* opens a new Wikipedia tab by using selected text */

var selection = window.getSelection();
if (selection == "" || selection.length == 0) {
  var active = document.activeElement;
  if (active.tagName == "INPUT" || active.tagName == "TEXTAREA") {
    var val = active.value;
    var len = active.selectionEnd - active.selectionStart;
    selection = val.substr(active.selectionStart, len);
  }
}

window.open(
  "https://de.wikipedia.org/w/index.php?search=" +
    selection +
    "&title=Spezial%3ASuche&ns0=1&ns1=1&ns2=1&ns4=1&ns5=1&ns6=1&ns7=1&ns9=1&ns11=1&ns14=1&ns15=1&ns100=1&ns101=1",
  "_blank"
);
void 0;
