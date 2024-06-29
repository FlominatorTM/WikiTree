javascript:
var d = new Date();
var dateFormatted = d.toLocaleString("en-GB", {
    day: 'numeric',
	month: 'long',
	year: 'numeric'
	});

var beforeURL = document.title.toString().replace(" | ", ", ").replace(" - View the records", ""); 

var url = " (" +  window.location.origin + window.location.pathname + " : accessed " + dateFormatted + ")";
var citation = beforeURL + url;
prompt("", citation);
;void(0);


Prisoners of the First World War, Prisoners of the First World War , International Committee of the Red Cross (https://grandeguerre.icrc.org/en/List/2901843/897/3887/ : accessed 1 June 2024)