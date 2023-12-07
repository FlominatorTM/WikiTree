<?php
//turns replies to a particual g2g post into an RSS feed
$is_debug = isset($_REQUEST['debug']);
$num = $_REQUEST['num'] - 1 + 1;
if ($num < 1) {
	$num = 20;
}

if (!isset($_REQUEST['debug'])) {
	header("Content-Type: application/rss+xml");
	echo ('<?xml version="1.0" encoding="UTF-8"?>');
}
$news_url = "https://grabsteine.genealogy.net/last_20.php?lang=de";
$page = file_get_contents_utf8($news_url);

$protocol = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$url_here = $protocol . $_SERVER['HTTP_HOST'] .  htmlspecialchars($_SERVER['REQUEST_URI'], ENT_XML1);
?>

<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<atom:link href="<?php echo $url_here; ?>" rel="self" type="application/rss+xml" />
		<description>mit freundlicher Unterstützung von WikiTree</description>
		<language>de</language>
		<title>Neuigkeiten vom Grabsteinprojekt</title>
		<link><?php echo $news_url; ?></link>
		<pubDate><?php echo (date("r")) ?></pubDate>
		<?php

		$parts = explode('<a href="namelist.php?', $page);

		$end = min(count($parts), ($num + 1));
		for ($i = 1; $i < $end; $i++) {

			/*
			<tr>
				<td valign="top">D-01665</td>
				<td valign="top"><a href="namelist.php?cem=9078&amp;lang=de">Friedhof Röhrsdorf (Klipphausen, Meißen)</a></td>
				<td valign="top">04.12.2023</td>
			</tr>
				
			<tr>
				<td valign="top">D-01665</td>
				<td valign="top"><a href="namelist.php?cem=9079&amp;lang=de">Friedhof Weistropp (Klipphausen, Meißen)</a></td>
				<td valign="top">04.12.2023</td>
			</tr>
			*/

			$dateGerman = extract_from_to($parts[$i], '<td valign=top>', '</td>');
			$date_parts = explode(".", $dateGerman);
			$day = $date_parts[0];
			$month = replaceGermanMonth($date_parts[1]);
			$year = $date_parts[2];
			$timestamp = strtotime("$day $month $year");
			$now = time();
			$diff = $now - $timestamp;
			$oneDay = 60 * 60 * 24;

			if ($diff < $oneDay) {
				$timestamp = $now;
				//make today's new items, now's new items
			}

			$id = extract_from_to($parts[$i], 'cem=', '&');
			$cemetery =  extract_from_to($parts[$i], 'lang=de">', '</a>');
			$link = "https://grabsteine.genealogy.net/namelist.php?cem=$id";
			$guid = $link;

			$cemPage = file_get_contents_utf8($link);
			$people = extract_from_to($cemPage, "<p><b>", "</b>");
			$graves = extract_from_to($cemPage, "Personen auf <b>", "</b>");
			// $firstPicture = extract_from_to($cemPage, '<img src="./friedhoefe/', '" height');
			// $firstPictureLink = extract_from_to($cemPage, '<td align=center><a href="tomb.php?', '&lang=de">');
			// $firstPictureTitle = extract_from_to($cemPage, ' height=100><br>', "\n");

			$description = "$cemetery mit $people erfassten Personen auf $graves fotografierten Grabsteinen";

			echo "    <item>\n";
			echo "    	<title>" . html_entity_decode($description) . "</title>\n";
			echo "    	<link>$link</link>\n";
			echo "    	<guid isPermaLink='true'>$guid</guid>\n";
			echo "    	<description>" . htmlspecialchars($description) . "</description>\n";
			// if (strlen($firstPicture) > 3) {
			// 	echo "		<image>\n";
			// 	echo "		 <url>https://grabsteine.genealogy.net/friedhoefe/$firstPicture</url>\n";
			// 	echo "		 <title>$cemetery: $firstPictureTitle</title>\n";
			// 	echo "		 <link>https://grabsteine.genealogy.net/tomb.php?$firstPictureLink</link>\n";
			// 	echo "		</image>\n";
			// }
			echo "    	<pubDate>" . date("r", $timestamp) . "</pubDate>\n";
			echo "    </item>\n";
		}
		function replaceGermanMonth($month)
		{
			switch ($month) {
				case 1:
					return "January";
				case 2:
					return "February";
				case 3:
					return "March";
				case 4:
					return "April";
				case 5:
					return "May";
				case 6:
					return "June";
				case 7:
					return "July";
				case 8:
					return "August";
				case 9:
					return "September";
				case 10:
					return "October";
				case 11:
					return "November";
				case 12:
					return "December";
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

		function file_get_contents_utf8($fn)
		{
			$content = file_get_contents($fn);
			return mb_convert_encoding(
				$content,
				'UTF-8',
				mb_detect_encoding($content, 'UTF-8, ISO-8859-1', true)
			);
		}
		function print_debug($line)
		{
			global $is_debug;
			if ($is_debug) {
				echo $line . "<br>";
			}
		}

		?>
	</channel>
</rss>