javascript:
/* counts the number of decendants (via https://www.wikitree.com/g2g/1249590/simple-idea-for-the-descendants-list-within-profiles?show=1250209 ) */
for (var i=0; aNode = document.getElementsByTagName("ol")[i]; i++)
{
    var OLs = aNode.getElementsByTagName("li").length;
    var ins_li = document.createElement("span");
            ins_li.innerHTML="Descendants: " + OLs;
             aNode.parentNode.insertBefore(ins_li, aNode);
 }        
void(0);
