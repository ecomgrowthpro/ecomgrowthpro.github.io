/* ============================================================
   GrowWithJoshua — site settings
   Change these three values and every contact link on the
   site updates automatically.
   ============================================================ */
const SITE = {
  email: "extraordinaryexpert45@gmail.com", // your business email
  whatsapp: "2348142834890",                // WhatsApp number, country code first, digits only
  whatsappDisplay: "+234 814 283 4890",     // how the number is shown on the page
  fiverr: "https://www.fiverr.com/etsy_growth_pro", // your Fiverr profile
  tiktok: "https://www.tiktok.com/@growwithjoshua1"  // your TikTok profile
};

(function () {
  "use strict";

  /* Contact links */
  document.querySelectorAll("[data-email]").forEach(function (el) {
    el.href = "mailto:" + SITE.email;
    if (el.hasAttribute("data-show")) el.textContent = SITE.email;
  });
  document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
    el.href = "https://wa.me/" + SITE.whatsapp;
    el.target = "_blank";
    el.rel = "noopener";
    if (el.hasAttribute("data-show")) el.textContent = SITE.whatsappDisplay;
  });
  document.querySelectorAll("[data-fiverr]").forEach(function (el) {
    el.href = SITE.fiverr;
    el.target = "_blank";
    el.rel = "noopener";
  });
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Header border on scroll */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Mobile menu */
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    var setOpen = function (open) {
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector(".label").textContent = open ? "Close" : "Menu";
      if (open) { menu.removeAttribute("inert"); } else { menu.setAttribute("inert", ""); }
    };
    setOpen(false);
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) { setOpen(false); toggle.focus(); }
    });
    window.addEventListener("resize", function () { if (window.innerWidth >= 1200) setOpen(false); });
  }

  /* Portfolio filters */
  var filters = document.querySelectorAll(".filter");
  if (filters.length) {
    var projects = document.querySelectorAll("[data-cat]");
    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cat = btn.getAttribute("data-filter");
        filters.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
        projects.forEach(function (p) {
          var cats = p.getAttribute("data-cat").split(" ");
          p.hidden = !(cat === "all" || cats.indexOf(cat) !== -1);
        });
      });
    });
  }

  /* Services sub-nav: highlight the section in view */
  var subLinks = document.querySelectorAll(".svc-nav a");
  if (subLinks.length && "IntersectionObserver" in window) {
    var map = {};
    subLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          subLinks.forEach(function (a) { a.classList.remove("is-active"); });
          map[en.target.id].classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) obs.observe(s); });
  }

  /* Reviews slideshow: arrows, dots, swipe, keyboard; auto-advances every 7s,
     pauses on hover/focus, while a video plays, and for reduced-motion users. */
  document.querySelectorAll("[data-slider]").forEach(function (slider) {
    var slides = slider.querySelectorAll(".slide");
    var dotsWrap = slider.querySelector(".dots");
    if (!slides.length) return;
    var current = 0, timer = null, paused = false;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var dots = Array.prototype.map.call(slides, function (s, i) {
      var b = document.createElement("button");
      b.type = "button"; b.setAttribute("role", "tab");
      b.setAttribute("aria-label", "Review " + (i + 1) + " of " + slides.length);
      b.addEventListener("click", function () { go(i); restart(); });
      dotsWrap.appendChild(b); return b;
    });

    function go(i) {
      var next = (i + slides.length) % slides.length;
      if (next === current && slides[current].classList.contains("is-active")) return;
      slides[current].classList.remove("is-active");
      slides[current].querySelectorAll("video").forEach(function (v) { v.pause(); });
      current = next;
      slides.forEach(function (s, k) { s.setAttribute("aria-hidden", String(k !== current)); });
      slides[current].classList.add("is-active");
      dots.forEach(function (d, k) { d.setAttribute("aria-selected", String(k === current)); });
    }
    function restart() {
      clearInterval(timer);
      if (reduce) return;
      timer = setInterval(function () { if (!paused) go(current + 1); }, 7000);
    }

    slider.querySelector("[data-prev]").addEventListener("click", function () { go(current - 1); restart(); });
    slider.querySelector("[data-next]").addEventListener("click", function () { go(current + 1); restart(); });
    slider.addEventListener("mouseenter", function () { paused = true; });
    slider.addEventListener("mouseleave", function () { paused = false; });
    slider.addEventListener("focusin", function () { paused = true; });
    slider.addEventListener("focusout", function () { paused = false; });
    slider.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { go(current - 1); restart(); }
      if (e.key === "ArrowRight") { go(current + 1); restart(); }
    });
    slider.querySelectorAll("video").forEach(function (v) {
      v.addEventListener("play", function () { paused = true; clearInterval(timer); });
    });
    var startX = null;
    slider.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { go(current + (dx < 0 ? 1 : -1)); restart(); }
      startX = null;
    });

    go(0); restart();
  });

  /* Contact form: validates, then opens email or WhatsApp with the message filled in.
     No server needed, so it works on GitHub Pages. */
  var form = document.getElementById("contact-form");
  if (form) {
    var status = document.getElementById("form-status");
    var required = form.querySelectorAll("[required]");

    var validate = function () {
      var ok = true;
      required.forEach(function (input) {
        var field = input.closest(".field");
        var valid = input.value.trim() !== "" && (input.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()));
        field.classList.toggle("has-error", !valid);
        if (!valid && ok) { input.focus(); ok = false; }
      });
      return ok;
    };

    var buildMessage = function () {
      var d = new FormData(form);
      var services = d.getAll("services");
      var lines = [
        "Hi Joshua,",
        "",
        "Name: " + d.get("name"),
        "Email: " + d.get("email"),
        d.get("store") ? "Store: " + d.get("store") : null,
        "Platform: " + (d.get("platform") || "Not sure yet"),
        services.length ? "Interested in: " + services.join(", ") : null,
        "",
        d.get("message")
      ];
      return lines.filter(function (l) { return l !== null; }).join("\n");
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) return;
      var via = e.submitter && e.submitter.value === "whatsapp" ? "whatsapp" : "email";
      var body = buildMessage();
      if (via === "whatsapp") {
        window.open("https://wa.me/" + SITE.whatsapp + "?text=" + encodeURIComponent(body), "_blank", "noopener");
        status.textContent = "WhatsApp opened in a new tab with your message ready. Press send there to reach Joshua.";
      } else {
        var subject = "Store enquiry from " + new FormData(form).get("name");
        window.location.href = "mailto:" + SITE.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
        status.textContent = "Your email app opened with your message ready. Press send there to reach Joshua. Nothing opened? Email " + SITE.email + " directly.";
      }
      status.classList.add("is-visible");
    });

    required.forEach(function (input) {
      input.addEventListener("input", function () {
        if (input.value.trim() !== "") input.closest(".field").classList.remove("has-error");
      });
    });
  }
})();
