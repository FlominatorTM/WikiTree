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
$news_url = "https://ofb.genealogy.net/newest.php?lang=de";
$page = file_get_contents_utf8($news_url);

$protocol = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$url_here = $protocol . $_SERVER['HTTP_HOST'] .  htmlspecialchars($_SERVER['REQUEST_URI'], ENT_XML1);
?>

<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<atom:link href="<?php echo $url_here; ?>" rel="self" type="application/rss+xml" />
		<description>mit freundlicher Unterstützung von WikiTree</description>
		<language>de</language>
		<title>Neuigkeiten von den Ortsfamilienbüchern</title>
		<link><?php echo $news_url; ?></link>
		<pubDate><?php echo (date("r")) ?></pubDate>
		<?php

		$list = extract_from_to($page, '<tr><td colspan=3><hr></td></tr>', '</tbody>');
		$parts = explode('<tr>', $list);
		$end = min(count($parts), ($num + 1));
		for ($i = 1; $i < $end; $i++) {

			// var_dump($parts[$i]);
			/* often single quotes or none
			<tr>
				<td><a href="./bornum">Bornum (Wolfenbüttel)</a></td>
				<td align="right">2.545&nbsp;&nbsp;</td>
				<td align="right">06.12.2023&nbsp;&nbsp;</td>
			</tr>
			
			<tr>
				<td><a href="./pless">Pless (Pszczyna)</a></td>
				<td align="right">2.615&nbsp;&nbsp;</td>
				<td align="right">02.12.2023&nbsp;&nbsp;</td>
			</tr>
			*/

			$cells = explode("</td>", $parts[$i]);

			$dateGerman = extract_from_to($cells[2], '<td align=right>', '&nbsp;');
			$date_parts = explode(".", $dateGerman);
			$day = $date_parts[0];
			$month = replaceGermanMonth($date_parts[1]);
			$year = $date_parts[2];
			$timestamp = strtotime("$day $month $year");
			$now = time();
			$diff = $now - $timestamp;
			$oneDay = 60 * 60 * 24 * 2; /* TODO: REMOVE AFTER ONE DAY */

			if ($diff < $oneDay) {
				$timestamp = $now;
				//make today's new items, now's new items
			}

			$people = extract_from_to($cells[1], 'right>', '&nbsp;');
			$folder = extract_from_to($cells[0], "<a href='", "'>");
			$place = extract_from_to($cells[0], '">', '</a>');

			$link = "https://ofb.genealogy.net/" . substr($folder, 2);
			$guid = $link;

			$ofbPage = file_get_contents_utf8($link);
			/*<a href="mailto:gerhard.prange@t-online.de" class="verweis">Gerhard Prange</a>*/
			$mailPart = extract_from_to($ofbPage, 'mailto:', '</a>');
			$beginningName = strpos($mailPart, ">") + strlen(">");
			$title = trim(extract_from_to($ofbPage, "<h2>", "</h2>"));
			// print_debug("title=$title");
			$description = "$title mit $people Personen";
			if (stristr($mailPart, "@")) {
				$author = substr($mailPart, $beginningName);
				$description = "$title von $author mit $people Personen";
			}




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