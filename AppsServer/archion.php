<?php
//turns replies to a particual g2g post into an RSS feed
$is_debug = isset($_REQUEST['debug']);

if (!isset($_REQUEST['debug'])) {
	header("Content-Type: application/rss+xml");
	echo ('<?xml version="1.0" encoding="UTF-8"?>');
}
$news_url = "https://www.archion.de/de/archion-entdecken/alle-news/neue-digitalisate";
$page = file_get_contents($news_url);

$protocol = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$url_here = $protocol . $_SERVER['HTTP_HOST'] .  htmlspecialchars($_SERVER['REQUEST_URI'], ENT_XML1);
?>

<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<atom:link href="<?php echo $url_here; ?>" rel="self" type="application/rss+xml" />
		<description>mit freundlicher Unterstützung von WikiTree</description>
		<language>de</language>
		<title>Neuigkeiten von Archion</title>
		<link><?php echo $news_url; ?></link>
		<pubDate><?php echo (date("r")) ?></pubDate>
		<?php

		$parts = explode('<div class="new-digitized mb-mega2">', $page);

		for ($i = 1; $i < count($parts); $i++) {

			/*  <h2>16. November 2023</h2>
      <hr class="highlight-headline fullwidth">

      
        <div class="items ">
          <h3>Landeskirchliches Archiv der Evangelisch-Lutherischen Kirche in Bayern (100)</h3>
          <a class="btn btn-link" href="/de/alle-archive/bayern/landeskirchliches-archiv-der-evangelisch-lutherischen-kirche-in-bayern">Zum Archiv</a>

          
            <p class="digitized-breadcrumb mb-4">
              
                <a href="/de/alle-archive/bayern/landeskirchliches-archiv-der-evangelisch-lutherischen-kirche-in-bayern/dekanat-fuerth">Dekanat Fürth</a> /
              
                <a href="/de/alle-archive/bayern/landeskirchliches-archiv-der-evangelisch-lutherischen-kirche-in-bayern/dekanat-fuerth/zirndorf">Zirndorf</a> /
              
              <a href="https://www.archion.de/de/viewer/churchRegister/356067?cHash=9b83b2daa4879cd0919f74a647609a96">Alphabetisches Register zu Bestattungen 1901 - 1947</a>
            </p>
          
            <p class="digitized-breadcrumb mb-4">
              
                <a href="/de/alle-archive/bayern/landeskirchliches-archiv-der-evangelisch-lutherischen-kirche-in-bayern/dekanat-fuerth">Dekanat Fürth</a> /
              */


			$dateGerman = extract_from_to($parts[$i], '<h2>', '</h2>');
			$date_parts = explode(" ", $dateGerman);
			$day = $date_parts[0];
			$month = replaceGermanMonth($date_parts[1]);
			$year = $date_parts[2];
			$timestamp = strtotime("$day $month $year");

			$archiveParts = explode('<h3>', $parts[$i]);
			for ($j = 1; $j < count($archiveParts); $j++) {

				// $link = $host . extract_from_to($parts[$i], '<a href="', '">');
				$archive = substr($archiveParts[$j], 0, strpos($archiveParts[$j], '</h3>'));

				$booksParts = explode('<p class="digitized-breadcrumb mb-4">', $archiveParts[$j]);

				$guid = extract_from_to($booksParts[1], 'https://www.archion.de/de/viewer/churchRegister', '">');
				$description = $archive . ': ';
				for ($k = 1; $k < count($booksParts); $k++) {
					$oneBookParts = explode('/', strip_tags('<p>' . $booksParts[$k]));
					$aboveParish = trim($oneBookParts[0]);
					$parish = trim($oneBookParts[1]);
					if (!stristr($description, $aboveParish)) {
						if ($k > 1) {
							$description = $description . "\n";
							$description = substr($description, 0, strlen($description) - 3) . '; ';
						}
						//todo: remove ,
						$description = $description .  $aboveParish . ': ';
					}
					if (!stristr($description, $parish)) {
						$description = $description . $parish . ', ';
					}
				}
				$description = substr($description, 0, strlen($description) - strlen(', '));

				echo "    <item>\n";
				echo "    	<title>" . html_entity_decode($description) . "</title>\n";
				echo "    	<link>$news_url</link>\n";
				echo "    	<guid isPermaLink='false'>$guid</guid>\n";
				echo "    	<description>" . htmlspecialchars($description) . "</description>\n";
				echo "    	<pubDate>" . date("r", $timestamp) . "</pubDate>\n";
				echo "    </item>\n";
			}
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