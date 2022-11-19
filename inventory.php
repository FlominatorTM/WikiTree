<?php header('Content-Type: text/html; charset=utf-8');  ?>
<?php 
//hacky beginning of a version of https://github.com/FlominatorTM/wikipedia_inventory using WikiTree

// $LastChangedDate$
// $Rev$
//shows the entries from zukunft that have been removed
// include("shared_inc/wiki_functions.inc.php");

//$article = "Benutzer:Flominator/Zukunft";



$cat = $_REQUEST['cat'];
$article =  $_REQUEST['space'];
/*
$other_cat_enc = urlencode($_REQUEST['other_cat']);
$template = urlencode($_REQUEST['template']);
$template_missing = $_REQUEST['template_missing'] == "true";
$catenc = urlencode($cat); //Wikipedia%3AZukunft
$articleenc = name_in_url($article);
$lang = "de";
$project = "wikipedia";
$server = "$lang.$project.org";
$number_of_current_entries = 0;

$plainfuture_text = retrieve_current_list($catenc, $template, $other_cat_enc, $template_missing);	*/
$plainfuture_text =retrieve_current_list(str_replace("_", " ", urldecode($cat)));	 //"Germany Family Brick Walls"
$plain_text = get_plain_text_from_article(urldecode($article)); //"Space:Germany_Family_Brick_Wall_Category_Content"
/*
//echo "<hr>$plainfuture_text<hr>";
*/
//echo '<form method="post" action="https://'.$server.'/w/index.php?action=submit&title='. $articleenc .'" target="_blank">'."\n";
// echo '<form id="editform" name="editform" method="post" action="https://www.wikitree.com/wiki/Space:Germany_Family_Brick_Wall_Category_Content" enctype="multipart/form-data">';
echo "<textarea  name=\"wpTextbox1\">";
//echo  extract_and_update_introduction($plain_text);
echo $plainfuture_text;
echo "\n&nbsp;Count: $number_of_current_entries";
echo "</textarea><br>";
//echo '<input type="hidden" value="1" name="wpSection" />';
// set_up_media_wiki_input_fields("Inventar-Seite mit inventory.php aktualisiert", "Inventar-Seite aktualisieren", $articleenc);
// echo "</form>\n";

$entries_removed = compare_lists($plain_text, $plainfuture_text);
$entries_added= compare_lists($plainfuture_text, $plain_text);

// echo '<form method="post" id="diff_form" action="https://'.$server.'/w/index.php?action=submit&title='. urlencode('Wikipedia:Spielwiese') .'" target="_blank">'."\n";*/

echo "<textarea  name=\"wpTextbox1\">";
echo ":via [[".$article."]]\n";
echo "\n===missing===\n";
print_diff_list($entries_removed);
echo "\n===new===\n";
print_diff_list($entries_added);
echo "</textarea><br>";

/*echo '<input type="hidden" value="new" name="wpSection" />';
set_up_media_wiki_input_fields("Änderungen", "Änderungen anschauen", urlencode('Wikipedia:Spielwiese'));
echo "</form>\n";


function extract_and_update_introduction($plain_text)
{
    $introduction = extract_section_zero($plain_text);
    $LAST_UPDATE_PARAMETER = "LastUpdate";
    $REV_TIMESTAMP = "{{subst:REVISIONTIMESTAMP}}";
    $new_introduction = "";
    if(stristr($introduction, "LastUpdate"))
    {
        $new_introduction = update_template_parameter($introduction, $LAST_UPDATE_PARAMETER, $REV_TIMESTAMP);    
    }
    else
    {
        $new_introduction = str_replace("{{Artikelinventar", "{{Artikelinventar\n|$LAST_UPDATE_PARAMETER=$REV_TIMESTAMP", $introduction);
    }
    return $new_introduction;
}
function extract_section_zero($plain_text)
{
    $endOfIntroduction = "==\n";
    $indexOfEnd = strpos($plain_text, $endOfIntroduction) + strlen($endOfIntroduction);
    return substr($plain_text, 0, $indexOfEnd);
}*/
function print_diff_list($entries_removed)
{
    global $cat;
    $since = $_REQUEST['last'];
    $use_diff = ($since != "");
$use_diff = false;
    

    foreach($entries_removed AS $removed)
    {
		echo $removed."\n";
        // $article_with_link = str_replace(": [[:Kategorie:$cat|$cat]]", "", $removed);
        // $article = extract_link_target($article_with_link);
        // echo $article_with_link;
        // if($use_diff) 
        // {
            // echo " ([$url_prefix". name_in_url($article) . " diff])";
        // }
        // echo "\n";
    }
    echo "\n Changes: ". count($entries_removed);
}

function get_plain_text_from_article($article)
{
	global $server;
	$page = "https://api.wikitree.com/api.php?action=getProfile&key=".$article."&bioFormat=wiki&fields=Bio";
	echo $page."<br>";
	$json = json_decode(file_get_contents($page));
	return $json[0]->profile->bio;
}

function compare_lists($needles, $haystack)
{
	// echo "entering compare_lists";
	echo '<!--- it seems that some output every once in a while keeps the browser';
	echo ' from stopping to load the page. Therefor here there will be a lot of dots ';
	echo " that pop up while the script is working it's ass off: ";
	$results = array();
	// $hits = 0;
	$paragraphsRemoved = explode("\n",$needles);
	// echo "-->";
	 // echo "--><h2> haystack</h2><textarea>$haystack</textarea>";
	 // echo "<h2> needles</h2><textarea>$needles</textarea>";
	foreach($paragraphsRemoved AS $newLine)
	{
		set_time_limit(120);
		echo ".";
		$onlyOneNewArticle = explode("]]:", $newLine);
		if(	stristr( $onlyOneNewArticle[0], "*" ) 
		 &&	!stristr($haystack, $onlyOneNewArticle[0] )
		 &&	!stristr($haystack, str_replace('_', ' ', $onlyOneNewArticle[0] ))
		 &&	!stristr(str_replace('_', ' ',$haystack),  $onlyOneNewArticle[0] )
		)
		{
			// echo str_replace('_', ' ', $newLine) ."\n";
			$results[] = str_replace('_', ' ', $newLine);
			$hits++;
		}
	}
	// echo "$hits hits";
	// echo "leaving compare_lists";
	echo '-->';
	sort($results);
	return $results;
}


// from https://www.php.net/manual/en/function.str-getcsv.php
function parse_csv ($csv_string, $delimiter = ",", $skip_empty_lines = true, $trim_fields = true)
{
    $enc = preg_replace('/(?<!")""/', '!!Q!!', $csv_string);
    $enc = preg_replace_callback(
        '/"(.*?)"/s',
        function ($field) {
            return urlencode(utf8_encode($field[1]));
        },
        $enc
    );
    $lines = preg_split($skip_empty_lines ? ($trim_fields ? '/( *\R)+/s' : '/\R+/s') : '/\R/s', $enc);
    return array_map(
        function ($line) use ($delimiter, $trim_fields) {
            $fields = $trim_fields ? array_map('trim', explode($delimiter, $line)) : explode($delimiter, $line);
            return array_map(
                function ($field) {
                    return str_replace('!!Q!!', '"', utf8_decode(urldecode($field)));
                },
                $fields
            );
        },
        $lines
    );
}


function retrieve_current_list($cat/*$catenc, $template, $other_cat_enc="", $template_not_present=false*/)

{
	global $number_of_current_entries;
	// $url = "https://wikitree.sdms.si/function/WTWebProfileSearch/Profiles.htm?Query=CategoryFull%3D".$cat."&MaxProfiles=1500&Format=CSV";
	$url = "https://wikitree.sdms.si/function/WTWebProfileSearch/Profiles.htm?Query=subcat9=\"". urlencode("$cat")."\"&MaxProfiles=1500&Format=CSV";
	echo $url."<br>";
	
	
	$csv_page = file_get_contents($url);
	file_put_contents("profiles.csv",$csv_page);
	
	// $rows = explode("\n", $csv_page);
	// $rows = str_getcsv($csv_page);
	$rows = parse_csv($csv_page, $delimiter=";");
	
	/*
	 array(24) {
    [0]=> string(7) "User ID"
    [1]=> string(11) "WikiTree ID"
    [2]=> string(10) "Gender txt"
    [3]=> string(8) "FullName"
    [4]=> string(14) "Birth Date Txt"
    [5]=> string(21) "Birth Date Status Txt"
    [6]=> string(14) "Birth Location"
    [7]=> string(36) "Birth Location Country, Region, City"
    [8]=> string(25) "Birth Location Status txt"
    [9]=> string(19) "Birth Date Estimate"
    [10]=> string(13) "Birth Century"
    [11]=> string(14) "Death Date Txt"
    [12]=> string(21) "Death Date Status Txt"
    [13]=> string(14) "Death Location"
    [14]=> string(36) "Death Location Country, Region, City"
    [15]=> string(25) "Death Location Status txt"
    [16]=> string(11) "Privacy txt"
    [17]=> string(9) "Is Locked"
    [18]=> string(14) "All Categories"
    [19]=> string(13) "All Templates"
    [20]=> string(12) "All Managers"
    [21]=> string(12) "Guest Orphan"
    [22]=> string(16) "Project Managers"
    [23]=> string(6) "TreeID"
  }	*/
	$index_wikitree_id = 1;
	$index_categories = 18;
	$index_full_name = 3;
	$bulleted_list = "";

	// echo count($rows) . "rows";
	sort($bulleted_list);
	foreach($rows AS $row)
	{
		if(isset($row[$index_wikitree_id]) && $row[$index_wikitree_id] != "" && $row[$index_wikitree_id]!="WikiTree ID")
		{
			$categories_in_a_line = "";
			if(isset($row[$index_categories]) && trim($row[$index_categories]) != "" && $row[$index_categories]!="All Categories")
			{
				$categories = explode("\r\n", $row[$index_categories]);
				$num_cats = count($categories);
				for($i=0;$i<$num_cats;$i++)
				{
					$categories_in_a_line.= "[[:Category:" . $categories[$i] . "|" . $categories[$i].  "]], ";
				}
			}

			$line = utf8_encode("* [[".$row[$index_wikitree_id]."|". $row[$index_full_name]."]]");
			if($categories_in_a_line!="")
			{
				$line.= ": " . substr($categories_in_a_line, 0, strlen($categories_in_a_line)-2) /*removing last ", "*/;
			}
			$line.="\n";
			$bulleted_list.= $line;
			$number_of_current_entries = $number_of_current_entries + 1;
		}
	}
	$bulleted_array = explode("\n", $bulleted_list);
	sort($bulleted_array);
	return implode("\n", $bulleted_array);
}
?>