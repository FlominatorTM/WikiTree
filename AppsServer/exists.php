<?php

//via https://stackoverflow.com/questions/24221560/php-check-download-link-without-downloading-the-file
//proxy to avoid CORS restrictions in WBE und BEE

// Set a test URL.
$url = "https://www.wikitree.com/wiki/" . urlencode(str_replace(" ", "_", urldecode($_REQUEST['page']))) . "?appID=" . $_REQUEST['appId'];

// Set the stream_context_create options.
$opts = array(
    'http' => array(
        'method' => 'HEAD'
    )
);

// Create context stream with stream_context_create.
$context = stream_context_create($opts);

// Use fopen with rb (read binary) set and the context set above.
$handle = fopen($url, 'rb', false, $context);

// Get the headers with stream_get_meta_data.
$headers = stream_get_meta_data($handle);

// Close the fopen handle.
fclose($handle);


// Use a regex to see if the response code is 200.
preg_match('/\b200\b/', $headers['wrapper_data'][0], $matches);


// Act on whether the matches are empty or not.
if (empty($matches)) {
    header('X-PHP-Response-Code: 404', true, 404);
    echo 'The download link is offline';
} else {
    header('X-PHP-Response-Code: 200', true, 200);
    echo 'The download link is online!';
}

// Dump the array of headers for debugging.
echo '
<pre>';
print_r($headers);
echo '</pre>';
