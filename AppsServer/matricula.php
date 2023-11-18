<?php
//turns replies to a particual g2g post into an RSS feed
$is_debug = isset($_REQUEST['debug']);

if (!isset($_REQUEST['debug'])) {
	header("Content-Type: application/rss+xml");
	echo ('<?xml version="1.0" encoding="UTF-8"?>');
}
$news_url = "https://data.matricula-online.eu/de/nachrichten/";
$page = file_get_contents($news_url);

$protocol = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$url_here = $protocol . $_SERVER['HTTP_HOST'] .  htmlspecialchars($_SERVER['REQUEST_URI'], ENT_XML1);
?>

<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<atom:link href="<?php echo $url_here; ?>" rel="self" type="application/rss+xml" />
		<description>mit freundlicher Unterstützung von WikiTree</description>
		<language>de</language>
		<title>Neuigkeiten von Matricula</title>
		<link><?php echo $news_url; ?></link>
		<pubDate><?php echo (date("r")) ?></pubDate>
		<?php

		$parts = explode("<h3>", $page);
		$host = "https://data.matricula-online.eu/";


		for ($i = 1; $i < count($parts); $i++) {

			/*	<a href="/de/nachrichten/bistum_regensburg-pfarreien_ergaenzt_20/">Bistum Regensburg: Pfarreien ergänzt</a><br><small>13. November 2023</small></h3>
    			<p class="text-justify">
        		<p>Die Kirchenbücher der Pfarreien Schmidmühlen, Schnaittenbach, Schönach und Schönsee sind nun zugänglich.</p>
    			</p>
				</div>*/
			$link = $host . extract_from_to($parts[$i], '<a href="', '">');
			$title =  extract_from_to($parts[$i], '">', '</a>');
			$dateGerman = extract_from_to($parts[$i], '<small>', '</small>');
			$description = trim(strip_tags(extract_from_to($parts[$i], '<p>', '</div>')));

			$date_parts = explode(" ", $dateGerman);
			$day = $date_parts[0];
			$month = replaceGermanMonth($date_parts[1]);
			$year = $date_parts[2];

			$timestamp = strtotime("$day $month $year");

			echo "    <item>\n";
			echo "    	<title>" . html_entity_decode($description) . "</title>\n";
			echo "    	<link>$link</link>\n";
			echo "    	<guid>$link</guid>\n";
			echo "    	<description>" . htmlspecialchars($title) . "</description>\n";
			echo "    	<pubDate>" . date("r", $timestamp) . "</pubDate>\n";
			echo "    </item>\n";
		}

		function replaceGermanMonth($month)
		{
			switch ($month) {
				case 'Januar':
					return "January";
					break;
				case 'Februar':
					return "February";
					break;
				case "März":
					return "March";
					break;
				case "April":
					return "April";
					break;
				case "Mai":
					return "May";
					break;
				case "Juni":
					return "June";
					break;
				case "Juli":
					return "July";
					break;
				case "August":
					return "August";
					break;
				case "September":
					return "September";
					break;
				case "Oktober":
					return "October";
					break;
				case "November":
					return "November";
					break;
				case "Dezember":
					return "December";
					break;
				default:
					break;
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
		?>
	</channel>
</rss>