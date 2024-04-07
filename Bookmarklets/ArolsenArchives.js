javascript: var citation = "Arolsen Archives: ";

citation += document.getElementsByTagName("h1")[0].innerText;

bs = document.getElementsByTagName("b");
signatureA = "";
for (let i = 0; i < bs.length; i++) {
  const bClean = bs[i].innerText.trim();
  if (bClean == "Signatur" || bClean == "Reference Code") {
    signatureA = bs[i].parentNode.nextSibling;
    citation +=
      ", " + bClean + " [" + signatureA.href + signatureA.innerText + "]";
    break;
  }
}

prompt("", citation);
void 0;
