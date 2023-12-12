<?php
//turns replies to a particual g2g post into an RSS feed
$is_debug = isset($_REQUEST['debug']);
$do_comments = isset($_REQUEST['comments']);
$max = $_REQUEST['max'] + 1 - 1;
$preview_redir = isset($_REQUEST['preview_redir']);
$answer = $_REQUEST['answer'];
if (!isset($max) || $max == 0) {
	$max = 10;
}

$post_url = $_REQUEST['post'];

if (!isset($post_url)) {
	die('usage ?post=[url to g2g post]&max=[num of posts to watch, default=10]&needles[string that are mandatory for entry to show up, separated by | character]');
}
if (substr($post_url, 0, 24) != "https://www.wikitree.com") {
	die("only g2g posts allowed");
}

if (!isset($_REQUEST['debug'])) {
	header("Content-Type: application/rss+xml");
	echo ('<?xml version="1.0" encoding="UTF-8"?>');
}

$needles = [];
if (isset($_REQUEST['needles'])) {
	$needles = explode('|', $_REQUEST['needles']);
}

$extract_link = isset($_REQUEST['extract_link']);

$question_page = file_get_contents($post_url . "?appId=Straub620_g2g2rss");
$num_answers = extract_from_to($question_page, '<span itemprop="answerCount">', '<');

$protocol = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$url_here = $protocol . $_SERVER['HTTP_HOST'] .  htmlspecialchars($_SERVER['REQUEST_URI'], ENT_XML1);
?>

<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<atom:link href="<?php echo $url_here; ?>" rel="self" type="application/rss+xml" />
		<description>Answers from the G2G post</description>
		<language>en</language>
		<title><?php echo extract_from_to($question_page, '<title>', "</title>"); ?></title>
		<link><?php echo $post_url; ?></link>
		<pubDate><?php echo (date("r")) ?></pubDate>
		<?php

		$offset = max(0, ($num_answers - $max));
		$first_answer_reached = false;
		$posted = 0;
		$items = array();

		$reply_separator = '<div class="qa-a-item-content qa-post-content">';

		if (!isset($answer)) {
			do {

				print_debug("in while");
				$url = "$post_url?start=$offset";

				$replies_page = file_get_contents($url);

				$footer = "<h2>\nRelated questions";
				$index_footer = strpos($replies_page, $footer);
				$replies_page = substr($replies_page, 0, $index_footer);

				$replies = explode($reply_separator, $replies_page);
				$num_in_array = count($replies);
				print_debug("num_in_array_" + $num_in_array);
				for ($i = $num_in_array - 1; $i > 0; $i--) {
					if (process_reply($replies, $i, $needles, $do_comments, $items)) {
						$posted++;
					}
				}
				$first_answer_reached = $offset == 0;
				$offset = max(0, $offset - 20);
			} while ($posted < $max && !$first_answer_reached);
		} else {
			$url = "$post_url?show=$answer";
			$replies_page = file_get_contents($url);
			$replies = explode($reply_separator, $replies_page);
			$num_in_array = count($replies);

			for ($i = $num_in_array - 1; $i > 0; $i--) {
				if (stristr($replies[$i], '<a name="' . $answer)) {
					process_reply($replies, $i, array(), true, $items);
				}
			}
		}
		krsort($items);
		foreach ($items as $key => $item) {
			echo $item;
		}

		function process_reply($replies, $i, $needles, $do_comments, &$items)
		{
			global $extract_link, $post_url, $preview_redir;

			print_debug("process_reply(replies=" . count($replies) . ", $i)");
			$needle_found = false;
			foreach ($needles as $needle) {
				print_debug("needle: $needle<br>");
				if (stristr($replies[$i], $needle)) {
					print_debug("needle in reply<br>");
					$needle_found = true;
					break;
				}
			}

			if (count($needles) > 0 && !$needle_found) {
				return false;
			}

			$answer_and_comments = explode('qa-c-list-item', $replies[$i]);
			$answer_user = "";
			$until = count($answer_and_comments);
			if (!$do_comments) {
				$until = 1;
			}
			for ($c = 0; $c < $until; $c++) {
				$is_comment = $c > 0;

				if (stristr($answer_and_comments[$c], "previous comments")) {
					continue;
				}

				$user =  extract_from_to($answer_and_comments[$c], 'qa-user-link">', "</A>");
				$title = "Answer by $user";
				$token_behind_answer = 'qa-a-item-meta';
				$token_before_post_id = "#a";
				if ($is_comment) {
					$token_behind_answer = 'qa-c-item-meta';
					$title = "Comment by $user about answer from $answer_user";
					$token_before_post_id = "#c";
				} else {
					$answer_user = $user;
				}
				$index_behind_answer = strpos($answer_and_comments[$c], $token_behind_answer);

				/*
				<span class="qa-c-item-meta">
				<a href="https://www.wikitree.com/g2g/1629844/create-categories-from-wikipedia-find-grave-using-wikitree&amp;a=1634331" class="qa-c-item-what" itemprop="url">commented</a>
				*/
				$anchor = extract_from_to(substr($answer_and_comments[$c], $index_behind_answer), $token_before_post_id, "\"");
				$text = extract_from_to($answer_and_comments[$c], '<div itemprop="text">', "</div>");

				$link = $post_url . '?show=' . $anchor . '#' . $anchor;
				$description = $text;
				$guid = $link;
				if ($extract_link) {
					$stripped_text = trim(strip_tags($text));
					$index_of_link = strpos($stripped_text, "http");
					if ($index_of_link > 0) {
						$title = trim(substr($stripped_text, 0, $index_of_link));
						$link = trim(substr($stripped_text, $index_of_link));
					} else {
						$title = $stripped_text;
						$link = "";
					}
				} else if ($preview_redir) {
					$link = "https://apps.wikitree.com/apps/straub620/g2gpeek.php" . htmlspecialchars("?post=$post_url&a=$anchor", ENT_XML1);
				}
				//Mon, 22 May 2023 14:35:21 +0000

				$date_raw = extract_from_to($answer_and_comments[$c], 'datetime="', "\"");
				$date = date_parse($date_raw);

				//will return local time, while the posted time is UTC!
				$timestamp = mktime($date['hour'], $date['minute'], $date['second'], $date['month'], $date['day'], $date['year']);

				$item = "";
				$item .= "    <item>\n";
				$item .= "    	<title>" . html_entity_decode($title) . "</title>\n";
				$item .= "    	<link>$link</link>\n";
				$item .= "    	<guid>$guid</guid>\n";
				// $item.= "    	<description><![CDATA[".$description."]]></description>\n";
				$item .= "    	<description>" . htmlspecialchars($description) . "</description>\n";
				$item .= "    	<pubDate>" . date("r", $timestamp) . "</pubDate>\n";
				$item .= "    </item>\n";
				$items[$timestamp] = $item;
			}
			return true;
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
				echo $line . "<br>";
			}
		}
		?>
	</channel>
</rss>