javascript: var library = document.getElementById("providerLink").innerText;
var newspaper = document.getElementById("paper-title").innerText;

var weekdayDate = document
  .getElementsByClassName("date_Label")[0]
  .innerText.split(", ")[1];
var dateParts = weekdayDate.split(".");

var months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
var day = parseInt(dateParts[0]);
var dateEnglish = day + " " + months[dateParts[1] - 1] + " " + dateParts[2];

var d = new Date();
var dateFormatted = d.toLocaleString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

var urlDate = " : accessed " + dateFormatted + ")";

var page = "";
var urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("issuepage")) {
  page = ", p. " + urlParams.get("issuepage") + " ";
}

var citation =
  newspaper +
  ", " +
  dateEnglish +
  page +
  " ([" +
  window.location +
  " Deutsches Zeitungsportal via " +
  library +
  "]" +
  urlDate;

prompt("", citation);
void 0;
