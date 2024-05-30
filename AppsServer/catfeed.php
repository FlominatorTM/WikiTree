<?php
$is_debug = isset($_REQUEST['debug']);
$cat = str_replace('Category:', '', $_REQUEST['cat']);

$show_only = "";
if (isset($_REQUEST['show_only'])) {
	$show_only = $_REQUEST['show_only'];
}
$depth = 9;
if (isset($_REQUEST['depth']) && $_REQUEST['depth'] != "") {
	$depth = 0 + $_REQUEST['depth'];
}

$limit = 5;
if (isset($_REQUEST['limit']) && $_REQUEST['limit'] != "") {
	$limit = 0 + $_REQUEST['limit'];
}

$cats_only = false;
if (isset($_REQUEST['cats_only']) && $_REQUEST['cats_only'] != "") {
	$cats_only = true;
}
$display = "";
if (isset($_REQUEST['display'])) {
	$display = $_REQUEST['display'];
}

if ($display != "") {
	show_days_changes($display);
} else {
	$use_discord_link_style = isset($_REQUEST['discord']);

	if (!$is_debug) {
		header("Content-Type: application/rss+xml");
		header('Content-Disposition: inline;Filename=' . urlencode($cat) . ".xml");
		echo ('<?xml version="1.0" encoding="UTF-8"?>');
	}
	print_debug("debugging enabled");

	$protocol = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
	$url_here = $protocol . $_SERVER['HTTP_HOST'] .  htmlspecialchars($_SERVER['REQUEST_URI'], ENT_XML1);

	if (!check_has_any_data($cat, $depth)) {
		get_current_content($cat, $depth, $cats_only);
	} else if (has_new_data_available($cat, $depth)) {
		// echo "new data";
		$file_time_before = filemtime(current_file($cat, $depth));
		$prev_filling = get_previous_content($cat, $depth);
		get_current_content($cat, $depth, $cats_only);
		compare_and_dump_contents($cat, $depth, $prev_filling, $file_time_before);
	}
?>
	<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
		<channel>
			<atom:link href="<?php echo $url_here; ?>" rel="self" type="application/rss+xml" />
			<description></description>
			<language>en</language>
			<pubDate><?php echo (date("r", filemtime(current_file($cat, $depth)))) ?></pubDate>
			<title><?php echo headline($show_only) . " Category:" . $cat ?></title>
			<link><?php echo "https://www.wikitree.com/wiki/Category:" . str_replace(' ', '_', $cat) ?></link>
		<?php


		build_feed($cat, $depth, $limit, $show_only);
		echo "</channel></rss>";
	}

	function headline($show_only)
	{
		switch ($show_only) {
			case "add": {
					return "Additions to";
				}
			case "rem": {
					return "Removals from";
				}
			default: {
					return "Changes in";
				}
		}
	}


	function show_days_changes($date_file_name_part)
	{
		global $cat, $show_only, $depth;
		$cat_dir =  cat_dir($cat, $depth);
		$file_almost_path = $cat_dir . $date_file_name_part;

		$files = scandir($cat_dir, SCANDIR_SORT_ASCENDING);

		$prev_file = "";
		$next_file = "";
		$the_one_found = false;

		for ($i = 0; $i < count($files); $i++) {
			if (stristr($files[$i], '+')) {
				// echo $files[$i] . "<br>";
				if (stristr($files[$i], $date_file_name_part)) {
					if ($i >= 2 && $files[$i - 2] != ".") {
						$prev_file = str_replace("+.csv", "", $files[$i - 2]);
					}
					if (!stristr($files[$i + 2], "current")) {
						$next_file = str_replace("+.csv", "", $files[$i + 2]);
					}
					break;
				}
			}
		}



		$summary_add = "";
		$summary_rem = "";
		$html_add = "";
		$html_rem = "";

		if ($show_only != "rem") {
			$csv = $file_almost_path . "+.csv";
			$additions = file_get_contents($csv);
			if (strlen($additions) > 2) {
				$csv_lines = explode("\n", $additions);
				$summary_add = "Additions: " . get_summary($csv_lines);
				$html_add = get_section(($csv_lines));
			}
		}
		if ($show_only != "add") {
			$csv = $file_almost_path . "-.csv";
			$removals = file_get_contents($csv);
			if (strlen($removals) > 2) {
				$csv_lines = explode("\n", $removals);
				$summary_rem = "Removals: " . get_summary($csv_lines);
				$html_rem = get_section(($csv_lines));
			}
		}

		header('Content-Type: text/html; charset=utf-8');
		echo "<html>";
		echo " <head>";
		echo '  <meta property="og:description" content="' .  $summary_add . $summary_rem . '">';
		echo '  <meta property="og:title" content="' .  headline($show_only)  . ' Category:' . $cat . '">';
		echo '  <title>catfeed ' . $cat  . '</title>';
		echo " </head>";
		echo " <body>";
		echo "  <h1>";
		echo headline($show_only);
		echo ' <a href="https://www.wikitree.com/wiki/Category:' . urlencode(str_replace(' ', '_', $cat)) . '">Category:' . $cat . '</a>';
		echo "  </h1>";

		if ($prev_file != "") {
			echo "<< <a href=\"?cat=$cat&depth=$depth&show_only=$show_only&display=$prev_file\">$prev_file</a>";
		}
		echo " << <b>$date_file_name_part</b> >> ";
		if ($next_file != "") {
			echo "<a href=\"?cat=$cat&depth=$depth&show_only=$show_only&display=$next_file\">$next_file</a> >>";
		}
		if ($show_only != "rem" && $html_add != "") {
			if ($show_only == "") {
				echo "  <h2>Additions</h2>";
			}
			echo $html_add;
		}

		if ($show_only != "add" && $html_rem != "") {
			if ($show_only == "") {
				echo "  <h2>Removals</h2>";
			}
			echo $html_rem;
		}
		echo " </body>";
		echo "</html>";
	}

	function get_summary($rows)
	{
		global $cats_only;
		$summ = "";

		foreach ($rows as $row) {
			if ($cats_only) {
				$summ .= "Category:" . str_replace("_", " ", $row) . ", ";
			} else {
				$cols = explode(';', $row);

				$summ .= $cols[3] . " (" . $cols[1] . ") ";
			}
		}

		if ($cats_only) {
			$summ = substr($summ, 0, strlen($summ) - strlen(", "));
		}
		return $summ;
	}

	function get_section($rows)
	{
		global $cats_only;
		$wt = "https://www.wikitree.com/wiki/";
		$html = "";

		$i = 1;
		foreach ($rows as $row) {
			$cols = explode(';', $row);
			if ($cats_only) {

				$html .= '<h3>' . $i . '. <a href="' . $wt . "Category:" . $cols[0] . '">' . $cols[0] . "</a>\n";
			} else {

				$html .= '<h3>' . $i . '. <a href="' . $wt . $cols[1] . '">' . $cols[3] . "</a> (" . $cols[1] . ")\n";
				$html .= '<a href="https://www.wikitree.com/index.php?title=Special:EditPerson&u=' . $cols[1 - 1] . '">[edit]</a> ';
				$html .= '<a href="https://www.wikitree.com/index.php?title=Special:NetworkFeed&who=' . $cols[2 - 1] . '">[history]</a></h3>';

				$categories_profile = explode('|', str_replace('"', '', $cols[19 - 1]));
				$birth_date = $cols[5 - 1];
				$birth_place = $cols[7 - 1];
				$death_date = $cols[12 - 1];
				$death_place = $cols[14 - 1];

				$html .= "born " . $birth_date . " in " . $birth_place . "<br>";
				$html .= "died " . $death_date . " in " . $death_place . "<br>";
				$html .= '<ul>';
				// $html.=$cols[18];
				foreach ($categories_profile as $cat_profile) {
					$html .= '<li><a href="' . $wt . 'Category:' .  $cat_profile . '">' . $cat_profile . "</a></li>\n";
				}

				$html .= '</ul>';
			}
			$i++;
		}

		return $html;
	}


	function escape_cat($cat)
	{
		return str_replace(' ', '_', urldecode($cat));
	}

	function cat_dir($cat, $depth)
	{
		global $cats_only;
		$dir = "/sftp/straub620/www/catdata/" . escape_cat($cat);

		print_debug("depth=$depth");
		if ($depth != 9 && $depth != "9") {
			$dir = $dir . '_' . $depth;
		}

		if ($cats_only) {
			$dir = $dir . '_';
		}

		if (!is_dir($dir)) {
			mkdir($dir, 0777);
		}
		return  $dir . "/";
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

	function get_current_content($cat, $depth, $cats_only)
	{
		print_debug("entering get_current_content");
		$current_file = current_file($cat, $depth);

		$lines = [];
		if ($cats_only) {
			$lines = get_categories_in_category($cat, $depth);
		} else {
			$lines = get_profiles_in_category($cat, $depth);
		}

		if (count($lines) == 0) {
			return;
		}
		file_put_contents($current_file, implode("\n", $lines));
		chmod($current_file, 0777);
		$date_file = date_file($cat, $depth);

		file_put_contents($date_file, get_wiki_tree_plus_date());
		chmod($date_file, 0777);
	}

	function get_categories_in_category($cat, $depth)
	{
		$lines = [];
		$url = "https://plus.wikitree.com/function/WTCatNavigate/Catfeed.htm?Category=" . urlencode($cat) . "&Levels=$depth&format=json&Include0=&Exclude0=&Include1=&Exclude1=&Include2=&Exclude2=&Details=";
		$response = file_get_contents($url);

		$json = json_decode(($response));
		get_cat_children($json->response, $lines);
		// var_dump($lines);
		return $lines;
	}

	function get_cat_children($node, &$lines)
	{
		print_debug("<br>entering get_cat_children<br>");
		// var_dump($node->children);
		foreach ($node->children as $child) {
			$lines[] = $child->name;
			if (isset($child->children)) {
				get_cat_children($child, $lines);
			}
		}
		return;
	}
	function get_profiles_in_category($cat, $depth)
	{

		$url = "https://plus.wikitree.com/function/WTWebProfileSearch/Flo_CatFeed.csv?Query=subcat$depth=\"" . urlencode($cat) . "\"&MaxProfiles=15000&Format=CSV";
		// echo $url."<br>";
		$csv_page = file_get_contents($url);



		$arbitrary_byte_number = 100;
		if (strlen($csv_page) < $arbitrary_byte_number) {
			print_debug("csv_page is shorter than " + $arbitrary_byte_number + " bytes");
			return;
		}

		print_debug("length csv_page=" . strlen($csv_page));

		$lines = [];
		$csv_lines = explode("\n", $csv_page);
		$i = -1;
		foreach ($csv_lines as $csv_line) {
			if (!stristr($csv_line, "User ID")) {
				$line_parts = explode(";", $csv_line);
				if (is_numeric($line_parts[0])) {
					$i++;
					$lines[$i] = trim($csv_line);
				} else {
					$lines[$i] .= "|" . trim($csv_line);
				}
			}
		}
		return $lines;
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


		if ($plus_cat_date == "" || $list_date == "") {
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
		if (count($additions) > 0 || count($removals) > 0) {
			file_put_contents($dir . $list_date . "+.csv", implode("\n", $additions));
			file_put_contents($dir . $list_date . "-.csv", implode("\n", $removals));
		} else {
			touch($current_file, $file_time_before);
		}
	}

	function get_missing_rows($old, $new_rows)
	{
		global $cats_only;
		$additions = array();

		foreach ($new_rows as $new_row) {
			$row_parts = explode(";", $new_row); {
				if (($cats_only || is_numeric($row_parts[0]))
					&& !stristr($old, $row_parts[0])
				) {
					$additions[] = $new_row;
					//todo: do something with line_wraps
				}
			}
		}
		return $additions;
	}

	function build_feed($cat, $depth, $limit, $show_only)
	{
		global $url_here;
		// echo "building";
		$dir = cat_dir($cat, $depth);

		$files = scandir($dir, SCANDIR_SORT_ASCENDING);

		if (count($files) == 4) //only . .. date.txt and current.txt
		{
			$current_file_time = filemtime(current_file($cat, $depth));
			echo "    <item>\n";
			echo "    	<title>Tracking of content started for $cat</title>\n";
			// echo "    	<link>$link</link>\n";
			echo "    	<guid>https://www.wikitree.com/wiki/Category:" . urlencode(str_replace(' ', '_', $cat)) . '#' . "$current_file_time</guid>\n";
			echo "    	<description>No changes so far, please be patient for a few days</description>\n";
			echo "    	<pubDate>" . date("r", $current_file_time) . "</pubDate>\n";
			echo "    </item>\n";
		} else {
			$num_posts = 0;
			for ($i = count($files) - 1; $i >= 0; $i--) {
				if (stristr($files[$i], '-.csv')) {
					$path = $dir . $files[$i];
					$current_file_time = filemtime($path);
					$removals = file_get_contents($path);
					$add_file = str_replace('-.csv', '+.csv', $path);
					$additions = file_get_contents($add_file);

					if ($num_posts >= $limit) {
						break;
					}

					switch ($show_only) {
						case "add": {
								print_debug('strlen($additions)=' . strlen($additions));
								if (strlen($additions) > 1) {
									echo "    <item>\n";
									echo "    	<title>Additions to $cat</title>\n";
									break;
								} else {
									continue 2;
								}
							}
						case "rem": {
								if (strlen($removals) > 1) {
									echo "    <item>\n";
									echo "    	<title>Removals from $cat</title>\n";
									break;
								} else {
									continue 2;
								}
							}
						default: {
								if (strlen($removals) > 1 || strlen($additions) > 1) {
									echo "    <item>\n";
									echo "    	<title>Changes to $cat</title>\n";
									break;
								} else {
									continue 2;
								}
							}
					}

					$display_escaped = htmlspecialchars("&display=" . str_replace("-.csv", "", $files[$i]), ENT_XML1);
					$link = $url_here . $display_escaped;
					echo "    	<guid>$link</guid>\n";
					echo "    	<link>$link</link>\n";
					echo "    	<description><![CDATA[";


					if ($show_only != "rem") {
						if ($show_only != "add") {
							echo "Additions:\n";
						}
						// print_debug("additions:" . $additions);
						print_profile_lines(explode("\n", $additions));
					}
					if ($show_only != "add") {
						if ($show_only != "rem") {
							echo "Removals:\n";
						}
						// print_debug("removals:" . $removals);
						print_profile_lines(explode("\n", $removals));
					}
					echo "		]]></description>\n";
					echo "    	<pubDate>" . date("r", $current_file_time) . "</pubDate>\n";
					echo "    </item>\n";
					$num_posts++;
				}
			}
		}
	}

	function print_profile_lines($rows)
	{
		global $use_discord_link_style, $cats_only;
		echo "<ol>";
		foreach ($rows as $row) {
			// print_debug("row: $row");
			if (strlen($row) > 1) {
				$cols = explode(';', $row);
				if ($cats_only) {
					$cols[3] = $cols[0];
					$cols[1] = "Category:" . $cols[0];
				}
				if ($use_discord_link_style) {
					echo '<li>' . $cols[3] . ': <https://www.wikitree.com/wiki/' . $cols[1] . '></li>';
				} else {
					echo '<li><a href="https://www.wikitree.com/wiki/' . $cols[1] . '">' . $cols[3] . '</a>: https://www.wikitree.com/wiki/' . $cols[1] . '</li>';
				}
			}
		}
		echo "</ol>";
	}

	function print_debug($line)
	{
		global $is_debug;
		if ($is_debug) {
			echo $line . "<br>";
		}
	}
		?>