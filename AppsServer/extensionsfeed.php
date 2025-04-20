<?php
//shows browser extensions releases
$is_debug = isset($_REQUEST['debug']);

if (!isset($_REQUEST['debug'])) {
	header("Content-Type: application/rss+xml");
	// header('sContent-Disposition: inline;Filename=WikiTreeExtensionsFeed.rss');
	echo ('<?xml version="1.0" encoding="UTF-8"?>');
}

$protocol = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$url_here = $protocol . $_SERVER['HTTP_HOST'] .  htmlspecialchars($_SERVER['REQUEST_URI'], ENT_XML1);
?>

<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<atom:link href="<?php echo $url_here; ?>" rel="self" type="application/rss+xml" />
		<description>mit freundlicher Unterstützung von WikiTree</description>
		<language>en</language>
		<title>Browser extension updates</title>
		<link>https://www.wikitree.com/wiki/Project:WikiTree_Apps</link>
		<pubDate><?php echo (date("r")) ?></pubDate>
		<?php

		$posts = [];
		$firefox = 0;
		$posts[] = write_firefox_ext("https://addons.mozilla.org/en-US/firefox/addon/wikitree-browser-extension/", "WikiTree Browser Extension", "https://www.wikitree.com/wiki/Space:WikiTree_Browser_Extension_Update");
		$posts[] = write_chrome_ext("https://chromewebstore.google.com/detail/wikitree-browser-extensio/ncjafpiokcjepnnlmgdaphkkjehapbln", "WikiTree Browser Extension", "https://www.wikitree.com/wiki/Space:WikiTree_Browser_Extension_Update");
		copy_changes_from_firefox($posts, $firefox, count($posts) - 1);
		$posts[] = write_safari_ext("https://apps.apple.com/ca/app/wikitree-browser-extension/id6447643999", "WikiTree Browser Extension", "https://www.wikitree.com/wiki/Space:WikiTree_Browser_Extension_Update");
		copy_changes_from_firefox($posts, $firefox, count($posts) - 1);

		$firefox = count($posts);
		$posts[] = write_firefox_ext("https://addons.mozilla.org/en-US/firefox/addon/wt-browser-extension-test/", "WikiTree Browser Extension Preview", "https://www.wikitree.com/wiki/Space:WikiTree_Browser_Extension_Update");
		$posts[] = write_chrome_ext("https://chromewebstore.google.com/detail/wikitree-browser-extensio/ijipjpbjobecdgkkjdfpemcidfdmnkid", "WikiTree Browser Extension Preview", "https://www.wikitree.com/wiki/Space:WikiTree_Browser_Extension_Update");
		copy_changes_from_firefox($posts, $firefox, count($posts) - 1);

		$firefox = count($posts);
		$posts[] = write_firefox_ext("https://addons.mozilla.org/en-GB/firefox/addon/wikitree-bee/", "WikiTree BEE", "https://www.wikitree.com/wiki/Space:WikiTree_BEE_Update");
		$posts[] = write_chrome_ext("https://chromewebstore.google.com/detail/wikitree-browser-extensio/bldfdpnmijncfmaokfjgdmcjdhafihoh", "WikiTree BEE", "https://www.wikitree.com/wiki/Space:WikiTree_BEE_Update");
		copy_changes_from_firefox($posts, $firefox, count($posts) - 1);

		$firefox = count($posts);
		$posts[] = write_firefox_ext("https://addons.mozilla.org/en-GB/firefox/addon/wikitree-bee-preview/", "WikiTree BEE Preview", "https://www.wikitree.com/wiki/Space:WikiTree_BEE_%28Preview%29_Update");
		$posts[] = write_chrome_ext("https://chromewebstore.google.com/detail/wikitree-browser-extensio/hckhlflohlkolfmhlncgonocmkdkopfa", "WikiTree BEE Preview", "https://www.wikitree.com/wiki/Space:WikiTree_BEE_%28Preview%29_Update");
		copy_changes_from_firefox($posts, $firefox, count($posts) - 1);

		$firefox = count($posts);
		$posts[] = write_firefox_ext("https://addons.mozilla.org/en-US/firefox/addon/wikitree-sourcer/", "WikiTree Sourcer", "https://www.wikitree.com/wiki/Space:WikiTree_Sourcer_Release_Notes");
		$posts[] = write_chrome_ext("https://chrome.google.com/webstore/detail/wikitree-sourcer/jaokbnmpdigpgfjckhgpdacpcokipoha", "WikiTree Sourcer", "https://www.wikitree.com/wiki/Space:WikiTree_Sourcer_Release_Notes");
		copy_changes_from_firefox($posts, $firefox, count($posts) - 1);
		$posts[] = write_safari_ext("https://apps.apple.com/us/app/wikitree-sourcer/id1590224647", "WikiTree Sourcer", "https://www.wikitree.com/wiki/Space:WikiTree_Sourcer_Release_Notes");
		copy_changes_from_firefox($posts, $firefox, count($posts) - 1);



		usort($posts, function ($a, $b) {
			return $b['timestamp'] - $a['timestamp'];
		});


		$already_posted_feed = "";
		if (isset($_REQUEST['check_url'])) {
			$already_posted_feed = file_get_contents($_REQUEST['check_url']);
		}


		foreach ($posts as $post) {
			if (!stristr($already_posted_feed, $post['link'])) {
				$title =  $post['title'];
				if (strlen($post['changes']) > 1) {
					$title .= " - " . $post['changes'];
				}
				echo "    <item>\n";
				echo "    	<title>" . html_entity_decode($title) . "</title>\n";
				echo "    	<link>" . $post['link'] . "</link>\n";
				echo "    	<guid isPermaLink='false'>" . $post['guid'] . "</guid>\n";
				echo "    	<description>" . htmlspecialchars($title) . "</description>\n";
				echo "    	<pubDate>" . date("r", $post['timestamp']) . "</pubDate>\n";
				echo "    </item>\n";
			}
		}

		function copy_changes_from_firefox(&$posts, $id_firefox,  $id_this)
		{
			print_debug("Version this:"  . $posts[$id_this]['version']);
			print_debug("Version FF:"  . $posts[$id_firefox]['version']);
			print_debug("Changes FF:"  . $posts[$id_firefox]['changes']);
			print_debug("ID FF:"  . $id_firefox);
			print_debug("ID this:"  . $id_this);
			if ($posts[$id_this]['version'] == $posts[$id_firefox]['version']) {
				$posts[$id_this]['changes'] = $posts[$id_firefox]['changes'];
			}
		}

		function write_firefox_ext($url, $name, $changelog)
		{
			$page = file_get_contents($url);
			$update_date = extract_from_to($page, '"last_updated":"', '"');
			$timestamp = date("U", strtotime($update_date));
			$version = extract_from_to($page, '"version":"', '"');
			$release_notes = json_decode(extract_from_to($page, '"releaseNotes":', ',"version'));


			$post['version'] = $version;
			$post['timestamp'] = make_today_now($timestamp);
			$post['title'] = "$name released in version $version for Firefox";
			if (strlen($release_notes) > 1 && $name != "WikiTree Sourcer") {
				// $post['changes'] =  strtolower($release_notes[0]) . substr($release_notes, 1);
				$post['changes'] =  $release_notes;
			}
			$post['link'] = "$changelog#$timestamp";
			$post['guid'] = $name . $update_date . $version;
			return $post;
		}

		function write_chrome_ext($url, $name, $changelog)
		{
			$page = file_get_contents($url);
			$version = extract_from_to($page, '"],null,null,"', '"');
			$timestamp = extract_from_to($page, $version . '",[', ",");
			$post['timestamp'] = make_today_now($timestamp);
			$post['title'] = "$name released in version $version for Chrome";
			$post['link'] = "$changelog#$timestamp";
			$post['guid'] = $name . $timestamp . $version;
			$post['version'] = $version;
			return $post;
		}

		function write_safari_ext($url, $name, $changelog)
		{
			$page = file_get_contents($url);
			// $version = extract_from_to($page, '"+15053737726"],null,null,"', '"');
			$version = extract_from_to($page, 'whats-new__latest__version">Version ', '</p');
			$update_date = extract_from_to($page, 'data-test-we-datetime datetime="',  '"');
			$timestamp = date("U", strtotime($update_date));
			$post['version'] = $version;
			$post['timestamp'] = make_today_now($timestamp);
			$post['title'] = "$name released in version $version for Safari";
			$post['link'] = "$changelog#$timestamp";
			$post['guid'] = $name . $timestamp . $version;
			return $post;
		}

		function make_today_now($timestamp)
		{
			if (isset($_REQUEST['today_now'])) {
				$now = time();
				$diff = $now - $timestamp;
				$oneDay = 60 * 60 * 24;

				if ($diff < $oneDay) {
					$timestamp = $now;
					//make today's new items, now's new items
				}
			}
			return $timestamp;
		}

		function extract_from_to($haystack, $prefix, $suffix)
		{
			$index_prefix = strpos($haystack, $prefix) + strlen($prefix);
			$index_suffix = strpos($haystack, $suffix, $index_prefix);
			$length = $index_suffix - $index_prefix;
			// echo "$length = $index_suffix - $index_prefix<br>";
			return substr($haystack, $index_prefix, $length);
		}
		function print_debug($line)
		{
			global $is_debug;
			if ($is_debug) {
				echo $line . "\n<br>";
			}
		}
		?>
	</channel>
</rss>