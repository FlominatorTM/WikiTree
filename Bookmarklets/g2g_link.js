javascript: var title = "" + document.title;
var name = document.title;
var endName = title.indexOf(" (b.");
if (endName == -1) {
  endName = title.indexOf("|");
}
if (endName > -1) {
  name = title.substr(0, endName);
}
name = prompt("link label?", name);
var node = document.createElement("div");
node.innerHTML = '<a href="' + window.location + '">' + name + "</a>";
copyToClip(node.innerHTML);
alert("copied to clipboard:" + node.innerHTML);
function copyToClip(str) {
  function listener(e) {
    e.clipboardData.setData("text/html", str);
    e.clipboardData.setData("text/plain", str);
    e.preventDefault();
  }
  document.addEventListener("copy", listener);
  document.execCommand("copy");
  document.removeEventListener("copy", listener);
}
a;
