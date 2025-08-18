javascript: var dummy;
/* place cursor inside an bulleted source before clicking
 might be still buggy, use at own risk */
var wpTextbox = document.getElementById("wpTextbox1");
var wpTextbox = document.activeElement;
var selectionStart = wpTextbox.selectionStart;
var indexEndRef = wpTextbox.value.indexOf("\n", selectionStart);

var indexStartRef = -1;
if (indexEndRef > -1) {
  indexStartRef = wpTextbox.value.lastIndexOf("*", indexEndRef);
} else {
  indexStartRef = wpTextbox.value.lastIndexOf("*");
}

if (indexStartRef == -1) {
  alert("please place cursor inside a * source");
} else {
  var wholeSource = "";
  if (indexEndRef > -1) {
    var lengthSourceEnd = indexEndRef + "*".length - indexStartRef;
    wholeSource = wpTextbox.value.substr(indexStartRef, lengthSourceEnd);
  } else {
    wholeSource = wpTextbox.value.substr(indexStartRef);
  }

  var namePart = "";
  var nameIn = prompt("name for ref?", "");
  if (nameIn != null && nameIn != "") {
    namePart = ' name="' + nameIn + '"';
  }

  var ref =
    "<ref" + namePart + ">" + wholeSource.replace("*", "").trim() + "</ref>";

  if (prompt("", ref) != null) {
    wpTextbox.value = wpTextbox.value.replace(wholeSource, "");
    wpTextbox.selectionStart = selectionStart;
    wpTextbox.selectionEnd = selectionStart;
  }
}
void 0;
