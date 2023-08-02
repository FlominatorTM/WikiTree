javascript:  
var pageLang = window.location.hostname.split('.')[0];
var serbiaInPageLang = "";
var romaniaInPageLang = "";

switch(pageLang)
{
    case "de":
    {
        serbiaInPageLang = "Serbien";
        romaniaInPageLang = "Rumänien";
        break;
    }
    case "hu":
    {
        serbiaInPageLang = "Szerbia";
        romaniaInPageLang = "Románia";
        break;
    }    
    case "en":
    {
        serbiaInPageLang = "Serbia";
        romaniaInPageLang = "Romania";
        break;
    }
    case "ro":
    {
        serbiaInPageLang = "Serbia";
        romaniaInPageLang = "România";
        break;
    }
    case "hr":
    {
        serbiaInPageLang = "Srbija";
        romaniaInPageLang = "Rumunjska";
        break;
    }
}

lang = prompt("Enter language", "");

if(lang == "")
{
    alert("please select the place's name in one language");
}

var village = window.getSelection()+ "";
var parent1 = "";
switch(lang)
{
    case "hu":
    {
        var nameSerbia = "Szerbia";
        var nameRomania = "Románia";
        var parent1 = getHungarianCounty(village);
        break;
    }
    case "de":
    {
        var nameSerbia = "Serbien";
        var nameRomania = "Rumänien";
        break;
    }
    case "ro":
    {
        var nameSerbia = "Serbia";
        var nameRomania = "România";
        break;
    }
    case "sr":
    {
        var nameSerbia = "Srbija";
        var nameRomania = "Rumunjska";
        break;
    }
}

var articleName = document.getElementsByClassName("mw-page-title-main")[0].innerText;
var akaTemplate = "";
var country = "";
var catParent = "";
var indexSerbia = document.body.innerHTML.indexOf(serbiaInPageLang);
var indexRomania = document.body.innerHTML.indexOf(romaniaInPageLang);


if(indexSerbia > -1 && ( indexRomania == -1 || indexSerbia < indexRomania))
{
    country = nameSerbia;
    catParent = country;
    if(lang == "sr")
    {
        catParent = "Vojvodina";
    }
    akaTemplate = "{{Aka|" + articleName + ", " + "Srbija" + "|" + lang + "}}";
}

else if(indexRomania > -1 && (indexSerbia == -1 || indexRomania < indexSerbia))
{
    country = nameRomania;
    catParent = country;
    if(lang == "ro")
    {
        catParent = "Judeţul Timiș or Judeţul Arad or ...";
    }
    akaTemplate = "{{Aka|" + articleName + ", " + "România" + "|" + lang + "}}";
}

else
{
    alert("didn't find the German country names for Serbia and Romania, trying English");
}



var catName = village.trim() + ", " + country;

var lat = "";
var lon = "";
var coor = "";  
try
{
    lat = document.getElementsByClassName("latitude")[0].innerHTML + ""; 
    lon = document.getElementsByClassName("longitude")[0].innerHTML + ""; 
    coor = "coordinate=" + lat + "," + lon; 
    if(coor.indexOf("°")>-1)
    {
        coor = "coordinate=" + document.getElementsByClassName("geo")[0].innerText.replace("; ", ",");
    }
}
catch(err)
{
    alert("careful: no coordinates found");
}

var wikidata = "|wikidataID=";  
var allAnkerNodes = document.getElementsByTagName("a"); 
for (var i=0; i < allAnkerNodes.length ; i++)  
{
    if ( href = allAnkerNodes[i].getAttribute("href")) 
    { 
        hrefParts = href.split("/"); 
        if(hrefParts[4]=="Special:EntityPage") 
        { 
            wikidata = wikidata + hrefParts[5]; 
            break; 
        } 
    } 
}

if(lang != null && lang != "")
{
    var output = akaTemplate + "\n" + "{{CategoryInfoBox Location\n|parent=" + catParent + "\n|parent1=" + parent1  + "\n|project=\n|team=\n|" + coor + "\n"+ wikidata + "\n}}";
    var catPage = "https://www.wikitree.com/index.php?title=Category:" + catName +"&action=edit";
    if (navigator.userAgent.includes("Chrome"))
    {
        prompt("", output); 
        if(prompt("", output) != null)
        {
            navigator.clipboard.writeText(output);
            newWin = window.open(catPage, "");
        }
    }
    else
    {
        if(confirm(output))
        {
            newWin = window.open(catPage, "");
        }
    }
}
void(0);

function getHungarianCounty(village)
{
    var countyForVillage = ".... vármegye";
    var villageTidy = village.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    /* https://stackoverflow.com/a/37511463/4609258 */

    var hungarianCounties = 
    {
        /* via http://www.hungarianvillagefinder.com */
        "Torontál vármegye": "Akacs Albrechtsdorf Albrechtsflor Albrechtsflur Alexanderhausen Alexanderkirchen Alibunar Alisbrunn Almas Alsoaradi Alsoellemer Alsoittebe Alt Beba Alt Beschenowa Alt Etschka Alt Letz Alt Tschanad Alt-Beba Alt-Beschenowa Alt-Etschka Alt-Letz Alt-Tschanad Andrejevac Antalfalva Apfeldorf Aracs Aradac Aradi Arkod Aurelhaza Aurelheim Banat Topola Banater Hof Banater Neudorf Banatkomlos Banatska Dubica Banatska Topola Banatski Brestovac Banatski Despotovac Banatski Dusanovac Banatski Dvor Banatsko Arandelovo Banatsko Novo Selo Banatsko Veliko Selo Banat-Topola Banatujfalu Banlak Banloc Banlok Banstadt Barachhaza Baranda Baranyos Barice Basahid Basaid Baschaid Bassahid Battyanhaza Beba Veche Begafo Begaszentgyorgy Begejci Belo Blato Beodra Beregsau Mic Berekszonemeti Beresztoc Betschkerek Bikatsch Biled Billed Billet Billiet Bobda Bocar Bocsar Bogaros Bogarosch Boka Bolgartelep Borca Borcsa Botos Botosch Botschar Bresztovacz Bresztovacz Bulgarische Kolonie Bulgarus Carpinis Cebza Cenad Cenadu Vechi Cenei Centa Cestereg Charleville Checea Checea Croata Checea Romana Cheglevici Cherestur Coka Colonia Bulgara Comlosu Mare Comlosu Mic Crai Nou Crepaja Crna Bara Cruceni Csatad Csavos Csebza Csebze Csene Csenej Csenta Cserepalja Csernye Csoka Csosztelek Czernabara Czrepaja Dala Debeljaca Debeljatscha Debelyacsa Deszk Deutsch Elemer Deutsch Etschk Deutsch Modosch Deutsch Sankt Nikolaus Deutsch Sartscha Deutsch Tschanad Deutsch Zerne Deutsch-Modosch Deutsch-Sartscha Deutsch-Tschanad Dinias Dinyas Djala Dobrica Dobricza Doc Dolacz Dolat Dolatz Dolova Dolovo Dolowo Dragutinovo Dudestii Vechi Dugoszello Ecka Ecska Egres Egresch Egyhazasker Elemer Elemir Elisenhain Elisenheim Elisenheim Erneszthaza Ernohaza Ernsthausen Farkasd Farkasdin Farkazdin Feketeo Felsoaradi Felsoelemer Felsoittebe Felsomuzslya Feny Ferdinandfalva Ferenchalom Ferencszallas Fodorhausen Fodorhaz Fodorhaza Foeni Foeny Franczfold Franyova Franzfeld Gaad Gad Galagonyas Garabos Georgshausen Gertianosch Gier Kaptalan Giera Gilwas Giulvaz Glogan Glogau Glogon Glogonj Gottlob Grabacz Grabat Grabatz Granicerii Gross Betschkerek Gross Bikatsch Gross Gaj Gross Jetscha Gross Kikinda Gross Komlosch Gross Sankt Niklas Gross Sankt Nikolaus Gross Sankt Peter Gross Teremin Gross Tschanad Gross-Betschkerek Gross-Bikatsch Gross-Jetscha Gross-Kikinda Gross-Komlosch Gross-Sankt-Niklas Gross-Sankt-Nikolaus Gross-Sankt-Peter Gross-Teremin Gross-Tschanad Gyala Gyer Gyertyamos Gyorgyhaza Gyulves Gyurgyevo Haczfeld Hajducica Hajduschitza Hajdusica Hajfeld Hatzfeld Haufeld Heideschutz Hertelendyfalva Hetin Hetteny Hettin Heufeld Hodegyhaza Hodics Hodits Homolicz Homolitz Hopsenitz Horvatboka 	Horvatcsenej Horvatkecsa Horvatklari Horvatneuzina Hrvatska Neuzina Idjos Idos Idvor Iecea Mare Iecea Mica Igris Igrisch Ilancsa Ilandza Ilanzsa Ilenfold Ilonc Iohanisfeld Istvanfolde Istvanvolgy Ittvarnok Ittvarnok Szollos Ittvarnokszollos Ittvarnok-Szollos Ivand Ivanda Ivanovo Iwanda Iwanowo Jabuka Jankahid Jankov Most Janosfold Janosfolde Janosik Jarkovac Jarkowatz Jasa Tomic Jasowo Jaszova Jaszova Hodits Jaszovahodits Jaszova-Hodits Jazovo Jermenovci Jimbolia Johanisfeld Jozseffalva Jozsefova Kacarevo Kanak Kanizsamonostor Kaptalanfalva Karatsonyifalva Karatsonyiliget Karlova Karolyliget Katalinfalva Kathareindorf Kathereinfeld Keglevichhaza Keglewitsch Keglewitsch Keglewitschhausen Keresztes Keresztur Kevedobra Keviszolos Kikinda Kis Sziget Kisbeba Kisbikacs Kisjecsa Kiskomlos Kismargita Kisnezseny Kisorosz Kisosz Kissziget Kis-Sziget Kistarnok Kisteremia Kistorak Kistoszeg Kisvizesdia Kiszombor Klarafalva Klari Kleck Klein Beregsau Klein Jetscha Klein Kikinda Klein Niklas Klein Niklos Klein Orossin Klein Teremin Klein-Beregsau Klein-Jetscha Klein-Orossin Klein-Teremin Klek Knicanin Kocse Komlosch Konak Konigsdorf Konstanczia Kovacica Kowatschitza Krajisnik Krivabara Kriwa Bara Kroatisch Neusin Kroatisch-Neusin Krstur Kubek Kubekhaza Kuman Kumane Kunszollos Lajosfalva Lazarevo Lazarfold Lenauheim Lenauheim Leopoldova Livezile Lokve Lovrin Lowrin Lukacsfalva Lukicevo Lukino Selo Lunga Macedonia Magyarcsernye Magyarczernya Magyarittebe Magyarmajdany Magyarpade Magyarszentmarton Magyarszentmihaly Majdan Maleniczfalva Mali Torak Margita Margiticza Mariafolde Marienfeld Marienfold Mastort Maszdorf Masztort Meda Medja Melence Melenci Melencze Melenze Mihajlovo Modos Mokrin Mollidorf Mollydorf Molyfalva Monostor Muschla Muzlja Nagy Becskerek Nagy Gaj Nagy Gyorgyfalva Nagy Margitta Nagybecskerek Nagy-Becskerek Nagybikacs Nagycsanad Nagyerzsebetlak Nagyfalu Nagygaj Nagy-Gaj Nagygyorgyfalva Nagy-Gyorgyfalva Nagyjecsa Nagykikinda Nagykocse Nagykomlos Nagylajosfalva Nagymargitta Nagy-Margitta Nagynezseny Nagyosz Nagyszentmiklos Nagyszentpeter Nagytarnok Nagyteremia Nagytorak Nagytoszeg Nakodorf Nakofalva Nakovo Nemacka Crnja Nemacka Sarca Nemacki Elemir Nemetcsanad Nemetcsernye Nemetczernya Nemetecska Nemetellemer Nemeth Nemetmodos Nemetnagyszentmiklos Nemetpardany Nemetszarcsa Nemetszentmiklos Nemetszentpeter Nerau Nero Neu Itebe Neu Petsch Neu Sankt Iwan Neu Sankt Peter Neu Zerne Neuberg an der Bega Neubetsche Neudorf Neuhatzfeld Neu-Itebe Neu-Petsch Neu-Sankt-Iwan Neu-Sankt-Peter Neusiedel auf der Heide Neusiedel auf der Heide Neu-Zerne Neuzina Nezseny Nikloos Nova Crnja Nova Sarca Novi Becej Novi Itebej Novi Knezevac Novi Kozarci Novi Kozjak Novi Padej Novo Milosevo Nyero Obeb Obeba Obesenyo Obessenyo Obilicevo Oecska Offsenitza Offszenicza Ofsenita Okeresztur Olec Omlod Omoljica Opava Opovo Oppova Oppowa Oregfalu Orlod Orlovat Oroszlamos Oscsanad Ostern Ostojicevo 	Oszentivan Osztern Otelec Otelek Ovca Ovcsa Ozora Pade Padej Padina Pancevo Pancsova Pantschowa Papd Pardan Pardany Partos Peciu Nou Periam Perjamos Perjamosch Perlas Perlasz Perlez Pesac Pesak Peszak Petersheim Petre Petrovoszello Plandiste Pordeanu Porgany Pustinis Pusztakeresztur Rabe Raczaradac Raczkeresztur Radojevo Raitzisch Tschanad Rauti Ravni Topolovac Revaujfalu Rezsohaza Rogendorf Romanecska Romankecsa Romanszarcsa Rothes Wirthshaus Rudna Rudolfsgnad Rusko Selo Ruskodorf Rustendorf Sajan Sakula Sakule Samos Sanad Sandoregyhaza Sandorfalva Sandorhaza Sandra Sankt Georgen an     der-Bega Sankt Gerrgen Sankt Hubert Sankt Nikolaus an der     Theiss Sanmartinu Maghiar Sanmartinu Sarbesc Sannicolau Mare Sannicolaul German Sanpetru Mare Sanpetru Nou Sarafalva Sarafol Saravale Sarlevil Sartscha Schadat Schuple Secanj Sefkerin Seleus Serbisch Elemer Serbisch Itebe Serbisch Modosch Serbisch Neusin Serbisch Zerne Serbisch-Elemer Serbisch-Itebe Serbisch-Modosch Setschan Setschanfeld Seulthurn Seultour Sigmundfeld Sigmundsdorf Slovacki Aradac Soca Solthurn Soltur Srpska Crnja Srpska Neuzina Srpski Elemir Srpski Itebej Stara Ecka Starcevo Stari Lec Startschowa Stefanfold Stefanifeld Stefansfeld Stephansdorf Surjan Sutjeska Sveti Hubert Szajan Szajan Vilmater Szajanvilmater Szajan-Vilmater Szakula Szamos Szanad Szaravolla Szarcsa Szarcsatelek Szecsan Szecsenfalva Szefkerin Szekereny Szent Hubert Szent Janos Szent Mihaly Szentborbala Szenthubert Szent-Hubert Szentjanos Szent-Janos Szentmihaly Szent-Mihaly Szerbaradac Szerbboka Szerbcsanad Szerbcsenej Szerbczernya Szerbellemer Szerbittebe Szerbkecsa Szerbkeresztur Szerbklari Szerbmodos Szerbnagyszentmiklos Szerbneuzina Szerbpade Szerbpardany Szerbszentmarton Szerbszentpeter Szeultourn Szevkerin Szoka Szollos Szolosudvarnok Szoreg Szoregh Sztarcsova Tamasfalva Tamaslaka Taras Tarcso Tarras Teremi Teremia Mare Teremia Mica Tervar Tiszahegyes Tiszaszentmiklos Tiszatarros Toager Toba Togyer Tolvad Tolvadia Tolwadia Tomaschewatz Tomasevac Tomasevatz Tomasovac Tomnatic Tomsdorf Topolya Torda Torok Becse Torokbecse Torok-Becse Torokkanizsa Toroktopolya Torontal Erzsebetlak Torontal Petrovoszello Torontalalmas Torontaldinnyes Torontalerzsebetlak Torontal-Erzsebetlak Torontalgyulvesz Torontalkeresztes Torontaloroszi Torontalpetrovoszello Torontal-Petrovoszello Torontalszecsany Torontalsziget Torontaltorda Torontaludvar Torontalujfalu Torontalvasarhely Torzsudvarnok Totaradac Triebswetter Trubswetter Tschanad Tschawosch Tschene Tschestelek Tschestereg Tschoka Turkisch Betsche Turkisch-Betsche Uihei Uivar Ujhely Ujozora Ujpecs Ujsandorfalva Ujszentivan Ujszentpeter Ujvar Ulmbach Ungarisch Crnja Ungarisch Ittebe Ungarisch-Ittebe Urmenyhaza Usdin Uzdin Valcani Valkany Vegszentmihaly Velika Greda Veliki Gaj Veliki Torak Verbica Vizejdia Vizesd Vladimirovac Vojlovica Voroscsarda Vranjevo Vrbica Wiseschdia Wojlowitz Wojlowitza Zichidorf Zichydorf Zichyfalva Zitiste Zrenjanin Zrna Bara Zsigmondfalva Zsombolya",
        "Temes vármegye": "Ablian Aga Aldringen Alios Aliosch Allios Almad Alsobencsek Alsosztamora Altringen Alunis Angyalkut Aradu Nou Aranyag Babsa Bacova Bakovar Bakowa Bakuwa Balazsd Balazsfalva Banatska Palanka Banatski Karlovac Barachaza Baraczhaz Barateaz Baratzhausen Bavaniste Bavanistie Bawanischte Bazos Becicherecu Mic Begaszentmihaly Bela Crkva Belence Belethaza Belincz Belint Belotincz Belotint Bencecu de Jos Bencecu de Sus Berecuta Beregsau Beregsau Mare Beregsen Beregshofen Beregszo Berekszo Berekucza Berekutca Bereny Berestye Berini Berkeszfalu Bezdin Birda Blajova Blauschutz Blumenthal Bochovar Bodrogu Nou Bogda Brestea Brestovat Brestowatz Brestye Bresztovacz Bruckenau Buchberg Bucovat Budinc Budincz Budint Bukkfalva Bukkhegy Bukovecz Busiasch Butin Buttyin Buzad Buzias Buziasfurdo Cadar Calacea Capat Carani Cerna Cerneteaz Cesko Selo Charlotenburg Charlottenburg Cheches Chelmac Chesint Cheveresu Mare Chisoda Chizatau Ciacova Clopodia Colonia Mica Comeat Cornesti Cosarii Covaci Cralovat Crivobara Cruceni Crvena Crcva Csak Csakovar Csehfalva Cseralja Cserna Csernegyhaz Cuvesdia Dejan Deliblat Deliblato Denta Deta Detta Deutsch Bentschek Deutsch Sankt Peter Deutsch Stamora Deutsch-Sankt-Michael Deutschsanktpeter Deutsch-Sankt-Peter Deutsch-Stamora Dezsanfalva Dorgos Dragoiesti Dragojest Dragonyfalva Dragsina Dreispitz Dubosz Dubovac Dubovacz Duboz Dudestii Noi Dumbravita Dunadombo Duplaj Dupljaja Engelsbrunn Ermeny Fantanele Fehertemplom Feketeer Felnac Felsobencsek Felsosztamora Feregyhaz Ferend Ferendia Fibis Fibisch Ficatar Fikatar Firiteaz Fiscut Folea Folya Fonlak Freidorf Freydorf Frumuseni Furjes Fusku Gaiu Mic Gaj Gaja Gajtas Gajtasoll Galya Gataia Gataja Gatalja Gattaja Gelu Gerebenc German Gertenisch Gertenyes Gherman Ghertenis Ghilad Ghiroda Ghizela Giarmata Gilad Giroc Giroda Giseladorf Gizela Gizellafalva Goldast Grebenac Grebenacz Gross Beregsau Gross Scham Gross Sredischte Gross-Beregsau Grossdorf Gross-Scham Grosstoplowetz Gudurica Gutenbrunn Guttenbrunn Gyarmatha Gyirok Gyorod Gyureg Hattyas Hennemannstadt Herneacova Hidasliget Hidegkut Hisias Hiszias Hitias Hittyias Hodon Hodoni Hodony Hodos Homokbalvanyos Homokdiod Homokos 	Homokszil Hosszuag Hosszuszo Ianova Icloda Ictar Ictar-Budinti Iklod Ikloda Iktar Iosifalau Izbiste Izbistye Izvin Jablanka Jabuka Jahrmarkt Jamu Mare Janova Janowa Jasenovo Jaszenova Jebel Jeszvin Josefsdorf Jozseffalva Kadar Kajtasovo Kalacsa Kalatscha Kaluderovo Kamaraszentgyorgy Karasjeszeno Karlsdorf Karolyfalva Kekes Kelmak Keped Kepeth Keresztes Keszincz Ketfel Kevepallos Kevevara Kisbecskerek Kischoda Kisfalud Kisgaj Kisgye Kisrekas Kissemlak Kissoda Kisszentmiklos Kisszentpeter Kisszered Kisszredistye Kistelep Kistopolovecz Kistopoly Kiszeto Kiszsam Kizdia Klein Betschkerek Klein Sankt Niklas Klein Sankt Nikolaus Klein Schemlak Klein Schemlok Klein-Betschkerek Klein-Sankt-Niklas Klein-Sankt-Nikolaus Kleinsanktpeter Klein-Schemlak Klein-Schemlok Kleinsiedel Klopodia Knees Knes Knez Komjath Korted Kovacsi Kovesd Kovin Kowatsch Kralyevecz Kreutzstadten Kreutzstatten Krimarvara Krivobara Kruscica Krusicza Kubin Kudricz Kudritz Kusics Kusis Kusits Kustely Kustilj Labas Labasincz Labasint Lacunas Laczunas Lagerdorf Latunas Liebling Ligeth Lipova Lippa Lippakekes Lippakeszi Lucaret Lukacsko Lukarecz Magyarapaca Magyarmedves Magyarszakos Mailat Majlathfalva Mali Zam Malo Srediste Manastire Manastur Manester Margitfalva Markovac Markovecz Marktelke Marosaszo Maroseperjes Marospetres Maslak Masloc Maureni Medves Mehala Melykastely Melynadas Mercydorf Merczifalva Merczydorf Merczyfalva Merzydorf Mesis Messicz Meszdorgos Meszesfalu Mezosomlyo Mezozsadany Monostor Monostorszentgyorgy Moravicza Moravita Morawitz Morawitza Moricfold Moriczfold Moritzfeld Mosnica Mosnicza Mosnita Noua Mosnita Veche Mramorak Munar Murani Murany Nadas Nadfal Nagyfalu Nagykarolyfalva Nagykoveres Nagysemlak Nagyszered Nagyszilas Nagyszredistye Nagytopolovecz Nagytopoly Nagyzsam Nemetbentsek Nemetremete Nemetsaagh Nemetsag Nemetszentmihaly Nemetszentpeter Nemetsztamora Neu Beschenowa Neuarad Neu-Beschenowa Neudorf Neuhof Niczkidorf Niczkydorf Niczkyfalva Nikolinci Nikolincze Nitchidorf Nitzkidorf Nitzkifalva Nova Palanka Obad Ohaba-Forgaci Ohaba-Forgacs Omor Opalanka Opaticza Opatita Orcsacz Orczidorf Orczifalva Orczydorf Orczyfalva Oresac Ortisoara Orzydorf Oszeny Osztrova Otveny Otvesti Otvosd Otvosfalva Padureni Palank Paniova Panjowa Panyo Panyova Parac Paracz Paratz Parta Paulis Pavlis Percosova Perkossowa Perkoszova Petercse Petres Petris Petroman Petromany Petrovaselo Petrovoszello Pischia 	Plocica Ploschitz Plosicz Podporany Porany Potporanj Racovita Rakovica Rakovicza Rautendorf Rebenberg Recas Rekas Rekasch Rekashely Remete Remetea Mare Remetea Mica Rethat Rethely Rettisova Rigosfurdo Ritisevo Rittberg Romanbentsek Romanszentmihaly Romansztamora Rovinita Mare Saagh Sacalaz Sackelhaus Sackelhausen Sacosu Mare Sacosu Turcesc Saderlach Saderlak Sag Sagu Sanandrei Sangeorge Sankt Andreas Sanmihaiu German Sanmihalu Roman Sannicolau Mic Sanovita Sanpetru German Sanpetru Mic Sarbova Saroltavar Satchinez Satu Mare Schag Schebel Schipet Schondorf Sculia Sebed Secas Seceani Secusigiu Segentau Segenthau Sekel Sekeschut Semlacu Mare Semlacu Mic Silagiu Sinersig Sintar Sipet Sipeth Sistaroc Sistarovat Sistarovecz Skorenovac Skorenowatz Socica Soosdia Sosd Sosdea Stamora Germana Stamora Romana Stanciova Stancsova Straza Susanovecz Sustra Szabadfalu Szakalhaz Szakalhaza Szecsany Szekas Szekelykeve Szekesut Szent-Andras Szent Andras Szentandras Szepfalu Szephely Szigetfalu Sziklas Szilas Szinerszeg Szirbo Szirbova Szkulya Szolcsicza Szoloshegy Sztancsafalva Tarnokszentgyorgy Temesag Temesbereny Temesbokeny Temeschburg Temeschkubin Temeschwar Temescserna Temesdoboz Temesfalva Temesforgacs Temesfuves Temesfuzkut Temesgyarmat Temeshidegkut Temeshodos Temesillesd Temesjeno Temeskalacsa Temeskeresztes Temeskiralyfalva Temesknez Temeskomjat Temeskovacsi Temeskovesd Temeskubin Temeskutas Temesliget Temesmiklos Temesmora Temesmurany Temesnagyfalu Temesor Temespaulis Temespeterfalva Temespeteri Temesrekas Temesremete Temesszecseny Temesszekas Temessziget Temesszolos Temesujfalu Temesujlak Temesujnep Temesvajkoc Temesvar Temesvaralja Temesvukovar Temeswar Tes Tesfalu Tesold Thees Theresiopel Timisoara Tisa Noua Topolovatu Mare Topolovatu Mic Tormac Torokszakos Totsztamora Traunau Tronau Tschakowa Ujarad Ujbessenyo Ujbodrog Ujfalu Ujjozseffalva Ujlak Ujpalanka Ujszentes Uliuc Uljma Ulma Ungarisch Medwisch Ungarisch Weisskirchen Ungarisch-Medwisch Unip Urseni Ususau Utvin Utwin Vadaszerdo Vajdalak Vajkovecz Varadia Varazsliget Varias Varjas Varnita Varsomlyo Vatin Vattina Vegvar Vejte Veliko Srediste Versec Versecvat Versecz Vinga Vizma Vlajkovac Voiteg Vojtek Vojvodinci Vojvodincz Vorostemplom Vracsevgaj Vrasev Gaj Vrsac Vucova Vukova Warjasch Weisenheid Weisskirchen Werschetz Werschitz Wiesenhaid Winga Wojteg Wojtek Zabrani Zabrany Zadareni Zaderlach Zadorlak Zagajcza Zagajica Zardaszentgyorgy Zsadany Zsebel",
        "Bács-Bodrog vármegye": "Abthausen Ada Almas Almasch Alsokabol Alsokovil Alt Betsche Alt Futak Alt Keer Alt Ker Alt Palanka Alt Schowe Alt Sivac Alt Stapar Alt Verbas Alt Werbass Altbetsche Alt-Betsche Alt-Futak Alt-Futok Altfuttak Alt-Keer Alt-Ker Alt-Palanka Alt-Schowe Alt-Sivac Alt-Siwatz Alt-Stapar Alt-Verbas Alt-Werbass Altwiesen Apathin Apatin Apatin Baatsch Bac Backa Palanka Backa Topola Backi Breg Backi Brestovac Backi Gracac Backi Jarak Backi Monostor Backi Petrovac Backo Dobro Polje Backo Gradiste Backo Novo Selo Backo Petrovo Selo Bacs Bacsalmas Bacsbokod Bacsborsod Bacsfeketehegy Bacsfoldvar Bacsgyulafalva Bacskeresztur Bacskertes Bacskossuthfalva Bacsnovoszello Bacsordas Bacspetrovoszek Bacsszentivan Bacstovaros Bacsujfalu Bacsujlak Baja Baje Bajmok Bajnok Bajsa Baracska Bathmonostor Batmonostor Batsch Batsch Brestowatz Batsch Monoschtor Batsch Neudorf Batsch Sentiwan Batsch-Brestowatz Batschki Jarak Batsch-Sentiwan Becej Begec Begecs Bereg Berg an der Donau Besdan Bezdam Bezdan Bikity Birndorf Bleyersdorf Bodani Bodjani Bogojeva Bogojevo Bogyan Boldogasszonyfalva Boroc Borota Borschod Borsod Backi Breg Breg Brestowatz Bresztovacz Buchenau Budisava Bukin Bulkes Bulkesz Bulkeszi Cantavir Celarevo Conopla Conoplja Crvenka Csantaver Csatalja Csavoly Cseb Cservenka Csonopla Csonoplya Csurog Curug Dautova Davod Dernye Deronje Deronya Despot Sankt Iwan Despotovo Despot-Sankt-Iwan Despotszentivan Deutsch Palanka Deutsch-Palanka Deutschwachenheim Donji Kovilj Dornau Doroslovo Doroszlo Dunabokeny Dunacseb Dunagalos Dunagardon Durdev Ebersdorf Feketehegy Feketic Feketitsch 	Felsokabol Felsokovil Felsoszentivan Filipova Filipowa Filipsdor Foldvar Frankenstadt Frauendorf Futak Futog Gador Gajdobra Gakova Gakovo Gakowa Gara Gardinovci Gardinovcze Gaumarkt Glozan Glozsan Gombos Gornji Kovilj Gospodinci Gospodinze Goszpodince Gross Ker Gross Stapar Gross-Ker Gross-Stapar Gutacker Gyurgyevo Hanfhausen Hegyes Hercegszanto Hodsag Hodschach Hodschag Hügelhorst Jankovacz Jankowatz Janoshalma Jarek Josefdorf Josefsdorf Kabol Kac Kanjiza Karavukova Karavukovo Karawukowa Katschmar Katy Katymar Kerekegyhaz Kereny Keresztur Kernei Kernya Kernyaja Kindlingen Kisac Kishegyes Kisker Kisszallas Kiszacs Klein Keer Klein Ker Klein-Keer Kleinwiesen Kljajicevo Kolluth Kolpeny Kolut Koluth Kortes Kovilj Kovilszentivan Kowil Sankt Iwan Kruschiwl Kruscic Krusevlje Krusevlya Kucora Kucura Kuczura Kula Kullod Kulpin Kumbai Kunbaja Kupusina Kupuszina Kutzura Lalic Lality Legin Liliomos Lok Lovcenac Madaras Madarasch Maglic Magyarkanizsa Mali Idos Mali Idjos Maria Theresianope Maria-Theresianope Martonos Matetelke Matheovics Melykut Militics Milititsch Mladenovo Mohol Mol Monostorszeg Moschorin Mosorin Mozsor Nadalj Nadalja Nadaly Nagelsdorf Nagybaracska Nemesmilitics Nemetpalanka Neu Futak Neu Futok Neu Palanka Neu Schowe Neu Sivac Neu Siwatz Neu Verbas Neu Werbass Neudorf Neudorf an der Donau Neu-Futak Neu-Futok Neufuttak Neu-Palanka Neusatz Neu-Schowe Neu-Verbas Neu-Werbass Nova Gajdobra Nova Palanka Nove Sove Novi Futog Novi Sad Novi Sivac Novoszello Obecse Ober Sankt Iwan Oberndorf Ober-Sankt Iwan Obrovac Obrovacz Obrowatz Odzaci Ofuttak Okanizsa Oker Omoravicza Opalanka Orszallas Osove Oszivac 	Oszivatz Osztapar Overbasz Pacir Pacser Palanka Palona Parabutsch Parabuty Paraga Parage Paraput Paripas Parrag Peterreve Petroc Petrovac Petrovacz Petrovoszello Petrowatz Pfalzweiler Pinced Piros Pivnice Pivnicza Piwnitza Plankenburg Plavingen Plavna Plawing Plawingen Priglavitzaszentivan Priglewitz Prigrevica Raczmilitics Ratkovo Ravno Selo Regoce Rem Ridica Ridjica Riedau Rigyicza Rim Ringdorf Rotweil Rumenka Ruski Krstur Sajkas Sajkasgyorgye Sajkaslak Sajkasszentivan Sandor Sankt Thomas Savino Selo Sawaditz Schanzdorf Schatzdorf Schomburg Schonau Schonhausen Schwarzberg Schwarzenberg Sekitsch Selenca Senta Silbas Sivac Sombor Sonnhag Sonnhofen Sonta Sove Srbobran Srpski Miletic Stanischitz Stanisic Stapar Stara Moravica Stara Palanka Stare Sove Stari Futog Stari Sivac Stari Vrbas Subotica Svetozar Miletic Szabadka Szantova Szeghegy Szentfulop Szent-Tamas Szepliget Szilbacs Szilbas Szilberek Szond Szonta Sztanisich Sztanisics Sztapar Tannenschutz Tatahaza Teichfeld Telecka Telecska Teletschka Temerin Theisshugel Theresienring Thomasberg Tiszafoldvar Tiszaistvanfalva Titel Tittel Tizsakalmanfalva Topolya Torschau Torzsa Tovarisevo Tovarisova Towarisch Towarischewo Tschatali Tschawal Tschawerl Tscheb Tscherwenka Tschonopl Tunderes Turia Turija Turja Ujfutak Ujpalanka Ujsove Ujszivac Ujszivatz Ujverbasz Ujvidek Urszentivan Vajska Vajszka Vaskut Veprod Veprovacz Verbas Verbasz Vilova Vilovo Vrbas Waiska Waldau an der Donau Waldneudorf Waschkut Wekerle Wekerledorf Wekerlefalva Weprowatz Wikitsch Wolfingen Wolfsburg Zabalj Zenta Zmajevo Zombor Zsablya",
        "Krassó-Szörény vármegye": "Agadici Agadics Almafa Almasrona Alsogorbed Alsolupko Alsopozsgas Alsovarany Alsozorlenc Alt Orschowa Alt Sadowa Alt Schupanek Alt-Orschowa Alt-Sadowa Alt-Schupanek Anina Aninasteyerlak Apadia Armadia Armenis Avasfalva Bacau de Mijloc Baile Herculane Bakamezo Balinc Balincz Balint Balintin Balintz Balosest Balosesti Banatska Subotica Bania Banya Bara Barafalva Barbos Barbosu Barbosza Barna Barnafalva Barra Barsonyfalva Barza Baszest Bata Batesti Batta Batyest Bazias Bazosd Begabalazsd Begahosszupatak Begakalodva Begakortes Begalankas Begalaposnok Begamonostor Beganyiresd Begapata Begaszederjes Begaszentes Begaszuszany Begheiu Mic Belajablanc Belobresca Belobreska Benyes Bergwerk Dognatscka Bergwerk Neu Moldowa Bergwerk Sasska Bergwerk-Neu-Moldowa Bergwerk-Sasska Bergwerk Sasska Berliste Berlistye Bersaska Bersing Berzasca Berzaszka Berzovia Bethausen Bethlenhaas Bethlenhaza Betlenhaza Bichigi Bigar Biger Bikis Binis Birchis Birkis Birna Bisztere Bisztracseres Bisztranagyvolgy Bisztranyires Bocsa Bocsa Romana Bodo Bogaltin Bogodincz Bogodint Bogolteny Bogoltin Bogorfalva Bogsan-Banya Bogsan Banya Bogsanbanya Bogschan Bojtorjanos Bokeny Bokos Boksanbanya Boldor Boldur Bolvas Bolvasnicza Bolvasnita Bolvasvolgy Borlava Borlo Borlova Borlovenii Noi Borlovenii Vechi Borza Borzasfalva Borzeny Bosowitsch Botesti Botinesti Bottinest Bottyanfalva Botyest Bozovici Bozovics Bozsar Bozsor Bradisoru de Jos Branesti Branyest Brazova Breazova Brebu Brebu Nou Breszonfalva Brezon Brosteni Brostyan Bruznic Bruznik Buchin Bucosnita Bucovat Bukin Bukosnicza Bukovec Bukovecz Bulci Bulcs Bulza Bunea Mare Bunea Mica Bunya Bunya-Szegszard Bunya Szegszard Bunyaszekszard Calina Calnic Campia Canicea Capalnas Caprioara Caransebes Caransebesu Nou Carasova Carbunari Carnecea Cavaran Cella Cerova Cicleni Ciclova Montana Ciclova Romana Ciortea Ciresa Ciresu Ciuchici Ciudanovita Ciuta Cladova Cliciova Clocotici Comoraste Coramnic Cornea Cornereva Coronini Cosava Cosevita Costeiu Costeiu de Sus Coşteiu Mare Coşteiu Mic Criciova Crivina Crivina de Sus Crusovat Cseherdos Cserestemes Csernabesenyo Csernaheviz Csikleny Csiklobanya Csiklofalu Csiklovabanya Csiresa Csorda Csudafalva Csudanovecz Csukas Csukits Csuta Csutta Cuptoare Curtea Cutina Czella Czerova Dalboset Dalbosfalva Dalbovecz Dalci Dalcs Darova Darowa Daruvar Delenyes Delinesti Delinyest Derenyo Dereste Deutsch Bogschan Deutsch Bokschan Deutsch Fatschet Deutsch Lugosch Deutsch Orawitz Deutsch Reschitza Deutsch Sasska Deutsch Tschiklowa Deutsch-Fatschet Deutsch-Lugosch Deutsch-Reschitza Deutsch-Sasska Dezesd Dezesti Dicseny Divecs Divici Divits Dobosd Dobrest Dobresti Dobricevo Dobrosd Doclin Dognacska Dognatschka Dognecea Dokleny Doklin Dolnya-Lyubkova Doman Domany Domasnea Domasnia Domasnya Dragfalva Dragomer Dragomirest Dragomiresti Dragsinesti Drakszinyest Drinova Dubest Dubesti Dubova Duleo Duleu Dullo Dunaorbagy Dunaszentilona Dunatolgyes Ebendorf Eftimie Murgu Eibenthal Ekes Ersig Erszeg Ezeres Ezeris Facsad Fadimac Fadimak Faget Fagymag Farasesti Fardea Farliug Fatschet Fatschet Fejerdomb Felsogorbed Felsokastely Felsolupko Felsopozsgas Felsovarany Felsozorlenc Fenes Fenyes Ferde Ferdinand Ferdinandsberg Ferencfalva Fisesch Fizes Forasest Forotic Forotik Forrasfalva Franzdorf Fulophaz Furdia Furlug Furluk Fuzes Galacs Galadna Galadnabanya Galonya Garana Garbovat Garliste Garnic Gavojdia Gavoschida Gavosdia 	Gerboc Gerbovecz Gerlistye Geroc Giurgiova Gladna Montana Gladna Romana Glimboca Glimboka Globu Craiovei Globukrajova Globurau Globureu Goizesti Gojcsfalva Golbor Golecz Golet Gornea Gornya-Lyubkova Gorony Goruia Goruja Goyzest Gradinari Gravosdia Greoni Greovacz Grosi Gross Gross Kakowa Gross Surduk Gross-Surduk Gruin Gruni Gruny Gutonya Gyepesfalu Gyorosd Harampatak Harmad Harmadia Hauzest Hauzesti Hegyeslak Heres Herkulesbad Herkulesfurdo Herrendesti Hever Heyerdorf Hezeres Hezeris Hodos Homapatak Homojdia Homosdia Honorici Honoris Honoros Hosszuremete Hosszuszabadi Hrendjest Iabalcea Iablanita Iam Iaz Iersnic Iertof Ieselnita Illadia Illidia Illopatak Illova Illyed Ilova Istvanfalva Istvanhegy Izgar Jabalcsa Jabar Jablanicza Jam Jasz Jdioara Jena Jerce Jersnik Jerszegh Jeselnicza Jitin Jupa Jupalnic Jupanesti Jupani Juresti Kakofalva Kakova Kakowa Kalina Kanizsa Kapolnas Kaprevar Kapriora Karanberek Karansebes Karansebesch Karasszentgyorgy Karlsdorf Karolyfalva Kastely Kavaran Kemenceszek Kengyelto Kernyecsa Kiralykegye Kisbekes Kiskarolyfalva Kiskastely Kiskiralymezo Kiskosso Kiskostely Kiskrasso Kislaposnok Kismihald Kismutnik Kismutnok Kisszabadi Kisszecseny Kisszurduk Kistikvany Kiszorlenc Kladova Klicso Klicsova Klokotics Kofalu Kohldorf Kolnik Kolnok Komoriste Komoristye Komornok Konigsgnad Koramnik Korcsona Kornia Kornya Kornyareva Koromnok Koronini Korpa Kortvelypatak Kosso Kossova Kossovica Kostej Kranichstatten Daruwa Krassoalmas Krassobarlang Krassoborostyan Krassocser Krassocsorgo Krassofuzes Krassogombas Krassohodos Krassoszekas Krassoszombat Krassova Krassovar Krassovermes Krassoviszak Kricso Kricsova Krivina Krocsma Krusovecz Krusovetz Kuptore Kuptore-Szekul Kuptore Szekul Kuptoreszekul Kuptorja Kurtya Kuttina Lalanc Lalasincz Lalasint Langenfeld Lapusnic Lapusnicel Lapusnicu Mare Lapusniczel Lapusnik Laszlovara Lenkusest Lescovita Leszkovicza Leucusesti Leukosest Lindenfeld Liubcova Lokosfalva Lugoj Lugojel Lugos Lugosegres Lugoshely Lugoskisfalu Luncanii de Jos Luncavita Lunkany Lunkavicza Lupac Lupak Lyubkova-Dolnya Lyubkova Dolnya Lyupkova-Gornya Lyupkova Gornya Maal Macesti Maciova Macoviste Macsevics Macsova Magur Magura Maguri Majdan Makosfalva Makovistye Mal Manastiur Marga Margina Mariahavas Maria-Schnee Maria Schnee Mariaschnee Marosberkes Marosborosznok Maroserdod Marosgoros Marosnagyvolgy Marossziget Maru Marzsina Matevolgye Matnicu Mare Matnicu Mic Matyasmezo Mehadia Mehadica Mehadika Mercina Mercseny Mercsina Mikloshaza Milcoveni Mirkoc Mirkovacz Moceris Mocsaros Moldova Noua Moldova Veche Moldovita Moniom Monostor Monyo Moravica Morul Mutnokszabadja Nadrag Nagybodofalva Nagykastely Nagykostely Nagylankas Nagylaposnok Nagymutnik Nagymutnok Nagyszurduk Nagytikvany Nagyzorlencz Nagyzsupany Nagyzsupany Naidas Najdas Nandorhegy Naszados Nemcse Nemcsest Nemesesti Nemetfacset Nemetgladna Nemetlugos Neraaranyos Nerahalmos Neramezo Neramogyoros Neranadas Nerapatas Nerasolymos Neraszlatina Nermed Nermeth Neu Karansebesch Neu Schupanek Neu-Schupanek Neuwerk Nevrincea Nevrincsa Nicolint Nikolincz Norincse Novakfalva Oasszonyret Oborloveny Obreja Obrezsa Ocna de Fier Ogerlistye Ogradena Noua Ogradena Veche Ohaba Lunga Ohaba Romana Ohaba-Bisztra Ohaba Bisztra Ohabalunga Ohaba-Matnic Ohaba Matnic Ohabamutnik Ohabaszerbaszka Ohabicza Ohabita Okorpatak Olahfacset Ollosag Olosag Omoldova Oogradina Oravicabanya Oravicafalu Oraviczabanya Oravita Oravita Romana Orawitz Orawitza Ormenyes Orschowa Orsova Oruszolc Oruszova Osopot Ostrov Oszadova Oszagyva Osztrov Otelul Rosu Ozsupanek Padina Matei Padinamate Padurany Patas Pecinisca 	Pecseneska Perebo Perestyen Perlo Perul Pervova Pescari Pestere Pestyere Petnek Petnic Petnik Petresfalva Petrillova Petrilova Petroasa Mare Petrosnita Petrosnitza Petrosza Plavisevicza Plugova Poganesti Poganyest Poganyfalva Poganyosremete Poganyosvolgy Poiana Poieni Pojana Pojejena Pojejena de Jos Pojejena de Sus Pojen Pojoga Porho Porzson Potoc Potok Povargina Poverzsina Pozsga Pozsgas Pozsoga Prebul Prigor Prilipecz Prilipet Prisaca Prisian Priszaka Priszian Putna Racasdia Rachita Rachitova Racszabadi Radimna Radmanesti Radmanoc Radmanyest Radonya Raffnik Rafna Rafnic Rakasd Rakazsdia Rakito Rakitta Rakittova Ramna Ravensca Ravenszka Rekettyo Remetea Lunca Remetea-Poganici Remetea Poganici Remetelunga Remetepoganest Reschitza Resicabanya Resicabanya Resiczabanya Resita Romanbogsan Romanbogsany Romanbunya Romancsiklova Romanesti Romanfacset Romangladna Romanlugos Romanoravicza Romanposzecsena Romanresicza Romanszaszka Rudaria Rugi Ruginosu Rugyinoc Rujen Rumanisch Bokschan Rumanisch-Bokschan Rumunyest Rusca Rusca Montana Ruschita Ruskberg Rusova Noua Rusova Veche Russberg Ruszka Ruszkabanya Ruszkato Ruszkica Ruzs Ruzsinos Ruzsinosz Saceni Sacu Sadova Noua Sadova Veche Sakul Salbagel Salciva Salha Sarazani Sasca Montana Sasca Romana Scaius Schnellersruhe Schwabendorf Sebesmezo Sebesrom Sebestorony Secaseni Sfanta Elena Sichevita Sintesti Sisak Slatina Slatina-Nera Slatina Nera Slatina-Timis Slatina Timis Soceni Socol Socolari Somfa Somosreve Sopotu Nou Sopotu Vechi Spata Spatta Stajerlakanina Stefanesti Steierdorf Anina Steierdorf-Anina Steinacker Stinapari Stiuca Sudrias Sumicza Sumita Surducu Mare Surducu Mic Susani Susca Suska Svinita Szabalcs Szadvorosmart Szakalar Szakul Szalakna Szaparyfalva Szarazan Szarazany Szaszka Szaszkabanya Szatumik Szecseny Szekas Szelcsova Szendelak Szenesfalu Szent-Helena Szerbposzecsena Szervesd Szervestye Szikesfalva Szikovicza Szilha Szilvashely Szinice Szintyest Szkeus Szlagna Szlatina Szocsan Szocsany Szokolar Szokolovacz Szolcsva Szorenybalazsd Szorenybuzas Szorenykanizsa Szorenyordas Szuboticza Szudrias Szuszany Szvinyicza Tamasd Tapia Targoviste Tarnova Tela Temeres Temeresti Temesfo Temesszlatina Temesvolgye Teplitz Teregova Teregowa Tergovest Terova Ticvaniu Mare Ticvaniu Mic Tincova Tinkova Tipari Tirnova Tirol Tiszafa Tiszoca Tiszovicza Tomest Tomesti Topla Toplecz Toplet Toplitz Torno Traian Vuia Tschiklowa Tufari Tuffas Tuffier Turnu Turnu Ruieni Turnul Tyuko Udvarszallas Ujasszonyret Ujborloveny Ujkaransebes Ujmoldova Ujogradina Ujruszolc Ujruszova Ujsopot Ujszadova Ujszagyva Ujzsupanek Vaar Vadpatak Valdeny Valea Bistrei Valea Bolvasnita Valea Lunga Romana Valea Mare Valea Timisului Valeadeni Valeadeny Valealunga Valeamare Valeapai Valemare Valiaboul Valisoara Valisora Valiug Valyabolvasnicza Vama Marga Vama-Marga Vamosmarga Var Varboksan Varciorova Varcsaro Vasaros Vasiova Vasko Vassafalva Vasziova Vecsehaza Veidenthal Vercerova Verend Verendin Vermes Victor Vlad Delamarina Virismort Visag Viszag Vizes Vodnic Vodnik Voislova Voiszlova Volfsberg Vorosmart Vrani Vraniut Vrany Vranyucz Walachisch Bogschan Walachisch Lugosch Walachisch Orawitz Walachisch Reschitza Walachisch-Bogschan Walachisch-Lugosch Walachisch-Orawitz Walachisch-Reschitza Wallachisch Fatschet Wallachisch-Fatschet Weidenthal Weitzenried Werk Bogschan Wolfsberg Zabalt Zabolcz Zagujeni Zaguzsen Zavoi Zavoj Zavoly Zervesti Zgribest Zgribesti Zlagna Zlaticza Zlatita Zold Zolt Zorani Zorany Zorlencior Zorlentu Mare Zsabar Zsena Zsidovar Zsidovin Zsittin Zsupanek Zsupanfalva Zsupanyest Zsuppa Zsuppany Zsurest Zsurzsova"
    };
    Object.entries(hungarianCounties).forEach(([county, villages]) => {
        if(villages.indexOf(villageTidy)>-1)
        {
            countyForVillage = county; 
        }
    });
    return countyForVillage;
}
