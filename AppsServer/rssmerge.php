<?php 

$is_debug = isset($_REQUEST['debug']);

if(!$is_debug)
{
	header("Content-Type: application/rss+xml");
	header('Content-Disposition: inline;Filename=' . urlencode($cat).".xml");
	echo('<?xml version="1.0" encoding="UTF-8"?>'); 
}

$protocol = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$url_here = $protocol . $_SERVER['HTTP_HOST'] .  htmlspecialchars($_SERVER['REQUEST_URI'], ENT_XML1); ;

$feeds = array("https://apps.wikitree.com/apps/straub620/catfeed.php?cat=German%20Confederation&depth=2&show_only=add",
"https://apps.wikitree.com/apps/straub620/catfeed.php?cat=Holy%20Roman%20Empire&depth=2&show_only=add",
"https://apps.wikitree.com/apps/straub620/catfeed.php?cat=German%20Empire&depth=2&show_only=add"

/*
todo: 
- show feeds in description
- get feeds from md5 file
- reduce number of posts in catfeed
*/
);
?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
  <atom:link href="<?php echo $url_here; ?>" rel="self" type="application/rss+xml" />
    <description></description>
    <language>en</language>
    <pubDate><?php echo(date("r")) ?></pubDate>
    <title>Merged feed</title>
    <!-- <link></link> -->
<?php
$posts = array();

foreach($feeds as $feed)
{
	$xml_all = file_get_contents($feed);
	$xml = new SimpleXMLElement($xml_all);
	$items = $xml->xpath('/rss/channel/item');
	foreach($items as $item)
	{
		$guid_already_there = false;
		$this_post_guid = ((string) $item->guid);
		foreach($posts as $post)
		{
			$a_post_guid = ((string) $post->guid);
			if($this_post_guid == $a_post_guid)
			{
				$guid_already_there = true;
				print_debug("guid $a_post_guid skipped, was in already");
				break;
			}
		}
		if(!$guid_already_there)
		{
			$posts[] = $item;
		}
	}
}

// var_dump($posts);

usort($posts, 
		function($one_post, $other_post) 
		{
			$one_date = (string)$one_post->pubDate;
			$other_date = (string)$other_post->pubDate;
			$one_time = (new DateTime($one_date))->getTimestamp();
			$other_time=  (new DateTime($other_date))->getTimestamp();
			// echo "$one_time <=> $other_time\n<br>";
			return $other_time <=> $one_time;
		}
);

foreach($posts as $post)
{
	echo $post->asXml();
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
