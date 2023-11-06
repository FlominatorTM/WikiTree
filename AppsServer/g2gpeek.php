<?php

$post = $_REQUEST['post'];
$answer = $_REQUEST['a'];

$url = "$post?show=$answer&appId=Straub620_g2gpeek#a$answer";

echo $url;
$page = file_get_contents($url);
// echo "get done<br>";

$doc = new DOMDocument();
@$doc->loadHTML($page);
// echo "load done<br>";

// echo "a=$answer<br>";

$aTags = $doc->getElementsByTagName("a");
$len = $aTags->length;
for ($i = 0; $i < $len; $i++) {
    // echo "$i<hr><br>";
    // echo $aTags[$i]->getAttribute("name") . "<br>";

    if ($aTags[$i]->getAttribute("name") == $answer) {

        $qaaitemavatarmeta = $aTags[$i]->parentNode->nextSibling->nextSibling->firstChild->nextSibling;
        $qaaitemwho = $qaaitemavatarmeta->childNodes[5];

        $user = "";
        $what = "";
        if ($qaaitemwho != null && $qaaitemwho->childNodes[3] != null && $qaaitemwho->childNodes[3]->nodeValue != null) {
            $user = $qaaitemwho->childNodes[3]->nodeValue;
            $what = "Answer";
        } else {

            $qacitemmeta = $qaaitemavatarmeta->childNodes[1];
            $qaaitemwho = $qacitemmeta->childNodes[5];
            $user = $qaaitemwho->childNodes[3]->nodeValue;
            $what = "Comment";
            $url = str_replace("#a", "#c", $url);
        }

        header('Content-Type: text/html; charset=utf-8');
        echo "<html>";
        echo " <head>";
        echo '<meta http-equiv="refresh" content="0; URL=' . str_replace("&appId=Straub620_g2gpeek", "", $url) . '">';
        echo '  <meta property="og:description" content="' .  htmlentities($aTags[$i]->nextSibling->textContent)  . '">';
        echo '  <meta property="og:title" content="' . $what . ' by ' . $user .  '">';
        echo '  <title>' . $what . ' by ' . $user . ' </title>';
        echo " </head>";
        echo " <body>";
        echo " </body>";
        echo " </html>";
        break;
    }
}
