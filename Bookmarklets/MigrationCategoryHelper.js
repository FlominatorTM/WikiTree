javascript:
title = document.title;

indexCategory = title.indexOf("Category:") +"Category:".length ;
cat = title.substring(indexCategory);

var countryFrom = "";
var entityFrom = "";
var countryTo = "";
var entityTo = "";


if(cat.indexOf("Migrants") > -1)
{
    indexTo = cat.indexOf(" to ");
    fromPart = cat.substring(0, indexTo);
    toPart = cat.substring(indexTo);
    countryTo = getRightFromWord("to", toPart);
    entityTo = getRightFromWord("to", toPart);
    countryFrom = getRightFromWord("from", fromPart);
    entityFrom = getRightFromWord("from", fromPart);

}
else if(cat.indexOf("Emigrants") > -1)
{
    countryFrom = getLeftFromComma(cat);
    entityFrom = getLeftFromComma(cat);

    if(cat.indexOf(" to ") > -1)
    {
        countryTo = getRightFromWord("to", cat);
        entityTo = getRightFromWord("to", cat);
    }
}

else if (cat.indexOf("Immigrants") > -1)
{
    countryTo = getLeftFromComma(cat);
    entityTo = getLeftFromComma(cat);
    if(cat.indexOf(" from ") > -1)
    {
        countryFrom = getRightFromWord("from", cat);
        entityFrom = getRightFromWord("from", cat);
    }

}

document.getElementById('wpTextbox1').value= "{{CategoryInfoBox Migration\n
|fromCountry="+ countryFrom + "\n
|fromEntity="+ entityFrom + "\n
|image=\n
|location=\n
|toCountry="+ countryTo + "\n
|toEntity=" + entityTo + "\n
}}";

void(0);

function getLeftFromComma(cat)
{
    var indexComma = cat.indexOf(",");
    return cat.substring(0, indexComma);
}

function getRightFromWord(word, cat)
{
    var indexWord = cat.indexOf(word) + word.length;
    return cat.substring(indexWord);
}
