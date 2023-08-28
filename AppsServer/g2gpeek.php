<?php

$post = $_REQUEST['post'];
$answer = $_REQUEST['a'];


$url = "$post?show=$answer#a$answer";

echo $url;
$page = file_get_contents($url);

$doc = new DOMDocument();
@$doc->loadHTML($page);

$aTags = $doc->getElementsByTagName("a");
$len = $aTags->length;
for($i=0;$i<$len;$i++)
{
    if($aTags[$i]->getAttribute("name") == $answer)
    {
        echo "hallo";
        $qaaitemmeta = $aTags[$i]->parentNode->nextSibling->nextSibling->firstChild->nextSibling;
        $qaaitemwho = $qaaitemmeta->childNodes[5];
        $user = $qaaitemwho->childNodes[3]->nodeValue;
        
        header('Content-Type: text/html; charset=utf-8');
        echo "<html>";
        echo " <head>";
        echo '<meta http-equiv="refresh" content="0; URL=' . $url . '">';
        echo '  <meta property="og:description" content="' .  $aTags[$i]->nextSibling->textContent  .'">';
        echo '  <meta property="og:title" content="Answer by ' . $user .  '">';
        echo '  <title>Answer by ' . $user .' </title>';
        echo " </head>";
        echo " <body>";
        echo " </body>";
        echo " </html>";
        break;
    }
}


?>
