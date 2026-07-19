javascript: document.querySelectorAll("tr").forEach((r) => {
  if (r.querySelector("div.histogram")) {
    let s = 0;
    r.querySelectorAll("div.histogram div.col").forEach((c) => {
      let t = c.getAttribute("title") || "",
        m = t.match(/-\s*(\d+)/);
      if (m) {
        s += parseInt(m[1], 10);
        c.setAttribute("title", `${t} (${s})`);
      }
    });
  }
});
