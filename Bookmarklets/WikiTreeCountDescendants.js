javascript:
/* counts the number of decendants (via https://www.wikitree.com/g2g/1249590/simple-idea-for-the-descendants-list-within-profiles?show=1250209 ) */

var gens = {
0: 0,
1 : 0,
2 : 0,
3 : 0,
4 : 0,
5 : 0
};

javascript:
/* counts the number of decendants (via https://www.wikitree.com/g2g/1249590/simple-idea-for-the-descendants-list-within-profiles?show=1250209 ) */

var totalDescendants = 0;
for (var i=0; olNode = document.getElementsByTagName("ol")[i]; i++)
{
    var numGenerations = CountOls(olNode);
    childrenCount = 0;
    for(var j=0; olChild = olNode.children[j]; j++)
    {
        if(olChild.tagName == "LI")
        {
            gens[numGenerations]++;
            totalDescendants++
        }
    }        
 }        
void(0);

alert("children: " + gens[0] + "\ngchildren: " + gens[1] + "\ng gchildren: " + gens[2] + "\ngg gchildren: " + gens[3] + "\nggg gchildren: " + gens[4] + "\n-----------------" + "\ntotal descendants: " + totalDescendants);
   
function CountOls(node)
{
    
    var ret = 0;
    while(null != node.parentNode)
    {
        if(node.parentNode.tagName == "OL")
        {
            ret = ret +1;
        }
        node = node.parentNode;
    }
    return ret;
}
