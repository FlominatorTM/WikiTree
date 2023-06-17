<?php 
$cat = str_replace('Category:', '', $_REQUEST['cat']);
// $cat = "Hesse, Needs Birth Record";

$is_debug = isset($_REQUEST['debug']);

if(!$is_debug)
{
	header("Content-Type: application/rss+xml");
	header('Content-Disposition: inline;Filename=' . urlencode($cat).".xml");
	echo('<?xml version="1.0" encoding="UTF-8"?>'); 
}
print_debug("debugging enabled");

$limit = 10; //currently does nothing
$protocol = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$url_here = $protocol . $_SERVER['HTTP_HOST'] .  htmlspecialchars($_SERVER['REQUEST_URI'], ENT_XML1); ;

if(!check_has_any_data($cat))
{
	get_current_content($cat);
}
else if(has_new_data_available($cat))
{
	// echo "new data";
	$file_time_before = filemtime(current_file($cat));
	$prev_filling = get_previous_content($cat);
	get_current_content($cat);
	compare_and_dump_contents($cat, $prev_filling, $file_time_before);
}


?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
  <atom:link href="<?php echo $url_here; ?>" rel="self" type="application/rss+xml" />
    <description></description>
    <language>en</language>
    <pubDate><?php echo(date("r", filemtime(current_file($cat)))) ?></pubDate>
    <title>Changes to Category:<?php echo $cat; ?></title>
    <link><?php echo "https://www.wikitree.com/wiki/Category:" . str_replace(' ', '_', $cat) ?></link>
<?php	


build_feed($cat, $limit);

function escape_cat($cat)
{
	return str_replace(' ', '_', urldecode($cat));
}

function cat_dir($cat)
{
	
	$dir = "/sftp/straub620/www/catdata/" . escape_cat($cat);
	
	if(!is_dir($dir))
	{
		mkdir ($dir, 0777);
	}
	return  $dir."/";
}

function current_file($cat)
{
	return cat_dir($cat) . "/current.txt";
}

function date_file($cat)
{
	return cat_dir($cat) . "/date.txt";
}

function check_has_any_data($cat)
{
	return is_file(current_file($cat));
}

function get_current_content($cat)
{
	print_debug("entering get_current_content");
	$url = "https://plus.wikitree.com/function/WTWebProfileSearch/Flo_CatFeed.csv?Query=subcat9=\"". urlencode($cat)."\"&MaxProfiles=1500&Format=CSV";
	// echo $url."<br>";
	$csv_page = file_get_contents($url);
	$current_file = current_file($cat);
	
	$arbitrary_byte_number = 100;
	if(strlen($csv_page)< $arbitrary_byte_number)
	{
		print_debug("csv_page is shorter than " + $arbitrary_byte_number + " bytes");
		return;
	}
	
	print_debug("length csv_page=" . strlen($csv_page));
	
	$lines = [];
	$csv_lines = explode("\n", $csv_page);
	$i=-1;
	foreach($csv_lines as $csv_line)
	{
		if(!stristr($csv_line, "User ID"))
		{
			$line_parts = explode(";", $csv_line);
			if(is_numeric($line_parts[0]))
			{
				$i++;
				$lines[$i] = trim($csv_line);
			}
			else
			{
				$lines[$i].="|" . trim($csv_line);
			}
		}
	}
	
	file_put_contents($current_file, implode("\n", $lines));
	chmod($current_file, 0777);
	$date_file = date_file($cat);
	
	file_put_contents($date_file, get_wiki_tree_plus_date());
	chmod($date_file, 0777);
}

function get_wiki_tree_plus_date()
{
	$page = "https://plus.wikitree.com/DataDates.json";
	$json = json_decode(file_get_contents($page));
	return $json->categoriesDate;
}

function has_new_data_available($cat)
{
	print_debug("entering has_new_data_available($cat)");
	$plus_cat_date = get_wiki_tree_plus_date();
	$list_date = file_get_contents(date_file($cat));
	

	print_debug("plus_cat_date=$plus_cat_date");
	print_debug("list_date=$list_date");
	
		
	if ($plus_cat_date == "" || $list_date == "")
	{
		print_debug("returning because of empty date");
		return false;
	}
	//list_date has to be older, so difference can mean only "new data"
	$lists_differ = $plus_cat_date != $list_date;
	print_debug("lists_differ=$lists_differ");
		
	return  $lists_differ;
}

function get_previous_content($cat)
{
	return file_get_contents(current_file($cat));
}

function compare_and_dump_contents($cat, $old, $file_time_before)
{
	$current_file = current_file($cat);
	$new = file_get_contents($current_file);
	
	print_debug("length current_file content=" . strlen($new));
	print_debug("previous file content=" . strlen($old));
	
	$new_rows = explode("\n", $new);
	$old_rows = explode("\n", $old);
	$additions = get_missing_rows($old, $new_rows);
	$removals = get_missing_rows($new, $old_rows);
	$list_date = file_get_contents(date_file($cat));
	
	$dir = cat_dir($cat);
	if(count($additions) > 0 || count($removals) > 0)
	{
		file_put_contents($dir . $list_date . "+.csv", implode("\n", $additions));
		file_put_contents($dir . $list_date . "-.csv", implode("\n", $removals));
	}
	else
	{
		touch($current_file, $file_time_before);
	}
}

function get_missing_rows($old, $new_rows)
{
	$additions = array();
	
	foreach($new_rows as $new_row)
	{
		$row_parts = explode(";", $new_row);
		{
			if(is_numeric($row_parts[0]) && !stristr($old, $row_parts[0]))
			{
				$additions[] = $new_row;
				//todo: do something with line_wraps
			}
		}
	}
	return $additions;
}

function build_feed($cat, $limit)
{
	// echo "building";
	$dir = cat_dir($cat);
	
	$files = scandir($dir, SCANDIR_SORT_ASCENDING);
	
	if(count($files)==4) //only . .. date.txt and current.txt
	{
		$current_file_time = filemtime(current_file($cat));
		echo "    <item>\n";
		echo "    	<title>Tracking of content started</title>\n";
		// echo "    	<link>$link</link>\n";
		echo "    	<guid>https://www.wikitree.com/wiki/Category:" . urlencode(str_replace(' ', '_', $cat)) . '#' . "$current_file_time</guid>\n";
		echo "    	<description>No changes so far, please be patient for a few days</description>\n";
		echo "    	<pubDate>" . date("r", $current_file_time) . "</pubDate>\n";
		echo "    </item>\n";
	}
	else
	{
		for($i=0;$i<count($files);$i++)
		{
			if(stristr($files[$i], '-.csv'))
			{
				$path = $dir . $files[$i];
				$current_file_time = filemtime($path);
				echo "    <item>\n";
				echo "    	<title>Category changes</title>\n";
				// echo "    	<link>$link</link>\n";
				echo "    	<guid>https://www.wikitree.com/wiki/Category:" . urlencode(str_replace(' ', '_', $cat)) . '#' . "$current_file_time</guid>\n";
				echo "    	<description><![CDATA[";
				$removals = file_get_contents($path);
				$add_file = str_replace('-.csv', '+.csv', $path);
				$additions = file_get_contents($add_file);
				
				echo "Additions:\n";
				// print_debug("additions:" . $additions);
				print_profile_lines(explode("\n", $additions));
				
				echo "Removals:\n";
				// print_debug("removals:" . $removals);
				print_profile_lines(explode("\n", $removals));
				echo "		]]></description>\n";
				echo "    	<pubDate>" . date("r", $current_file_time) . "</pubDate>\n";
				echo "    </item>\n";
			}
		}
	}
}

function print_profile_lines($rows)
{
	echo "<ul>";
	foreach($rows as $row)
	{
		// print_debug("row: $row");
		if(strlen($row)>1)
		{
			$cols = explode(';', $row);
			echo "<li>$cols[3]: https://www.wikitree.com/wiki/$cols[1]</li>";
		}
	}
	echo "</ul>";
}

function print_debug($line)
{
	global $is_debug;
	if($is_debug)
	{
		echo $line . "<br>";
	}
}

?></channel>
</rss>
