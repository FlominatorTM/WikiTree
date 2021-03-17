javascript:
/* usage: select headline and enter page numbers */
var archive = document.getElementsByName('description')[0].getAttribute('content');
var book = window.getSelection()+'';
var link = window.location + "";
var pageCurrent = prompt("current page");
var pageTotal = prompt("total pages");
prompt("", archive + ", " + book.trim() + ", Image " + pageCurrent + "/" + pageTotal + ": "+ link);
;void(0);
