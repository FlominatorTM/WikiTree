javascript:
 
var citation = "Porta fontium";
var strongPlaceName = document.getElementsByClassName("iipimage")[0];
var place = strongPlaceName.innerText;
var durationAndKindSpan = strongPlaceName.parentNode.nextSibling.nextSibling.nextSibling.nextSibling;
var durationAndKind = durationAndKindSpan.firstChild.nextSibling.nextSibling.nextSibling.innerHTML;
var lastImage = hdv.options.imagesSet.length;
var currentImage = hdv.osdViewer.currentPage()+1;

citation += " > " + place + " > " + durationAndKind + " > [" + window.location.href +" picture " + currentImage + "/" + lastImage + "]";
alert(citation);

void(0);
