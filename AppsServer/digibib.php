<?php

$is_debug = isset($_REQUEST['debug']);
$num = $_REQUEST['num'] - 1;
if ($num < 1) {
	$num = 50;
}

$protocol = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$url_here = $protocol . $_SERVER['HTTP_HOST'] .  htmlspecialchars($_SERVER['REQUEST_URI'], ENT_XML1);;

if (!$is_debug) {
	header("Content-Type: application/rss+xml");
	header('Content-Disposition: inline;Filename=' . "digibib" . ".xml");
	echo ('<?xml version="1.0" encoding="UTF-8"?>');
}
?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<atom:link href="<?php echo $url_here; ?>" rel="self" type="application/rss+xml" />
		<description></description>
		<language>de</language>
		<pubDate><?php echo (date("r")) ?></pubDate>
		<title>CompGen DigiBib-Neuzugänge</title>
		<link>https://www.digibib.genealogy.net</link>
		<?php
		$posts = array();

		$feed = "https://www.digibib.genealogy.net/viewer/api/v1/records/rss?query=&sortField=DATECREATED&sortDescending=true";
		$xml_all = str_replace("<dc:creator />", "", file_get_contents($feed));
		$xml = new SimpleXMLElement($xml_all);
		$items = $xml->xpath('/rss/channel/item');
		$nouns = "";

		foreach ($items as $item) {

			#remove duplicate titles
			$titleParts = explode(';', $item->title);
			if (count($titleParts) == 2 & trim($titleParts[0]) == trim($titleParts[1])) {
				$item->title = $titleParts[0];
			}

			#collect nouns
			$words = explode(" ", $item->title);
			foreach ($words as $word) {
				$word = str_replace([",", ";"], "", $word);
				if (
					ctype_upper($word[0])
					&& !stristr($nouns, $word)
					&& !stristr($word, "Einwohner")
					&& !stristr($word, "Adres")
					&& !stristr($word, "Adreß")
					&& !stristr($word, "Telefon")
					&& !stristr($word, "Fernsprech")
					&& !stristr($word, "Gemeinde")
					&& !stristr($word, "Kreis")
					&& $word != "Oder"
				) {
					$nouns .= $word . "|";
				}
			}

			#add year if not present
			// _YYYY/
			preg_match('/_\d{4}\//', $item->link, $yearParts);
			if (count($yearParts) == 1) {
				$year = substr($yearParts[0], 1, 4);
				if (!stristr($item->title, $year)) {
					$item->title .= " " .  $year;
				}
			}

			$posts[] = $item;
			if (count($posts) > $num) {
				break;
			}
		}
		$options  = array('https' => array('user_agent' => 'Flominator querying for DigiBib'));
		$context = stream_context_create($options);
		$request_url = "https://de.wikipedia.org/w/api.php?action=query&prop=coordinates&colimit=500&format=xml&redirects&titles=" . urlencode($nouns);
		print_debug($request_url);
		$response = file_get_contents($request_url, false, $context);
		$xml = new SimpleXMLElement($response);
		$pages = $xml->xpath('/api/query/pages/page');
		$places = ["Glücksburg"]; //additional title words to hashtag
		foreach ($pages as $page) {
			if (isset($page->coordinates)) {
				$places[] = $page['title'];
			}
		}

		foreach ($posts as $post) {

			foreach ($places as $place) {
				#replace first occurrence 
				$post->title = preg_replace("/$place\b/", "#$place", $post->title, 1);
			}
			$post->title = preg_replace("/Frankfurt an der Oder\b/", "#FrankfurtOder", $post->title, 1);

			$outputPost = preg_replace("/<dc\:(.*)>\n/", "", $post->asXml());
			echo $outputPost;
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