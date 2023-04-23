javascript:
/* get all emails from trusted list and put them into a new email */
var listOfEmails = [];
var contentToSearch = document.body.innerHTML;
var contentAsText = contentToSearch.toString();
listOfEmails = contentAsText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
var emailstext = "";
for(var i=0; i<listOfEmails.length; i++) 
{
    if(emailstext.search(listOfEmails[i])==-1)
    {
    emailstext+=listOfEmails[i] + ";";
    }
}
alert(emailstext);
window.location="mailto:"+emailstext;
