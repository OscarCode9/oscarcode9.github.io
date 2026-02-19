(() => {
  const API_BASE = "https://agents.oventlabs.com";
  const HIT_URL = API_BASE + "/api/visits/hit";
  const GET_URL = API_BASE + "/api/visits";

  function format(n) {
    try {
      return Number(n).toLocaleString("es-MX");
    } catch {
      return String(n);
    }
  }

  async function hit(path) {
    const res = await fetch(HIT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path })
    });
    if (!res.ok) throw new Error("HIT_FAILED");
    return await res.json();
  }

  async function get(path) {
    const res = await fetch(GET_URL + "?path=" + encodeURIComponent(path), {
      method: "GET"
    });
    if (!res.ok) throw new Error("GET_FAILED");
    return await res.json();
  }

  function normalizePath(p) {
    if (!p) return "/";
    const cleaned = String(p).split("?")[0].split("#")[0].trim();
    const withSlash = cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
    return withSlash.slice(0, 200);
  }

  async function run() {
    const badges = Array.from(document.querySelectorAll("[data-ov-visits]"));
    if (!badges.length) return;

    const pagePath = normalizePath(window.location.pathname || "/");

    await Promise.all(
      badges.map(async (el) => {
        const pathAttr = el.getAttribute("data-ov-path");
        const path = normalizePath(pathAttr || pagePath);
        const readonly = el.hasAttribute("data-ov-readonly");

        el.classList.add("is-loading");
        const countEl = el.querySelector(".ov-count");

        try {
          const data = readonly ? await get(path) : await hit(path);
          if (countEl) countEl.textContent = format(data?.count ?? 0);
        } catch {
          el.classList.add("is-error");
          if (countEl) countEl.textContent = "—";
        } finally {
          el.classList.remove("is-loading");
        }
      })
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
