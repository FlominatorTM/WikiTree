javascript:

var fullOtherCountries = ["Darkehmen ", "Gerdauen", "Gumbinnen", "Insterburg ", "Königsberg", "Labiau", "Niederung", "Pillkallen", "Schloßberg", "Samland", "Ebenrode", "Wehlau", "Memel", "Pogegen", "Ragnit", "Tilsit"];

var partiallyPoland = ["Bartenstein", "Goldap", "Heiligenbeil", "Eylau", "Heydekrug"];

for (var i=0; aNode = document.getElementsByTagName("a")[i]; i++)
{
	for(var j=0; oneCounty = fullOtherCountries[j]; j++)
	{
		if(aNode.href.toString().indexOf(oneCounty)!=-1)
		{
			/*aNode.parentNode.style="background-color:#FFEBAD; font-style: italic;"*/
			aNode.parentNode.style="font-style: italic;"
		}
	}
	
	for(var j=0; oneCounty = partiallyPoland[j]; j++)
	{
		if(aNode.href.toString().indexOf(oneCounty)!=-1)
		{
			/*aNode.parentNode.style="background-color:#FFEBAD; font-style: italic;"*/
			aNode.parentNode.style="font-variant: small-caps;"
		}
	}
}
void(0);