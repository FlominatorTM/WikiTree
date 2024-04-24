javascript:
var bio = document.getElementById('wpTextbox1').value;
document.getElementById('wpTextbox1').value = bio.replace(", Brandenburg", " (Kreis), Brandenburg");
document.getElementById('wpSummary').value = "moving to (Kreis) ";
saveButton = document.getElementById('wpSave');
saveButton.disabled=false;
saveButton.click();
void(0);

-------------------------------------------
javascript:
var cat = "Nitzkydorf, Rumänien";
var catSyntax =  "[[Category:" + cat +"]]";
var bio = document.getElementById('wpTextbox1').value;
if(bio.indexOf(cat + "]]")==-1)
{
    document.getElementById('wpTextbox1').value = catSyntax + "\n" + bio;
    document.getElementById('wpSummary').value = "adding " + catSyntax;
    saveButton = document.getElementById('wpSave');
    saveButton.disabled=false;
    saveButton.click();
}
else
{
    alert("already there");
}
void(0);

----------------------------
javascript:
var textBefore = document.getElementById('wpTextbox1').value;

var newParts = "enddate=1918";
var textNew = textBefore

.replace(/\|parent=.*\n/g, "")
.replace("project=", "project=Hungary")
.replace("team=", newParts)
.replace("parent1", "parent");
alert(textNew);
var editform = document.getElementById("editform");
var oldAction = editform.action;

document.getElementById('wpTextbox1').value = textNew;
editform.action = oldAction
.replace("Románia", "Magyarország")
.replace("Szerbia", "Magyarország");
editform.target = "_blank";
document.getElementById('wpDiff').click();

editform.action = oldAction;
editform.target = "";
document.getElementById('wpTextbox1').value = textBefore.replace(/\|parent1=.*\n/g, "");
document.getElementById('wpSave').click();

void(0);

---------------------------------------
javascript:
/* – to - */
var textBefore = document.getElementById('wpTextbox1').value;

var textNew = textBefore.replace("–", "-");
var editform = document.getElementById("editform");
var oldAction = editform.action;

document.getElementById('wpTextbox1').value = textNew;
editform.action = oldAction.replace(encodeURIComponent("–"), "-");
editform.target = "_blank";
document.getElementById('wpDiff').click();

editform.action = oldAction;
editform.target = "";
var title =  document.getElementsByTagName("h1")[0].innerText
.replace("Category:", "").
replace("–", "-").
replace("/Use", "") ;
alert(title);
document.getElementById('wpTextbox1').value = "{{Rename Category|" + title + "}}\n changing – to - --~~~~";
document.getElementById('wpSummary').value = "renaming – to -";

document.getElementById('wpSave').click();

void(0);
