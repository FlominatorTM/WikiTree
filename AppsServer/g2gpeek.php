<?php
$post = $_REQUEST['post'];
$answer = $_REQUEST['a'];

$url = "$post?show=$answer&appId=Straub620_g2gpeek#a$answer";

echo "<!--$url--->";
echo "please hold the line ...";
$page = file_get_contents($url);

$tagsBeforeText = '<a name="' . $answer . '"></a><div itemprop="text">';
$indexBeforeText = strpos($page, $tagsBeforeText) + strlen($tagsBeforeText);

$tagsAfterText = '<span class="qa';
$indexAfterText = strpos($page, $tagsAfterText, $indexBeforeText);
$lengthText = $indexAfterText - $indexBeforeText;
$msg = substr($page, $indexBeforeText, $lengthText);

$tagBeforeUserName = '="qa-user-link">';
$indexStartUserName = strpos($page, $tagBeforeUserName, $indexAfterText);
$indexStartUserName += strlen($tagBeforeUserName);
$indexEndUserName = strpos($page, "</", $indexStartUserName); //spelling of </a> differs
$lengthUserName = $indexEndUserName - $indexStartUserName;
$user = substr($page, $indexStartUserName, $lengthUserName);

$removedUserToken = "anonymous";
$indexAnonymous = strpos($page, $removedUserToken, $indexAfterText);
if ($indexAnonymous > 0 && $indexAnonymous < $indexStartUserName) {
    $user = "[deactivated user]";
    $indexStartUserName = $indexAnonymous;
}

$lengthBetween = $indexStartUserName - $indexAfterText;
$between = substr($page, $indexAfterText, $lengthBetween);
$what = "Answer";
if (stristr($between, "qa-c-item-who-data")) {
    $what = "Comment";
    $url = str_replace("#a", "#c", $url);
}

header('Content-Type: text/html; charset=utf-8');
echo "<html>";
echo " <head>";
echo '<meta http-equiv="refresh" content="0; URL=' . str_replace("&appId=Straub620_g2gpeek", "", $url) . '">';
echo '  <meta property="og:description" content="' . trim(htmlentities(strip_tags($msg)))  . '">';
echo '  <meta property="og:title" content="' . $what . ' by ' . $user .  '">';
echo '  <title>' . $what . ' by ' . $user . ' </title>';
echo " </head>";
echo " <body>";
echo " </body>";
echo " </html>";
