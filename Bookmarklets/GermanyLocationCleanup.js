javascript:
/* removes prefixes from birth and death locations generated by FamilySearch*/
birthLocation = document.getElementById('mBirthLocation');
birthDate =  document.getElementById('mBirthDate');

deathLocation = document.getElementById('mDeathLocation');
deathDate = document.getElementById('mDeathDate');

marriageLocation = document.getElementById('mMarriageLocation');
if(marriageLocation == null)
{
	marriageLocation = document.getElementsByName('mMarriageLocation')[0];
}
marriageDate = document.getElementById('mMarriageDate');


if(birthDate != null)
{
	birthLocation.value = removeCrap(birthDate.value, birthLocation.value);
	deathLocation.value = removeCrap(deathDate.value, deathLocation.value);
}
if(marriageDate != null)
{
	marriageLocation.value = removeCrap(marriageDate.value, marriageLocation.value);
}

function removeCrap(date, place)
{
	placeBetter = place
	.replace("Bezirksamt ", "")
	.replace("Kreis ", "")
	.replace("Landkreis ", "")
	.replace("Amt ", "")
	.replace("Großherzogtum ", "")
	.replace("Republik ", "")
	.replace("Königreich ", "")
	.replace("Oberamt ", "")
	.replace("Vereinigte Staaten", "United States")
	.replace("USA", "United States")
	.replace("Ungarn", "Magyarország")
	;
	
	placeBetter = placeBetter.replace(", Germany", ", Deutschland");
	placeBetter = placeBetter.replace(", German Empire", ", Deutsches Reich");
	year_str = date.substr(date.length-4);
	if(year_str != null && year_str.length ==4)
	{
		year = parseInt(year_str);
		if(year < 1806)
		{
			placeBetter = placeBetter
			.replace("Deutsches Reich", "Heiliges Römisches Reich")
			.replace("Deutschland", "Heiliges Römisches Reich")
			;
		}
		else if (year == 1806)
		{
			alert("HRR only until 6 August 1806");
		}
		else if(year < 1815)
		{
			placeBetter = placeBetter
			.replace(", Heiliges Römisches Reich", "")
			.replace(", Deutschland", "")
			.replace(", Deutscher Bund", "")
			.replace(", Deutsches Reich", "")
			;
		}
		else if(year == 1815)
		{
			alert("Deutscher Bund from 8 June 1815");
		}
		else if(year < 1866)
		{
			placeBetter = placeBetter
			.replace("Deutsches Reich", "Deutscher Bund")
			.replace("Deutschland", "Deutscher Bund")
			;
		}
		else if(year == 1866)
		{
			alert("Deutscher Bund only until 23 August 1866");
		}
		else if(year < 1871)
		{
			placeBetter = placeBetter
			.replace(", Deutsches Reich", "")
			.replace("Deutschland", "")
			;
		}
		else if(year <1945)
		{
			placeBetter = placeBetter
			.replace("Deutschland", "Deutsches Reich")
			;
			/* Deutsches Reich is accurate from 1871 until 1945*/
		}
		else if(year == 1945)
		{
			alert("Deutsches Reich only until April? 1945")
		}
		else if(year < 1949)
		{
			placeBetter = placeBetter
			.replace("Deutsches Reich", "[INSERT COUNTRY]ische Besatzungszone")
			.replace("Deutschland", "[INSERT COUNTRY]ische Besatzungszone")
			;
		}
		else if(year == 1949)
		{
			alert("Bundesrepublik Deutschland since 23 May 1949");
		}
		else if(year > 1949)
		{
			placeBetter = placeBetter
			.replace("Deutsches Reich", "Deutschland")
			.replace("Deutscher Bund", "Deutschland")
			;
		}
		
		if (year < 1868 && placeBetter.indexOf("Hessen-Nassau") > -1)
		{
			alert("no Hessen-Nassau before 1868 => Electorate of Hesse or Duchy Nassau");
		}
		
		if(placeBetter.indexOf("Viertäler") > -1)
		{
			if(year > 1929)
			{
			placeBetter = placeBetter
			.replace("Viertäler", "Titisee")
			;}
			else if(year == 1929)
			{
				alert("Viertäler became Titisee on 1 May 1929");
			}
		}
	}
	return placeBetter;
}
void(0);