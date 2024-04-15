javascript: var ta = document.getElementById("wpTextbox1");
  var parts = ta.value.split("\n");
  var oldValue = ta.value;
  var top_ = "";
  var bottom = "";

  for (var i = 0; i < parts.length; i++) {
    if (parts[i].indexOf("[[Category") > -1) {
      top_ += "\n" + parts[i].replace("* [[Category", "[[Category");
    } else {
      bottom += "\n" + parts[i];
    }
  }
  if (top_ != "") {
    ta.value = top_.substring(1) + bottom;
  }
  void(0);