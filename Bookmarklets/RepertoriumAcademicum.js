javascript: var site = document.getElementsByTagName("h1")[0].innerText;
var person = document.getElementsByTagName("h1")[1].innerText;

var d = new Date();
var dateFormatted = d.toLocaleString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

var urlDate = " : accessed " + dateFormatted + ")";
var url = window.location;
var citation = site + ": " + person + " (" + url + urlDate;
prompt("", citation);
void 0;
