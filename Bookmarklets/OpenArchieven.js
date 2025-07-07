javascript:
/* opens Open Archives formatter when triggered while being on a detail page at openarchieven.nl/ */
document.write('<form method="POST" id="formid" action="https://www.genealogietools.nl/formatter/"><input type="text" name="detailurl" value="' + window.location +'"></form>');
document.getElementById('formid').submit();