javascript:
var nameTDs = document.getElementsByClassName('level1 groupC groupL groupR groupT');
var pointTDs = document.getElementsByClassName('level1 fieldC fieldR fieldT fieldB');
var numMembersTD = document.getElementsByClassName('level2 fieldC fieldL fieldB');

var points = [];
var dict = {};
var numMembers = [];
var indexMembers = 0;
for (var i=0; tdNode = nameTDs[i]; i++)
{
	var pointsForThisTeam = parseFloat(pointTDs[i].innerText.replace(".", "").replace(",", ""));
	
	var numberTeamMembers = 0;
	if(nameTDs[i].nextSibling.className == "level2 groupC groupL groupR groupT")
	{
		numberTeamMembers = 1;
	}
	else
	{
		numberTeamMembers = parseFloat(numMembersTD[indexMembers].innerText);
		indexMembers++;
	}
	
	var normalizedPoints = pointsForThisTeam / numberTeamMembers;
	normalizedPoints = Math.round(normalizedPoints*100)/100;
	dict[normalizedPoints] = tdNode.innerText;
	points[i] = normalizedPoints ;
}

points.sort(function(a, b) {
  return b - a;
});

var pos = 1;

res = "";
for (var i=0; i<points.length; i++)
{
	res+= pos + ".  " + dict[points[i]]  + ": " + points[i] + "\n";
	pos++;
}

alert(res);
