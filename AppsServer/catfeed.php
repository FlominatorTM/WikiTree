<?php 
$is_debug = isset($_REQUEST['debug']);
$cat = str_replace('Category:', '', $_REQUEST['cat']);
$show_only = $_REQUEST['show_only'];

$use_discord_link_style = isset($_REQUEST['discord']);

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

$depth = 9;
if (isset($_REQUEST['depth']) && $_REQUEST['depth'] != "")
{
	$depth = 0 + $_REQUEST['depth'];
}


if(!check_has_any_data($cat, $depth))
{
	get_current_content($cat, $depth);
}
else if(has_new_data_available($cat, $depth))
{
	// echo "new data";
	$file_time_before = filemtime(current_file($cat, $depth));
	$prev_filling = get_previous_content($cat, $depth);
	get_current_content($cat, $depth);
	compare_and_dump_contents($cat, $depth, $prev_filling, $file_time_before);
}


?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
  <atom:link href="<?php echo $url_here; ?>" rel="self" type="application/rss+xml" />
    <description></description>
    <language>en</language>
    <pubDate><?php echo(date("r", filemtime(current_file($cat, $depth)))) ?></pubDate>
    <title><? 
	switch($show_only)
	{
		case "add":
		{
			echo "Additions to";
			break;
		}
		case "rem":
		{
			echo "Removals from";
			break;
		}
		default: 
		{
			echo "Changes in";
			break;
		}
	}?> Category:<?php echo $cat; ?></title>
    <link><?php echo "https://www.wikitree.com/wiki/Category:" . str_replace(' ', '_', $cat) ?></link>
<?php	


build_feed($cat, $depth, $limit, $show_only);

function escape_cat($cat)
{
	return str_replace(' ', '_', urldecode($cat));
}

function cat_dir($cat, $depth)
{
	$dir = "/sftp/straub620/www/catdata/" . escape_cat($cat);
	
	print_debug("depth=$depth");
	if($depth != 9 && $depth != "9")
	{
		$dir = $dir . '_' . $depth;
	}
	
	if(!is_dir($dir))
	{
		mkdir ($dir, 0777);
	}
	return  $dir."/";
}

function current_file($cat, $depth)
{
	return cat_dir($cat, $depth) . "current.txt";
}

function date_file($cat, $depth)
{
	return cat_dir($cat, $depth) . "date.txt";
}

function check_has_any_data($cat, $depth)
{
	return is_file(current_file($cat, $depth));
}

function get_current_content($cat, $depth)
{
	print_debug("entering get_current_content");
	$url = "https://plus.wikitree.com/function/WTWebProfileSearch/Flo_CatFeed.csv?Query=subcat$depth=\"". urlencode($cat)."\"&MaxProfiles=15000&Format=CSV";
	// echo $url."<br>";
	$csv_page = file_get_contents($url);
	$current_file = current_file($cat, $depth);
	
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
	$date_file = date_file($cat, $depth);
	
	file_put_contents($date_file, get_wiki_tree_plus_date());
	chmod($date_file, 0777);
}

function get_wiki_tree_plus_date()
{
	$page = "https://plus.wikitree.com/DataDates.json";
	$json = json_decode(file_get_contents($page));
	return $json->categoriesDate;
}

function has_new_data_available($cat, $depth)
{
	print_debug("entering has_new_data_available($cat, $depth)");
	$plus_cat_date = get_wiki_tree_plus_date();
	$list_date = file_get_contents(date_file($cat, $depth));
	

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

function get_previous_content($cat, $depth)
{
	return file_get_contents(current_file($cat, $depth));
}

function compare_and_dump_contents($cat, $depth, $old, $file_time_before)
{
	$current_file = current_file($cat, $depth);
	$new = file_get_contents($current_file);
	
	print_debug("length current_file content=" . strlen($new));
	print_debug("previous file content=" . strlen($old));
	
	$new_rows = explode("\n", $new);
	$old_rows = explode("\n", $old);
	$additions = get_missing_rows($old, $new_rows);
	$removals = get_missing_rows($new, $old_rows);
	$list_date = file_get_contents(date_file($cat, $depth));
	
	$dir = cat_dir($cat, $depth);
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

function build_feed($cat, $depth, $limit, $show_only)
{
	// echo "building";
	$dir = cat_dir($cat, $depth);
	
	$files = scandir($dir, SCANDIR_SORT_ASCENDING);
	
	if(count($files)==4) //only . .. date.txt and current.txt
	{
		$current_file_time = filemtime(current_file($cat, $depth));
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
		for($i=count($files)-1;$i>=0;$i--)
		{
			if(stristr($files[$i], '-.csv'))
			{
				$path = $dir . $files[$i];
				$current_file_time = filemtime($path);
				$removals = file_get_contents($path);
				$add_file = str_replace('-.csv', '+.csv', $path);
				$additions = file_get_contents($add_file);
				
				
				switch($show_only)
				{
					case "add":
					{
						print_debug('strlen($additions)=' . strlen($additions));
						if(strlen($additions)>1)
						{
							echo "    <item>\n";
							echo "    	<title>Additions to $cat</title>\n";
							break;							
						}
						else
						{
							continue 2;
						}
					}
					case "rem":
					{
						if(strlen($removals)>1)
						{
							echo "    <item>\n";
							echo "    	<title>Removals from $cat</title>\n";
							break;							
						}
						else
						{
							continue 2;
						}
					}
					default: 
					{
						if(strlen($removals)>1 || strlen($additions)>1)
						{
							echo "    <item>\n";
							echo "    	<title>Changes to $cat</title>\n";
							break;
						}
						else
						{
							continue 2;
						}
					}
				}
				
				// echo "    	<link>$link</link>\n";
				echo "    	<guid>https://www.wikitree.com/wiki/Category:" . urlencode(str_replace(' ', '_', $cat)) . '#' . "$current_file_time</guid>\n";
				echo "    	<description><![CDATA[";

				
				if($show_only != "rem")
				{
					if($show_only != "add")
					{
						echo "Additions:\n";
					}
					// print_debug("additions:" . $additions);
					print_profile_lines(explode("\n", $additions));
				}
				if($show_only != "add")
				{
					if($show_only != "rem")
					{
						echo "Removals:\n";
					}
					// print_debug("removals:" . $removals);
					print_profile_lines(explode("\n", $removals));
				}
				echo "		]]></description>\n";
				echo "    	<pubDate>" . date("r", $current_file_time) . "</pubDate>\n";
				echo "    </item>\n";
			}
		}
	}
}

function print_profile_lines($rows)
{
	global $use_discord_link_style;
	echo "<ol>";
	foreach($rows as $row)
	{
		// print_debug("row: $row");
		if(strlen($row)>1)
		{
			$cols = explode(';', $row);
			if($use_discord_link_style)
			{
				echo '<li>' . $cols[3] . ': <https://www.wikitree.com/wiki/' . $cols[1] . '></li>';
			}
			else
			{
				echo '<li><a href="https://www.wikitree.com/wiki/' . $cols[1] .'">' . $cols[3] . '</a>: https://www.wikitree.com/wiki/' . $cols[1] . '</li>';
			}
		}
	}
	echo "</ol>";
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
