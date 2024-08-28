<html>
<title>WikiTree search backend</title>

<body onload="document.getElementById('wpSearch').click()">
    <form action="https://www.wikitree.com/wiki/Special:SearchPerson" method="POST" id="theForm">
        <input type="text" name="wpFirst" id="wpFirst" size="35" value=" <?php echo $_REQUEST["first_name"] ?>">
        <input type="text" name="wpLast" id="wpLast" size="35" value=" <?php echo $_REQUEST["last_name"] ?>">
        <input class="button white" type="submit" name="wpSearch" id="wpSearch" value="Search">
</body>

</html>