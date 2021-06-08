javascript:
/* counts the number of decendants (via https://www.wikitree.com/g2g/1249590/simple-idea-for-the-descendants-list-within-profiles?show=1250209 ) */
for (var i=0; olNode = document.getElementsByTagName("ol")[i]; i++)
{
    var liCount = olNode.getElementsByTagName("li").length;
    var spanNode = document.createElement("span");
    spanNode.innerHTML="Descendants: " + liCount;
    olNode.parentNode.insertBefore(spanNode, olNode);
 }        
void(0);
