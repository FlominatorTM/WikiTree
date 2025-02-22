javascript: var needle = prompt("Enter team string part", "Germany");
var tds = document.getElementsByTagName("td");
for (let i = 0; i < tds.length; i++) {
  console.log(tds[i].innerHTML);
  if (
    tds[i].innerHTML.includes("/wiki/") &&
    !tds[i].innerHTML.includes(needle)
  ) {
    console.log(tds[i].innerHTML);
    tds[i].parentElement.style.display = "none";
  }
}
void 0;
