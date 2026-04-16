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

// ===== Lazy YouTube embed =====
const iframe = document.querySelector("iframe[data-video-id]");
if (iframe) {
  const videoId = iframe.dataset.videoId;
  if (videoId && videoId !== "REPLACE_WITH_YOUTUBE_VIDEO_ID") {
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
          io2.unobserve(iframe);
        }
      });
    }, { rootMargin: "200px" });
    io2.observe(iframe);
  } else {
    iframe.closest("section").hidden = true;
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
