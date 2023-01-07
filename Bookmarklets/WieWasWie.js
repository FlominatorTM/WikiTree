javascript:
/* opens WieWasWie formatter when triggered while being on a detail page at wiewaswie.nl/ */
document.write('<form method="POST" id="formid" action="https://www.genealogietools.nl/formatter/"><input type="text" name="detailurl" value="' + window.location +'"></form>');
document.getElementById('formid').submit();
