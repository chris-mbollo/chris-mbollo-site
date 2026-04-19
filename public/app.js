// ===== Lenis smooth-scroll (progressive enhancement) =====
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
let lenis = null;
if (!reduceMotion) {
  try {
    const { default: Lenis } = await import("https://cdn.jsdelivr.net/npm/lenis@1.1.14/+esm");
    lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
    });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  } catch (e) { /* graceful fallback to native scroll */ }
}

const onScroll = (cb) => {
  if (lenis) lenis.on("scroll", ({ scroll }) => cb(scroll));
  else window.addEventListener("scroll", () => cb(window.scrollY), { passive: true });
};

// ===== Marquee: scroll-linked horizontal drift =====
const marqTrack = document.querySelector(".marquee-track");
const marqFirst = marqTrack ? marqTrack.querySelector(".marquee-content") : null;
if (marqTrack && marqFirst) {
  let baseW = marqFirst.offsetWidth;
  const remeasure = () => { baseW = marqFirst.offsetWidth; };
  window.addEventListener("resize", remeasure);
  window.addEventListener("load", remeasure);
  const updateMarq = (y) => {
    const x = -((y * 0.35) % baseW);
    marqTrack.style.setProperty("--marq-x", `${x}px`);
  };
  onScroll(updateMarq);
  updateMarq(window.scrollY);
}

// ===== Booking modal: lazy iframe load =====
const bookModal = document.getElementById("book-modal");
if (bookModal) {
  const iframe = bookModal.querySelector("[data-book-iframe]");
  const iframeSrc = iframe ? iframe.getAttribute("data-src") : null;
  let lastFocus = null;
  const openBook = () => {
    lastFocus = document.activeElement;
    bookModal.hidden = false;
    requestAnimationFrame(() => bookModal.classList.add("is-open"));
    bookModal.setAttribute("aria-hidden", "false");
    if (iframe && iframeSrc && !iframe.src) iframe.src = iframeSrc;
    if (lenis) lenis.stop(); else document.body.style.overflow = "hidden";
    const close = bookModal.querySelector(".book-close");
    if (close) close.focus();
  };
  const closeBook = () => {
    bookModal.classList.remove("is-open");
    bookModal.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      if (!bookModal.classList.contains("is-open")) bookModal.hidden = true;
    }, 320);
    if (lenis) lenis.start(); else document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  };
  document.querySelectorAll("[data-book-trigger]").forEach((b) =>
    b.addEventListener("click", openBook)
  );
  bookModal.querySelectorAll("[data-book-close]").forEach((b) =>
    b.addEventListener("click", closeBook)
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && bookModal.classList.contains("is-open")) closeBook();
  });
}

// ===== Nav: hamburger morph + panel =====
const burger = document.querySelector(".nav-burger");
const panel = document.getElementById("nav-panel");
if (burger && panel) {
  const close = () => {
    burger.setAttribute("aria-expanded", "false");
    panel.classList.remove("is-open");
    setTimeout(() => { if (burger.getAttribute("aria-expanded") === "false") panel.hidden = true; }, 320);
    document.body.style.overflow = "";
  };
  const open = () => {
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add("is-open"));
    burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };
  burger.addEventListener("click", () => {
    (burger.getAttribute("aria-expanded") === "true" ? close : open)();
  });
  panel.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") close();
  });
}

// ===== Rail: active dot on scroll =====
const rail = document.querySelector(".rail");
if (rail && "IntersectionObserver" in window) {
  const dots = new Map();
  rail.querySelectorAll(".rail-dot").forEach((d) => dots.set(d.dataset.section, d));
  const sections = ["hero", "thesis", "tests", "work", "service", "subscribe"]
    .map((id) => (id === "hero" ? document.querySelector(".hero") : document.getElementById(id)))
    .filter(Boolean);
  const setActive = (id) => {
    const target = id === "hero" ? "top" : id;
    dots.forEach((dot, key) => dot.classList.toggle("is-active", key === target));
  };
  const navLinks = document.querySelectorAll(".nav-links a");
  const setNavActive = (id) => {
    navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`));
  };
  const railIO = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const id = visible.target.id || (visible.target.classList.contains("hero") ? "hero" : "");
      if (id) {
        setActive(id);
        setNavActive(id);
        document.body.classList.toggle("rail-on-dark", id === "subscribe");
      }
    },
    { threshold: [0.25, 0.5, 0.75], rootMargin: "-20% 0px -40% 0px" }
  );
  sections.forEach((s) => railIO.observe(s));
}

// ===== Cursor: ambient spotlight + plaque radial =====
if (matchMedia("(pointer: fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.body.classList.add("has-cursor");
  const root = document.documentElement;
  window.addEventListener("pointermove", (e) => {
    root.style.setProperty("--cx", `${e.clientX}px`);
    root.style.setProperty("--cy", `${e.clientY}px`);
  });
  document.querySelectorAll("[data-spotlight]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

// ===== Magnetic buttons =====
if (matchMedia("(pointer: fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const strength = 0.25;
  const max = 8;
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const mx = Math.max(-max, Math.min(max, dx * strength));
      const my = Math.max(-max, Math.min(max, dy * strength));
      el.style.setProperty("--mag-x", `${mx}px`);
      el.style.setProperty("--mag-y", `${my}px`);
    });
    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--mag-x", "0px");
      el.style.setProperty("--mag-y", "0px");
    });
  });
}

// ===== Reveal on scroll =====
const revealTargets = document.querySelectorAll("section, .project, .test");
revealTargets.forEach((el) => el.classList.add("reveal"));

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("is-visible"), i * 100);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  revealTargets.forEach((el) => io.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("is-visible"));
}

// ===== Audit modal: two-stage form + calendar =====
const auditModal = document.getElementById("audit-modal");
if (auditModal) {
  const form = document.getElementById("audit-form");
  const feedback = auditModal.querySelector(".audit-feedback");
  const submit = auditModal.querySelector(".audit-submit");
  const submitLabel = submit ? submit.querySelector(".btn-label") : null;
  const calMount = auditModal.querySelector("#cal-embed");
  let calInited = false;
  let lastFocus = null;

  const loadCalEmbed = () => new Promise((resolve, reject) => {
    if (window.Cal && window.Cal.ns && window.Cal.ns.audit) return resolve(window.Cal);
    (function (C, A, L) {
      let p = function (a, ar) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal, ar = arguments;
        if (!cal.loaded) {
          cal.ns = {}; cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");
    const check = () => {
      if (window.Cal && window.Cal.ns && typeof window.Cal.ns.audit === "function") resolve(window.Cal);
      else setTimeout(check, 40);
    };
    window.Cal("init", "audit", { origin: "https://cal.com" });
    check();
  });

  const initCal = (email) => {
    if (!calMount) return;
    if (calInited) return;
    calInited = true;
    loadCalEmbed().then(() => {
      window.Cal.ns.audit("inline", {
        elementOrSelector: "#cal-embed",
        calLink: "chrismbollo/audit",
        layout: "month_view",
        config: email ? { email } : {},
      });
      window.Cal.ns.audit("ui", {
        theme: "light",
        cssVarsPerTheme: {
          light: {
            "cal-brand": "#6B1F2A",
            "cal-text": "#141414",
            "cal-text-emphasis": "#141414",
            "cal-bg": "#F7F5F0",
            "cal-bg-emphasis": "#EFEAE0",
            "cal-border": "#E3DED2",
            "cal-border-emphasis": "#C9C1AE",
          },
        },
        hideEventTypeDetails: false,
      });
    }).catch(() => { calInited = false; });
  };

  const setStage = (stage) => {
    auditModal.querySelectorAll(".audit-stage").forEach((el) => {
      el.hidden = el.dataset.stage !== stage;
    });
    auditModal
      .querySelectorAll("[data-stage-eyebrow], [data-stage-title], [data-stage-sub]")
      .forEach((el) => {
        const key = el.dataset.stageEyebrow || el.dataset.stageTitle || el.dataset.stageSub;
        el.hidden = key !== stage;
      });
    auditModal.classList.toggle("is-calendar", stage === "calendar");
  };

  const openAudit = () => {
    lastFocus = document.activeElement;
    auditModal.hidden = false;
    requestAnimationFrame(() => auditModal.classList.add("is-open"));
    auditModal.setAttribute("aria-hidden", "false");
    setStage("form");
    if (lenis) lenis.stop(); else document.body.style.overflow = "hidden";
    const firstInput = form ? form.querySelector("input, textarea") : null;
    if (firstInput) firstInput.focus({ preventScroll: true });
  };

  const closeAudit = () => {
    auditModal.classList.remove("is-open");
    auditModal.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      if (!auditModal.classList.contains("is-open")) auditModal.hidden = true;
    }, 320);
    if (lenis) lenis.start(); else document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  };

  document.querySelectorAll("[data-audit-trigger]").forEach((b) =>
    b.addEventListener("click", openAudit)
  );
  auditModal.querySelectorAll("[data-audit-close]").forEach((b) =>
    b.addEventListener("click", closeAudit)
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && auditModal.classList.contains("is-open")) closeAudit();
  });

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!feedback || !submit || !submitLabel) return;

      feedback.classList.remove("is-success");
      feedback.textContent = "";

      const data = new FormData(form);
      const platform = (data.get("platform") || "").toString().trim();
      const audience = (data.get("audience") || "").toString();
      const gap = (data.get("gap") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const monetization = data.getAll("monetization");

      if (!platform) { feedback.textContent = "Share your main platform and handle."; return; }
      if (!audience) { feedback.textContent = "Pick an audience size."; return; }
      if (!gap) { feedback.textContent = "What does your audience keep asking for?"; return; }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        feedback.textContent = "That email does not look right."; return;
      }

      const originalLabel = submitLabel.textContent;
      submitLabel.textContent = "Sending";
      submit.disabled = true;

      try {
        const res = await fetch("/api/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ platform, audience, gap, email, monetization }),
        });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.error || "server_error");

        initCal(email);
        setStage("calendar");
      } catch (err) {
        feedback.textContent = err.message === "invalid_email"
          ? "That email does not look right."
          : "Something broke on our end. Try again in a minute.";
      } finally {
        submitLabel.textContent = originalLabel;
        submit.disabled = false;
      }
    });
  }
}

// ===== Subscribe forms =====
document.querySelectorAll("form.capture").forEach((form) => {
  const feedback = form.querySelector(".capture-feedback");
  const button = form.querySelector("button[type=submit]");
  const input = form.querySelector("input[type=email]");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    feedback.classList.remove("is-success");
    feedback.textContent = "";

    const email = input.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      feedback.textContent = "That email does not look right.";
      input.focus();
      return;
    }

    const originalLabel = button.querySelector(".btn-label").textContent;
    button.querySelector(".btn-label").textContent = "Sending";
    button.disabled = true;

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: form.dataset.source || "site" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "server_error");

      feedback.classList.add("is-success");
      feedback.textContent = "Check your inbox. Tuesdays from here on.";
      input.value = "";
    } catch (err) {
      feedback.textContent = err.message === "invalid_email"
        ? "That email does not look right."
        : "Something broke on our end. Try again in a minute.";
    } finally {
      button.querySelector(".btn-label").textContent = originalLabel;
      button.disabled = false;
    }
  });
});
