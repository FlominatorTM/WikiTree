javascript: var staticText =
  "Das Bundesarchiv, Memorial Book, Victims of the Persecution of Jews under the National Socialist Tyranny in Germany 1933 - 1945:";

var name = document.getElementsByTagName("h2")[0].innerText;

var d = new Date();
var dateFormatted = d.toLocaleString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

var urlDate = " : accessed " + dateFormatted + ")";

var url = window.location.toString().replace("/de", "/en");
var citation = staticText + " [" + url + " " + name + "]";

var citation = staticText + " " + name + " (" + url + urlDate;
prompt("", citation);
void 0;
