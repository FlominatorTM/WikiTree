javascript: var wd =
  "{{wikidata|" +
  getWikidataFromWikipedia() +
  "|" +
  getWikipediaLanguage() +
  "}}";

prompt("", wd);
void 0;

function getWikipediaLanguage() {
  var langUrlPart = window.location.hostname.split(".")[0];
  switch (langUrlPart) {
    case "ca":
    case "de":
    case "el":
    case "fr":
    case "nl":
    case "ja":
    case "ru":
    case "sv":
    case "zh": {
      return langUrlPart;
    }
    default:
      return "en";
  }
}

function getWikidataFromWikipedia() {
  var wikidata = "";
  var allAnkerNodes = document.getElementsByTagName("a");
  for (var i = 0; i < allAnkerNodes.length; i++) {
    if ((href = allAnkerNodes[i].getAttribute("href"))) {
      hrefParts = href.split("/");
      if (hrefParts[4] == "Special:EntityPage") {
        wikidata = wikidata + hrefParts[5];
        break;
      }
    }
  }
  return wikidata;
}
