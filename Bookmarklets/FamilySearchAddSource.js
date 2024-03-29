javascript: var url = prompt("WikiTree profile url");
var name = prompt("long name");
var fs = prompt("FamilySearch ID");
fsAttachSubmitForm({
  pid: fs,
  title: /* self.wtPerson.getLongNamePrivate()*/ name + " on WikiTree",
  url: url,
  citation:
    'WikiTree contributors, "' +
    /*getLongNamePrivate()*/ name +
    '", WikiTree, ' +
    url +
    " (accessed " +
    getDateString() +
    ")",
});

function fsAttachSubmitForm(data) {
  var form = document.createElement("form");
  form.method = "POST";
  form.action =
    "https://www.familysearch.org/tree/sources/sourceCA?cid=wikitree-a0T3000000Bhy5yEAB&mode=import&personId=" +
    data.pid;
  form.target = "_blank";

  for (var name in data) {
    form.appendChild(hiddenInput(name, data[name]));
  }

  document.body.appendChild(form);
  form.submit();
  form.remove();
}
