// Dark ↔ light toggle, writing the same tm-theme key the main site reads,
// so the choice carries back and forth between the site and the essays.
(function(){
  var btn = document.querySelector(".theme-toggle");
  if (!btn) return;
  var label = function(){
    var dark = document.documentElement.getAttribute("data-theme") !== "light";
    btn.textContent = dark ? "☀ Light" : "☾ Dark";
  };
  label();
  btn.addEventListener("click", function(){
    var next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("tm-theme", next); } catch(e) {}
    label();
  });
})();

// Glitch wordmark — a vanilla port of GlitchWordmark in TaikoMassSite.jsx.
// Same glyph set, same frame maths, same auto-blip cadence, so the nav here
// behaves exactly like the wordmark on the main site. Keep the two in step.
(function(){
  var A = "Taiko Mass", B = "Jack Vintage";
  var GLYPHS = "!<>-_\\/[]{}—=+*^?#________";
  var RETURN_SCALE = 8 / 3;  // return scramble runs 2.67x the flip out
  var el = document.querySelector(".site-nav .gw");
  var link = document.querySelector(".site-nav .wordmark");
  if (!el || !link) return;

  var raf = null, frame = 0, hovering = false;
  var set = function(t){ el.textContent = t; el.setAttribute("data-text", t); };

  function scrambleTo(from, to, scale){
    scale = scale || 1;
    cancelAnimationFrame(raf);
    var len = Math.max(from.length, to.length), queue = [];
    for (var i = 0; i < len; i++){
      var start = Math.floor(Math.random() * 5) * scale;
      var end = start + (Math.floor(Math.random() * 7) + 5) * scale;
      queue.push({ fromCh: from[i] || "", toCh: to[i] || "", start: start, end: end, ch: "" });
    }
    frame = 0;
    el.classList.add("glitch-rgb");
    (function run(){
      var out = "", done = 0;
      for (var j = 0; j < queue.length; j++){
        var q = queue[j];
        if (frame >= q.end) { done++; out += q.toCh; }
        else if (frame >= q.start) {
          if (q.toCh === " " && q.fromCh === " ") { out += " "; }
          else {
            if (!q.ch || Math.random() < 0.28) q.ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            out += q.ch;
          }
        } else out += q.fromCh;
      }
      set(out);
      if (done === queue.length) { set(to); el.classList.remove("glitch-rgb"); return; }
      frame++;
      raf = requestAnimationFrame(run);
    })();
  }

  link.addEventListener("mouseenter", function(){ hovering = true; scrambleTo(A, B); });
  link.addEventListener("mouseleave", function(){ hovering = false; scrambleTo(B, A, RETURN_SCALE); });

  // Auto-blip: flash to "Jack Vintage" for 800ms, settle back, wait 10s.
  // Skipped while hovered so the pointer stays in control.
  (function cycleAfter(){
    setTimeout(function cycle(){
      if (!hovering) scrambleTo(A, B);
      setTimeout(function(){
        if (!hovering) scrambleTo(B, A, RETURN_SCALE);
        setTimeout(cycle, 10000);
      }, 800);
    }, 10000);
  })();
})();
