javascript: var dummy;
/* reverses the order of location names separated by commas  in selected text */
var selected = window.getSelection() + "";
var parts = selected.split(",");
var result = "";
for (let index = parts.length - 1; index >= 0; index--) {
  result += ", " + parts[index].trim();
}
result = result.substring(2);
prompt("", result);
void 0;
