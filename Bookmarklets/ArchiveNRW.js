javascript: var signatureParts = document.getElementsByClassName(
  "tree-data__order-signature"
);

/*Landesarchiv NRW, Abt. Ostwestfalen-Lippe; 
Digitalisierter Bestand: P 6 / 6 (Standesämter Stadt Dortmund); 
(2684) Sterberegister, Dortmund-Dorstfeld (III) | 1880, 
[https://www.archive.nrw.de/archivsuche?link=VERZEICHUNGSEINHEIT-Vz_ebf6c396-02e3-458d-8e50-3814653d40e2  Bild 323]
*/

var unit = signatureParts[2].innerText.substring(
  0,
  signatureParts[2].innerText.indexOf(", Nr.")
);

var headline = document.getElementsByClassName(
  "tree-data__title tree-data__title-static h4"
)[0].innerText;

var year = document.getElementsByClassName(
  "tree-data__item tree-data__item--unitDate"
)[0].firstChild.nextSibling.innerText;

var citation =
  signatureParts[1].innerText +
  "; Digitalisierter Bestand: " +
  unit +
  "; " +
  headline +
  " | " +
  year +
  ", [" +
  window.location +
  " Bild #]";

alert(citation);
