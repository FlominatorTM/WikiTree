<?php
$post = $_REQUEST['post'];
$answer = $_REQUEST['a'];
$is_debug = isset($_REQUEST['debug']);
$url = "$post?show=$answer&appId=Straub620_g2gpeek#a$answer";

echo "<!--$url--->";
echo "please hold the line ...";
$page = file_get_contents($url);

$tagsBeforeText = '<a name="' . $answer . '"></a><div itemprop="text">';
print_debug("tagsBeforeText=" . $tagsBeforeText);

$indexBeforeText = strpos($page, $tagsBeforeText);
$description = "";
$title = "";
if ($indexBeforeText) {

    $indexBeforeText += strlen($tagsBeforeText);
    print_debug("indexBeforeText=" . $indexBeforeText);

    $tagsAfterText = '<span class="qa';
    $indexAfterText = strpos($page, $tagsAfterText, $indexBeforeText);
    print_debug("indexAfterText=" . $indexAfterText);
    $lengthText = $indexAfterText - $indexBeforeText;
    print_debug("lengthText=" . $lengthText);
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
    $description = trim(htmlentities(strip_tags($msg)));
    $title = $what . ' by ' . $user;
} else {
    $title = "Answer or reply to post '" . extract_from_to($page, '<meta itemprop="name" content="', '">' . "'");
    //$description = extract_from_to($page, '<meta name="description" content="', '">');
    $description = "This post is too recent, please wait a few minutes to see a preview ... or just click the link and let it surprise you!";
}
header('Content-Type: text/html; charset=utf-8');
echo "<html>";
echo " <head>";
if (!$is_debug) {
    echo '<meta http-equiv="refresh" content="0; URL=' . str_replace("&appId=Straub620_g2gpeek", "", $url) . '">';
}
echo '  <meta property="og:description" content="' . $description  . '">';
echo '  <meta property="og:title" content="' . $title .  '">';
echo '  <title>' . $title . ' </title>';
echo " </head>";
echo " <body>";
echo " </body>";
echo " </html>";

function print_debug($line)
{
    global $is_debug;
    if ($is_debug) {
        echo $line . "<br>\n";
    }
}

function extract_from_to($haystack, $prefix, $suffix)
{
    $index_prefix = strpos($haystack, $prefix) + strlen($prefix);
    $index_suffix = strpos($haystack, $suffix, $index_prefix);
    $length = $index_suffix - $index_prefix;
    // echo "$length = $index_suffix - $index_prefix<br>";
    return substr($haystack, $index_prefix, $length);
}
