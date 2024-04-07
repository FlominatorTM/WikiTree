javascript: 
/* clicks the first link of each table row, pauses after 20 /*
var windowsPerRound = 20;
var trs = document.getElementsByTagName("tr");
for (var i = 1; i < trs.length; i++) {
  var a = trs[i].getElementsByTagName("a")[0];
  if (a != null && a.href != null) {
    var win = window.open(a.href);
  }
  if (i % windowsPerRound == 0) {
    alert(i + " done");
  }
}
