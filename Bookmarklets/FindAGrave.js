javascript: 
var url = window.location+"";
var needle = "memorial/";
var indexOfMemorial = url.indexOf(needle) + needle.length;
var indexOfSlashAfter = url.indexOf("/", indexOfMemorial);
var memorialId = url.substring(indexOfMemorial, indexOfSlashAfter);

prompt("..", "{{FindAGrave|" + memorialId +"}}");
;void(0); 
