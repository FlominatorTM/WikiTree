javascript:  
/* creates template for a category when being on a */
var lat = "";
var lon = "";
var coor = "";  
lat = document.getElementsByClassName("latitude")[0].innerText.replace(',', '.'); 
lon = document.getElementsByClassName("longitude")[0].innerText.replace(',', '.'); 
coor = "coordinate=" + lat + "," + lon; 

var output = "{{CategoryInfoBox Location\n|parent=\n|project=\n|team=\n|" + coor + "\n}}";
if (navigator.userAgent.includes("Chrome")) 
{
	prompt("", output); 
}
else
{
	alert(output);
}
void(0);