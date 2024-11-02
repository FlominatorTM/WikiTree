javascript: var unknown =
  "unknown document structure, please report to Straub-620";
var labelTitle = document.getElementsByClassName("tx-dlf-title")[0].innerText;

if (labelTitle != "Titel") {
  alert(unknown);
}

let nr = "";
var urlParts = window.location.search.substr(1).split("&");
var page = "";
var signature = "";
var ddTitle = document.getElementsByClassName("tx-dlf-title")[1];

var author = "";
var title = ddTitle.innerText;

for (var i = 1; (urlParameter = urlParts[i]); i++) {
  urlParameter = decodeURIComponent(urlParameter);
  console.log("urlParameter:" + urlParameter);
  if (urlParameter.indexOf("tx_dlf[page]") > -1) {
    page = urlParameter.split("=")[1];
  }

  /* https://digitalisate-he.arcinsys.de/hstam/903/9121.xml */
  if (urlParameter.indexOf("tx_dlf[id]") > -1) {
    urlParameter = urlParameter.replace(".xml", "").replace("https://", "");
    parameterParts = urlParameter.split("/");
    if (parameterParts[1] == "hstam") {
      author = "Hessisches Staatsarchiv Marburg";
      /* meanwhile included in text
	  signature = "HStAM Bestand " + parameterParts[2] + " Nr. " + parameterParts[3];
	  */
    } else if (parameterParts[1] == "hhstaw") {
      author = "Hessisches Hauptstaatsarchiv Wiesbaden";
      /* Geburtsregister der Juden von Mansbach (Hohenroda) 1847-1902 (HHStAW Abt. 365 Nr. 553)*/
      const indexSignature = title.indexOf("(HHStAW");

      if (indexSignature > -1) {
        signature = title
          .substr(indexSignature)
          .replace(")", "")
          .replace("(", "")
          .trim();
        title = title.substr(0, indexSignature).trim();
      }
    } else if (urlParameter.indexOf("www.arcinsys.niedersachsen.de") > -1) {
      signature = ddTitle.nextSibling.nextSibling.innerText;
      author = ddTitle.nextSibling.nextSibling.nextSibling.innerText;
    } else if (urlParameter.indexOf("landesarchiv-nrw") > -1) {
      author = "Landesarchiv Nordrhein-Westfalen";
    } else if (
      urlParameter.indexOf("digitales-archiv.erzbistum-koeln.de") > -1
    ) {
      /*
	  <dd class="tx-dlf-title">Titel: Tauf-, Heirats- und Sterbebuch</dd><dt>Kontext</dt><dd>Bestand: Kirchenbücher (KB / KBN)</dd><dt>Signatur</dt><dd>KBN00870</dd>
	   */
      nr = ", #";
      title = title.replace("Titel: ", "");
      author = "Archiv des Erzbistums Köln";
      signature = ddTitle.nextSibling.nextSibling.innerText.replace(
        "Bestand: ",
        ""
      );
      signature +=
        ", Signatur " +
        ddTitle.nextSibling.nextSibling.nextSibling.nextSibling.innerText;

      const scriptTags = document.getElementsByTagName("script");
      for (let i = 0; i < scriptTags.length; i++) {
        if (scriptTags[i].innerHTML.includes("DATA")) {
          const scriptParts = scriptTags[i].innerHTML.split(
            "picturearchive\\/DE_AEK_KB\\/"
          );
          title += ", " + decodeURIComponent(scriptParts[1].split("\\")[0]);
        }
      }
    } else if (
      urlParameter.indexOf("digitales-archiv.erzbistum-muenchen.de") > -1
    ) {
      nr = ", #";
      /*
	  <dt class="tx-dlf-title">Titel</dt><dd class="tx-dlf-title">Titel: Taufen</dd><dt>Kontext</dt><dd>Bestand: CB353 Partenkirchen-Mariä Himmelfahrt - 1661-1915</dd><dt>Signatur</dt><dd>CB353, M5290</dd>
	  */
      title = title.replace("Titel: ", "");
      author = "Archiv des Erzbistums München";
      const sigRaw = ddTitle.nextSibling.nextSibling.innerText.replace(
        "Bestand: ",
        ""
      );

      signature = sigRaw.substring(sigRaw.indexOf(" ")).trim();
      signature += ", " + title;
      signature +=
        ", Signatur " +
        ddTitle.nextSibling.nextSibling.nextSibling.nextSibling.innerText.replace(
          ", ",
          "/"
        );
      /*
	  moving signature to title, since title "Taufen" would have a weird position else
	  ... or signature would end with two commas
	  */
      title = signature;
      signature = "";
    } else {
      NotifyFlo(
        "unknown document structure (2), would you like to reach out to Flo to fix this?"
      );
    }
  }
}

var d = new Date();
var dateFormatted = d.toLocaleString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

var urlDate = " : accessed " + dateFormatted + ")";

var citation = "";

if (signature != "") {
  citation += signature + ", ";
}

citation +=
  author +
  ", " +
  title +
  ", image " +
  page +
  " ([" +
  window.location +
  " DFG-Viewer]" +
  urlDate;

prompt("", citation);
void 0;
