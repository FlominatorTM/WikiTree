<?php
	//turns replies to a particual g2g post into an RSS feed
	$max = $_REQUEST['max'] +1 -1;
	if(!isset($max) || $max==0)
	{
		$max=10;
	}
	
	$post_url = $_REQUEST['post'];
	
	if(!isset($post_url))
	{
		die ('usage ?post=[url to g2g post]&max=[num of posts to watch, default=10]&needles[string that are mandatory for entry to show up, separated by | character]');
	}
	if(substr($post_url, 0, 24) != "https://www.wikitree.com")
	{
		die("only g2g posts allowed");
	}
	
	if(!isset($_REQUEST['debug']))
	{
		header("Content-Type: application/rss+xml");
		echo('<?xml version="1.0" encoding="UTF-8"?>'); 
	}
	
	$needles = [];
	if(isset($_REQUEST['needles']))
	{
		$needles = explode('|', $_REQUEST['needles']);
	}
 
	$extract_link = isset($_REQUEST['extract_link']) ;
	
	$question_page = file_get_contents($post_url);
	$num_answers = extract_from_to($question_page, '<span itemprop="answerCount">', '<');

	$protocol = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
	$url_here = $protocol . $_SERVER['HTTP_HOST'] . $_SERVER['SCRIPT_NAME'] ;
?>

<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
  <atom:link href="<?php echo $url_here; ?>" rel="self" type="application/rss+xml" />
    <description>Answers from the G2G post</description>
    <language>en</language>
    <pubDate><?php echo(date("r")); ?></pubDate>
    <title><?php echo extract_from_to($question_page, '<title>', "</title>"); ?></title>
    <link><?php echo $post_url; ?></link>
<?php	
	
	$offset = max(0, ($num_answers - $max));
	$at_beginning = false;
	$posted = 0;
	do
	{
		$url = "$post_url?start=$offset";

		$replies_page = file_get_contents($url);
		$reply_separator = '<div class="qa-a-item-content qa-post-content">';
		
		$replies = explode($reply_separator, $replies_page);
		$num_in_array = count($replies);
		
		for($i=$num_in_array-1;$i>0;$i--)
		{
			if(process_reply($replies, $i, $url, $needles))
			{
				$posted++;
			}
		}
		$at_beginning = $offset == 0;
		$offset = max(0, $offset - 20);
	}while($posted < $max && !$at_beginning);
	
	
	function process_reply($replies, $i, $url, $needles)
	{
		global $needles, $extract_link;
		$needle_found = false;
		foreach($needles as $needle)
		{
			if(stristr($replies[$i], $needle))
			{
				$needle_found = true;
				break;
			}
		}
		
		if(isset($_REQUEST['needles']) && !$needle_found)
		{
			return false;
		}

		$user =  extract_from_to($replies[$i], 'qa-user-link">', "</A>");
		$title = "Answer by $user";
		$anchor = extract_from_to($replies[$i], '#', "\"");
		$text = extract_from_to($replies[$i], '<div itemprop="text">', "</div>");
		$link = $url . '#' . $anchor;
		$description = $text;
		$guid = $link;
		if($extract_link)
		{
			$index_of_link = strpos($text, "<a href=");
			$title = extract_from_to($text, ">", "<");
			$link = "http" . extract_from_to($text, "http", "\"");
			$description = "";
		}
		//Mon, 22 May 2023 14:35:21 +0000

		$date_raw = extract_from_to($replies[$i], 'datetime="', "\"");
		$date = date_parse($date_raw);
		
		$timestamp = mktime($date['hour'], $date['minute'], $date['second'], $date['month'], $date['day'], $date['year']);
	
		echo "    <item>\n";
		echo "    	<title>$title</title>\n";
		echo "    	<link>$link</link>\n";
		echo "    	<guid>$guid</guid>\n";
		echo "    	<description><![CDATA[".$text."]]></description>\n";
		echo "    	<pubDate>" . date("r", $timestamp) . "</pubDate>\n";
		echo "    </item>\n";
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
?>
  </channel>
</rss>