javascript: var name = prompt("future name of this <ref>?");
/* place cursor inside an inline reference before clicking */
var wpTextbox = document.getElementById("wpTextbox1");
var selectionStart = wpTextbox.selectionStart;
var indexEndRef = wpTextbox.value.indexOf("</ref>", selectionStart);
var indexStartRef = wpTextbox.value.lastIndexOf("<ref>", indexEndRef);

if (indexEndRef == -1 || indexStartRef == -1) {
  alert("please place cursor inside the ref tags");
} else {
  var lengthSourceEnd = indexEndRef + "</ref>".length - indexStartRef;

  var wholeSource = wpTextbox.value.substr(indexStartRef, lengthSourceEnd);
  var ref = wholeSource.replace("<ref>", '<ref name="' + name + '">');
  wpTextbox.value = wpTextbox.value.replace(
    wholeSource,
    '<ref name="' + name + '"/>'
  );
  wpTextbox.selectionStart = selectionStart;
  wpTextbox.selectionEnd = selectionStart;
  prompt("", ref);
}
void 0;
