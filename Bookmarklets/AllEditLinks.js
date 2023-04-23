javascript: 
var allAnkerNodes = document.getElementsByTagName("a");
for (var i=0; i < allAnkerNodes.length ; i++) 
{     
	if (href = allAnkerNodes[i].getAttribute("href"))
	{ 
		hrefText = (""+ href);
		if(hrefText.search("/@")>-1)
		{
			hrefText = hrefText.replace("toot.community/@", "genealysis.social/@");
		allAnkerNodes[i].href = hrefText /*.replace("/@", "genealysis.social/@")*/;
	alert(allAnkerNodes[i].href);
		}

	} 
} 
void(0);
