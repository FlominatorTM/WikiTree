javascript:
const headline = document.getElementsByTagName("h1")[0];
let currentCategory = headline.innerText.replace("Category: ", "");
const indexScissors = headline.innerHTML.indexOf("<");
if (indexScissors > -1) {
  currentCategory = headline.innerHTML.substring(0, indexScissors);
}

let newCategory = prompt("New name?", currentCategory);

if(newCategory)
{
    var editForm = document.getElementById('editform');
    editForm.action = "https://www.wikitree.com/index.php?action=submit&title=Category:" + encodeURIComponent(newCategory);
    document.getElementById('wpDiff').click();
}
