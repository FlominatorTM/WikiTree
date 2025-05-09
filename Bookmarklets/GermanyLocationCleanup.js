javascript: void 0;

/* removes prefixes from birth and death locations generated by FamilySearch*/
birthLocation = document.getElementById("mBirthLocation");
birthDate = document.getElementById("mBirthDate");

deathLocation = document.getElementById("mDeathLocation");
deathDate = document.getElementById("mDeathDate");

marriageLocation = document.getElementById("mMarriageLocation");
if (marriageLocation == null) {
  marriageLocation = document.getElementsByName("mMarriageLocation")[0];
}
marriageDate = document.getElementById("mMarriageDate");

if (birthDate != null) {
  birthLocation.value = removeCrap(birthDate.value, birthLocation.value);
  deathLocation.value = removeCrap(deathDate.value, deathLocation.value);
}
if (marriageDate != null) {
  marriageLocation.value = removeCrap(
    marriageDate.value,
    marriageLocation.value
  );
}

function removeCrap(date, place) {
  placeBetter = place
    .replace("Bezirksamt ", "")
    .replace("Kreis ", "")
    .replace("Provinz ", "")
    .replace("Landkreis ", "")
    .replace("Amt ", "")
    .replace("Erstes Landamt ", "")
    .replace("Zweites Landamt ", "")
    .replace("Landamt ", "")
    .replace("Stadtamt ", "")
    .replace("Großherzogtum ", "")
    .replace("Republik ", "")
    .replace("Königreich ", "")
    .replace("Freistaat ", "")
    .replace("Volksstaat ", "")
    .replace("Landeskommissärbezirk ", "")
    .replace("Oberamt ", "")
    .replace("Obervogteiamt ", "")
    .replace("Vogtei und Kirchspiel ", "")
    .replace("Vogtei ", "")
    .replace("Kirchspiel ", "")
    .replace("Vereinigte Staaten", "United States")
    .replace("USA", "United States")
    .replace("WV", "West Virginia")
    .replace("Ungarn", "Magyarország");

  /* general replacements with comma, no clue why anymore */
  placeBetter = placeBetter.replace(", DE", ", Deutschland");
  placeBetter = placeBetter.replace(", Germany", ", Deutschland");
  placeBetter = placeBetter.replace(", German Empire", ", Deutsches Reich");

  year_str = date.substr(date.length - 4);
  if (year_str != null && year_str.length == 4) {
    year = parseInt(year_str);
    if (year < 1806) {
      placeBetter = placeBetter
        .replace("Deutsches Reich", "Heiliges Römisches Reich")
        .replace("Deutschland", "Heiliges Römisches Reich");
    } else if (year == 1806) {
      alert("HRR only until 6 August 1806");
    } else if (year < 1815) {
      placeBetter = placeBetter
        .replace(", Heiliges Römisches Reich", "")
        .replace(", Deutschland", "")
        .replace(", Deutscher Bund", "")
        .replace(", Deutsches Reich", "");
    } else if (year == 1815) {
      alert("Deutscher Bund from 8 June 1815");
    } else if (year < 1866) {
      placeBetter = placeBetter
        .replace("Deutsches Reich", "Deutscher Bund")
        .replace("Deutschland", "Deutscher Bund");
    } else if (year == 1866) {
      alert("Deutscher Bund only until 23 August 1866");
    } else if (year < 1871) {
      placeBetter = placeBetter
        .replace(", Deutsches Reich", "")
        .replace("Deutschland", "");
    } else if (year < 1945) {
      placeBetter = placeBetter.replace("Deutschland", "Deutsches Reich");
      /* Deutsches Reich is accurate from 1871 until 1945*/
    } else if (year == 1945) {
      alert("Deutsches Reich only until April? 1945");
    } else if (year < 1949) {
      placeBetter = placeBetter
        .replace("Deutsches Reich", "[INSERT COUNTRY]ische Besatzungszone")
        .replace("Deutschland", "[INSERT COUNTRY]ische Besatzungszone");
    } else if (year == 1949) {
      alert("Bundesrepublik Deutschland since 23 May 1949");
    } else if (year > 1949) {
      placeBetter = placeBetter
        .replace("Deutsches Reich", "Deutschland")
        .replace("Deutscher Bund", "Deutschland");
    }

    if (
      placeBetter.includes("West Virginia") &&
      !placeBetter.includes("now West Virginia") &&
      !placeBetter.includes("now: West Virginia")
    ) {
      if (year < 1863) {
        placeBetter = placeBetter.replace("West Virginia", "Virginia");
      } else if (year == 1863) {
        alert("West Virginia only exists since 20 June 1863");
      }
    }

    if (year < 1868 && placeBetter.indexOf("Hessen-Nassau") > -1) {
      alert(
        "no Hessen-Nassau before 1868 => Electorate of Hesse or Duchy Nassau"
      );
    }

    if (placeBetter.indexOf("Viertäler") > -1) {
      if (year > 1929) {
        placeBetter = placeBetter.replace("Viertäler", "Titisee");
      } else if (year == 1929) {
        alert("Viertäler became Titisee on 1 May 1929");
      }
    }

    if (placeBetter.includes("Baden-Württemberg")) {
      if (year > 1806 && year < 1952) {
        placeBetter = placeBetter.replace(
          "Baden-Württemberg",
          "Baden or Württemberg"
        );
      }
      if (year == 1952) {
        alert("Baden-Württemberg started on 25 April 1952");
      }
    }

    if (placeBetter.includes("Breisgau-Hochschwarzwald")) {
      if (year > 1938 && year < 1973) {
        placeBetter = placeBetter.replace(
          "Breisgau-Hochschwarzwald",
          "Freiburg or Müllheim or Hochschwarzwald"
        );
      }
    } else if (placeBetter.includes("Hochschwarzwald")) {
      if (year < 1956) {
        placeBetter = placeBetter.replace("Hochschwarzwald", "Neustadt");
      }
    }

    if (placeBetter.includes("Auschwitz")) {
      if (placeBetter.includes("Birkenau")) {
        if (year >= 1939 && year < 1941) {
          placeBetter =
            "Konzentrationslager Auschwitz-Birkenau, Bielitz, Schlesien, Preußen, Deutsches Reich ";
        } else if (year <= 1945) {
          placeBetter =
            "Konzentrationslager Auschwitz-Birkenau, Bielitz, Oberschlesien, Preußen, Deutsches Reich ";
        }
      }
    }
    if (placeBetter.includes("Hawaii") && !placeBetter.includes("Territory")) {
      /*  before 21 August 1959    after 7 July 1898 */
      if (year > 1898 && year < 1959) {
        if (placeBetter.includes("Hawaii, Hawaii")) {
          placeBetter = placeBetter.replace(
            "Hawaii, Hawaii,",
            "Hawaii, Hawaii Territory,"
          );
        } else if (placeBetter == "Hawaii") {
          placeBetter = "Hawaii Territory, United States";
        } else if (placeBetter.includes("Pearl Harbor")) {
          placeBetter =
            "Pearl Harbor, Oahu, Honolulu County, Hawaii Territory, United States";
        } else {
          placeBetter = placeBetter.replace(", Hawaii,", ", Hawaii Territory,");
        }
      }
      if (year == 1898) {
        alert("Hawaii was annexed on 7 July 1898");
      }
      if (year == 1959) {
        alert("Hawaii became a state on 21 August 1959");
      }
    }
  }
  return placeBetter;
}
void 0;
