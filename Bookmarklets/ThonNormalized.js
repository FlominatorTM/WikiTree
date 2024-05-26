javascript: var dummy;
/* known issues: doesn't work with identical averages */
var nameTDs = document.getElementsByClassName(
  "level1 groupC groupL groupR groupT"
);
var pointTDs = document.getElementsByClassName(
  "level1 fieldC fieldR fieldT fieldB"
);
var numMembersTD = document.getElementsByClassName(
  "level2 fieldC fieldL fieldB"
);

var points = [];
var dict = {};
var numMembers = [];
var indexMembers = 0;

for (var i = 0; (tdNode = nameTDs[i]); i++) {
  var pointsForThisTeam = parseFloat(
    pointTDs[i].innerText.replace(".", "").replace(",", "")
  );

  var numberTeamMembers = 0;
  if (
    nameTDs[i].nextSibling.className == "level2 groupC groupL groupR groupT"
  ) {
    numberTeamMembers = 1;
  } else {
    numberTeamMembers = parseFloat(numMembersTD[indexMembers].innerText);
    indexMembers++;
  }

  var normalizedPoints = pointsForThisTeam / numberTeamMembers;
  normalizedPoints = Math.round(normalizedPoints * 100) / 100;

  while (normalizedPoints in dict) {
    if (normalizedPoints.toString().includes(".")) {
      normalizedPoints += "0";
    } else {
      normalizedPoints += ".0";
    }
  }
  dict[normalizedPoints] = tdNode.innerText;
  console.log(normalizedPoints + "=>" + tdNode.innerText);

  if (i > 0) {
    var pointsLastTeam = parseFloat(
      pointTDs[i - 1].innerText.replace(".", "").replace(",", "")
    );
    var diffToHigher = pointsLastTeam - pointsForThisTeam;
    tdNode.innerHTML += "<br>-" + diffToHigher;
  }

  if (i < nameTDs.length - 1) {
    var pointsNextTeam = parseFloat(
      pointTDs[i + 1].innerText.replace(".", "").replace(",", "")
    );
    var diffToLower = pointsForThisTeam - pointsNextTeam;
    tdNode.innerHTML += "<br>+" + diffToLower;
  }

  points[i] = normalizedPoints;
  pointsLastTeam = pointsForThisTeam;
}

points.sort(function (a, b) {
  return b - a;
});

var pos = 1;

res = "";
for (var i = 0; i < points.length; i++) {
  res +=
    pos + ".  " + dict[points[i]] + ": " + Math.round(points[i] * 100) / 100;
  if (i > 0) {
    var diffToHigher = points[i - 1] - points[i];
    res += " -" + Math.round(diffToHigher * 100) / 100 + "";
  }
  if (i < points.length - 1) {
    var diffToLower = points[i] - points[i + 1];
    res += " +" + Math.round(diffToLower * 100) / 100 + "";
  }
  res += "\n";
  pos++;
}

alert(res);
