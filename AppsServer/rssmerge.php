<?php

$is_debug = isset($_REQUEST['debug']);

$protocol = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$url_here = $protocol . $_SERVER['HTTP_HOST'] .  htmlspecialchars($_SERVER['REQUEST_URI'], ENT_XML1);;

$config = urldecode($_REQUEST['config']);
$feeds = get_feed_urls($config);

if (!$is_debug) {
	header("Content-Type: application/rss+xml");
	header('Content-Disposition: inline;Filename=' . urlencode($config) . ".xml");
	echo ('<?xml version="1.0" encoding="UTF-8"?>');
}
?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<atom:link href="<?php echo $url_here; ?>" rel="self" type="application/rss+xml" />
		<description>
			<![CDATA[These feeds have been merged:<?php
													foreach ($feeds as $feed) {
														// echo "<a href=\"$feed\">$feed</a><br>";
														echo html_entity_decode($feed) . " \n";
													}
													?>]]>
		</description>
		<language>en</language>
		<pubDate><?php echo (date("r")) ?></pubDate>
		<title><?php echo strip_tags($config);  ?> (merged feed)</title>
		<!-- <link></link> -->
		<?php
		$posts = array();

		foreach ($feeds as $feed) {
			$xml_all = file_get_contents($feed);


			if (strlen($xml_all) == 0) {
				print_debug("$feed has length zero");
				continue;
			}

			$xml = new SimpleXMLElement($xml_all);
			$items = $xml->xpath('/rss/channel/item');
			foreach ($items as $item) {
				$guid_already_there = false;
				//cut off the topic part from G2G feeds in order to prevent duplicate posts after renaming
				if (stristr($item->link, "https://www.wikitree.com/g2g/") && !stristr($item->link, "?")) {
					$parts = explode("/", $item->link);
					$item->link = "https://www.wikitree.com/g2g/" . $parts[4];
					$item->guid = "https://www.wikitree.com/g2g/" . $parts[4];
				}
				$this_post_guid = ((string) $item->guid);
				foreach ($posts as $post) {
					$a_post_guid = ((string) $post->guid);
					if ($this_post_guid == $a_post_guid) {
						$guid_already_there = true;
						print_debug("guid $a_post_guid skipped, was in already");
						break;
					}
				}
				if (!$guid_already_there) {
					$posts[] = $item;
				}
			}
		}

		// var_dump($posts);

		usort(
			$posts,
			function ($one_post, $other_post) {
				$one_date = (string)$one_post->pubDate;
				$other_date = (string)$other_post->pubDate;
				$one_time = (new DateTime($one_date))->getTimestamp();
				$other_time =  (new DateTime($other_date))->getTimestamp();
				// echo "$one_time <=> $other_time\n<br>";
				return $other_time <=> $one_time;
			}
		);

		foreach ($posts as $post) {
			echo $post->asXml();
		}

		function get_feed_urls($label)
		{
			$filename = getcwd() . "/merge_config/" . $label . ".txt";
			if (file_exists($filename)) {
				$content = trim(str_replace("\r\n", "\n", file_get_contents($filename)));
				return explode("\n", $content);
			} else {
				return array();
			}
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