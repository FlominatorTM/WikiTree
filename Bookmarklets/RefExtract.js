javascript: var name = "name";
var wpTextbox = document.getElementById("wpTextbox1");
var selectionStart = wptext.selectionStart;
var indexEndRef = wpTextbox.value.indexOf("</ref>", selectionStart);
var indexStartRef = wpTextbox.value.lastIndexOf("<ref>", indexEndRef);

if (indexEndRef == -1 || indexStartRef == -1) {
  alert("please place cursor inside the ref tags");
} else {
  var lengthRefContentIncludingClosingTag =
    indexEndRef + "</ref>".length - indexStartRef;

  var refWithoutName = wpTextbox.value.substr(
    indexStartRef,
    lengthRefContentIncludingClosingTag
  );
  var refWithName = refWithoutName.replace(
    "<ref>",
    '<ref name="' + name + '">'
  );
  wpTextbox.value = wpTextbox.value.replace(
    refWithoutName,
    '<ref name="' + name + '"/>'
  );
  wptext.selectionStart = selectionStart;
  wptext.selectionEnd = selectionStart;
  prompt("", refWithName);
}
void 0;
