javascript:
/* usage: select headline and enter page numbers */
var book = window.getSelection()+'';
var link = window.location + "";
var pageCurrent = prompt("current page");
var pageTotal = prompt("total pages");
prompt("", book.trim() + ", Image " + pageCurrent + "/" + pageTotal + ": "+ link);
;void(0);