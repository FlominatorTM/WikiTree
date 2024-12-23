<html>
<?php
$inc_dir = "matriculix_lang";
$user_lang = read_language();
get_language('en', $inc_dir); //not translated messages will be printed in English
get_language($user_lang, $inc_dir);
?>

<head>
    <title>Matriculix</title>
</head>

<body>
    <h1>Matriculix</h1>
    <?php echo $messages['purpose'] ?><br><br>
    <form>
        <?php echo $messages['check_link'] ?> <input name="old" size="120">
        <input type="submit" value="<?php echo $messages['go'] ?>">
    </form>

    <?php

    // [4]=> string(11) "deutschland" 
    define("COUNTRY", 4);
    // [5]=> string(10) "osnabrueck"
    define("DIOCESE", "5");
    // [6]=> string(19) "osnabruck-st-johann" 
    define("PARISH", 6);
    // [7]=> string(4) "0054" 
    define("BOOK", 7);
    // [8]=> string(6) "?pg=36" 
    define("PAGE", 8);

    define("PAGE_PARAM", "?pg=");

    $is_debug = isset($_REQUEST['debug']);
    $csv = "matriculix.csv";

    if (isset($_REQUEST["new"]) && isset($_REQUEST["old"])) {
        if (stristr($_REQUEST["old"], PAGE_PARAM) && stristr($_REQUEST["new"], PAGE_PARAM)) {
            $csv_content = file_get_contents($csv);
            if (!stristr($csv_content, $_REQUEST["old"])) {
                $line = $_REQUEST["old"] . ';' . $_REQUEST["new"] . "\n";
                file_put_contents($csv, $line, FILE_APPEND);
                echo str_replace("__LINK__", $_REQUEST["new"], $messages['link_added']);
            } else {
                echo $messages['link_known'] . "<br>\n";
            }
        } else {
            echo $messages['link_wrong'] . "<br>\n";
        }
    } else if (isset($_REQUEST['old'])) {
        $old = $_REQUEST['old'];

        echo "<h2>" . $messages['results'] . "</h2>\n";

        @$old_exists = file_get_contents($old);

        if (!$old_exists) {
            echo $messages['link_broken'] . "<br/><br>\n";

            $link_parts = explode("/", $old);


            $csv_content = file_get_contents($csv);
            $csv_lines = explode("\n", $csv_content);
            $csv_line_with_parish = "";
            $csv_lines_with_book = [];
            foreach ($csv_lines as $line) {

                $parts_line = explode(";", $line);

                $csv_old = explode("/", trim($parts_line[0]));
                $csv_new = explode("/", trim($parts_line[1]));
                if ($csv_old[COUNTRY] == $link_parts[COUNTRY]) {
                    print_debug("Country found");
                    if ($csv_old[DIOCESE] == $link_parts[DIOCESE]) {
                        print_debug("Diocese found");
                        // echo "old: " . $csv_old[PARISH] . "  link: " . $link_parts[PARISH] . "<br>\n";
                        if ($csv_old[PARISH] == $link_parts[PARISH]) {
                            $csv_line_with_parish = $line;
                            print_debug("Parish found");

                            if ($csv_old[BOOK] == $link_parts[BOOK]) {
                                $csv_lines_with_book[] = $line;
                                print_debug("Book found");
                            }
                        }
                    }
                }
            }

            $link_parts_new = array_merge([], $link_parts);

            if (count($csv_lines_with_book) > 0) {
                foreach ($csv_lines_with_book as $csv_line_with_book) {
                    print_debug("Building book link with offset");
                    $csv_line_parts = explode(";", $csv_line_with_book);
                    $csv_old = explode("/", trim($csv_line_parts[0]));
                    $csv_new = explode("/", trim($csv_line_parts[1]));
                    $page_old_complete = $csv_old[PAGE];
                    $page_new_complete = $csv_new[PAGE];
                    $page_old_int = substr($page_old_complete, strlen(PAGE_PARAM));
                    $page_new_int = substr($page_new_complete, strlen(PAGE_PARAM));
                    $offset = $page_new_int - $page_old_int;
                    print_debug("offset:" . $offset);
                    $page_curr_int = substr($link_parts[PAGE], strlen(PAGE_PARAM));
                    $diff_old_and_csv = abs($page_old_int - $page_curr_int);
                    $link_parts_new[PAGE] = PAGE_PARAM . ($page_curr_int + $offset);
                    $link_parts_new[BOOK] = $csv_new[BOOK];
                    $link_parts_new[PARISH] = $csv_new[PARISH];
                    $book_link = join("/", $link_parts_new);
                    echo '<a href="' . $book_link . '">' . $messages['potential_book'] . ":" . "</a><br>\n";
                    echo $messages['distance_page'] . ": " . $diff_old_and_csv . "<br>\n";

                    /*
                    $book_page = file_get_contents($book_link);
                    $book_page_parts = explode("<tr><th>", $book_page);

                    for ($i = 1; $i < count($book_page_parts); $i++) {
                        $book_detail_key_value = explode("</table>", $book_page_parts[$i])[0];
                        $book_detail = explode("</th><td>", $book_detail_key_value)[1];
                        //$book_detail = str_replace("</th><td>", "\n", $book_detail);
                        if (strlen($book_detail) > 0) {
                            echo strip_tags($book_detail) . "<br>";
                        }
                    }*/
                    echo "<br>\n";
                }
                add_new_link($old,  $messages['feel_free'] . ":");
            } else if ($csv_line_with_parish != "") {
                print_debug("Building parish link");
                $csv_line_parts = explode(";", $csv_line_with_parish);
                $csv_new = explode("/", trim($csv_line_parts[1]));
                $link_parts_new = array_slice($link_parts_new, 0, PARISH);
                $link_parts_new[PARISH] = $csv_new[PARISH];
                echo str_replace("__LINK__", join("/", $link_parts_new), $messages['parish_no_book']) . "<br>\n";
                add_new_link($old, $messages['please_consider'] . ":");
            } else {

                echo $messages['no_book_or_parish'] . "<br>\n";
                $diocese_link_parts = array_slice($link_parts, 0, PARISH);
                $dio_link = join("/", $diocese_link_parts);
                $diocese_page = file_get_contents($dio_link);
                $needle = 'list-group-item-action" href="';
                $dio_page_parts = explode($needle, $diocese_page);
                $content_parts = array_slice($dio_page_parts, 1);

                $old_parish_parts = explode("-", $link_parts[PARISH]);

                foreach ($content_parts as $parish_link_part) {
                    /*
                     string(378) "/de/deutschland/osnabrueck/altenberge-haren-st-bonifatius/">
                        <span class="fa fa-map-marker-alt">&nbsp;</span>
                        <span class="badge badge-secondary float-right"></span>Altenberge (Haren) St. Bonifatius</a>
                    
                
                    
                    <a class="list-group-item list-group-item-info "
                    */
                    // var_dump($parish_link_part);
                    $slash_parts = explode("/", $parish_link_part);
                    $new_parish_parts = explode("-", $slash_parts[4]);

                    $found_parts = 0;
                    for ($o = 0; $o < count($old_parish_parts); $o++) {
                        for ($n = 0; $n < count($new_parish_parts); $n++) {
                            if ($old_parish_parts[$o] == $new_parish_parts[$n]) {
                                $found_parts++;
                            }
                        }
                    }

                    if ($found_parts >= count($old_parish_parts)) {
                        $quote_parts = explode('"', $parish_link_part);
                        $parish_link = join("/", [$link_parts[0], $link_parts[1], $link_parts[2], $quote_parts[0]]);

                        echo '<a href="' . $parish_link . '">' . $parish_link . "</a><br>\n";
                        //echo $slash_parts[4] . " has " . $found_parts . " matches<br>\n";
                    }
                }

                //guess parish
                add_new_link($old, $messages['please_consider'] . ":");
            }
        } else {
            echo $messages['link_ok'];
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


    function add_new_link($old, $msg)
    {
        global $messages;
        echo "<br> $msg";
        echo "<form>\n";
        echo $messages['old_link'] . " <input name=\"old\" value=\"$old\" size=\"120\"><br>\n";
        echo $messages['new_link'] . " <input name=\"new\" size=\"120\"><br>\n";
        echo "<input type=\"submit\" value=\"" . $messages['submit_fixed'] . "\">\n";
        echo "</form>\n";
    }

    function print_debug($line)
    {
        global $is_debug;
        if ($is_debug) {
            echo $line . "<br>\n";
        }
    }


    function get_language_list($inc_dir)
    {
        $dir_ref = opendir($inc_dir);
        rewinddir($dir_ref);
        $list = array();

        do {
            $file = readdir($dir_ref); //get next file of inc directory
            clearstatcache();

            if ((substr($file, 0, 1) != ".") && (!is_dir($inc_dir . "/" . $file)) && ($file != "")) //current file is really a file and no directory
            {
                if ((stristr($file, '.php')) && (!stristr($file, 'qqq'))) //file is really a language file (qqq comes from translatewiki)
                {
                    $list[] = str_replace('.php', '', $file); //add language of file to the list
                }
            }
        } while ($file);

        sort($list);
        closedir($dir_ref);
        return $list;
    }

    function get_language($lang, $inc_dir)
    {
        global $messages;
        if (strlen($lang) > 9) //3 was too small because of be-tarask
        {
            $lang = 'en';
        }
        $langfile = "$inc_dir/$lang.php";

        if (!@include($langfile)) {
            //echo "Using default language: english";
            include("$inc_dir/en.php");
        }
    }

    //tries to retrieve the language of the browser
    function read_language()
    {

        $user_lang = isset($_REQUEST['user_lang']) ? $_REQUEST['user_lang'] : "";

        if ($user_lang == "") {
            //https://www.php-resource.de/forum/php-developer-forum/22545-unterschiede-zwischen-versch-browsern-bei-http_accept_language.html
            preg_match("/^([a-z]+)-?([^,;]*)/i", $_SERVER["HTTP_ACCEPT_LANGUAGE"], $matches);

            $user_lang = $matches[1];
            //echo $_SERVER['HTTP_ACCEPT_LANGUAGE'];
            if ($user_lang == "") {
                $user_lang = 'en';
            }
            if ($matches[1] == 'zh') {
                switch (strtolower($matches[2])) {
                    case "tw":
                    case "hk": {
                            $user_lang = "zh-hant";
                            break;
                        }
                    default: {
                            $user_lang = "zh-hans";
                            break;
                        }
                }
            }
        }
        return $user_lang;
    }
    ?>
</body>

</html>