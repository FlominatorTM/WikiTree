javascript: var aTags = document.getElementsByTagName("a");

var user = "";
var allMessageLinks = document.getElementsByClassName("privateMessageLink");
for (let i = 0; i < allMessageLinks.length; i++) {
  const potentialUserLink = allMessageLinks[i].previousSibling.previousSibling;

  if (
    !potentialUserLink.innerHTML.includes("<img") &&
    !potentialUserLink.innerHTML.includes("One Place Studies Project WikiTree")
  ) {
    user = potentialUserLink.href.toString().split("/wiki/")[1];
    break;
  }
}

var headline = document
  .getElementsByTagName("h1")[0]
  .innerHTML.split("<")[0]
  .trim();

var code = "![[" + user + "]]\n";
code +=
  "|[[Space:" +
  headline +
  "|" +
  headline.replace(" One Place Study", "") +
  "]]\n";
code += "|<!--image -->\n";
code += "|<!-- country -->\n|-";
alert(code);
