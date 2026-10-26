(function () {
  const CAT_LABEL = {
    future_tech: "未來科技",
    buy_side: "買方言論",
  };

  const timeline = document.getElementById("timeline");
  const countEl = document.getElementById("count");
  const subtitleEl = document.getElementById("subtitle");
  const metaNoteEl = document.getElementById("metaNote");
  let entries = [];
  let filter = "all";

  function formatFoundAt(iso) {
    try {
      const d = new Date(iso);
      const parts = new Intl.DateTimeFormat("zh-HK", {
        timeZone: "Asia/Hong_Kong",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).formatToParts(d);
      const get = (t) => parts.find((p) => p.type === t)?.value || "";
      return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")} HKT`;
    } catch {
      return iso;
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function render() {
    const list = entries
      .slice()
      .sort((a, b) => new Date(b.found_at) - new Date(a.found_at))
      .filter((e) => filter === "all" || e.category === filter);

    countEl.textContent = `顯示 ${list.length} 則 · 由新到舊`;

    if (!list.length) {
      timeline.innerHTML = '<p class="empty">呢個分類暫時冇資料</p>';
      return;
    }

    timeline.innerHTML = list
      .map((e) => {
        const tags = [
          ...(e.tickers || []).map((t) => `<span class="tag ticker">${escapeHtml(t)}</span>`),
          ...(e.companies || []).slice(0, 6).map((c) => `<span class="tag">${escapeHtml(c)}</span>`),
        ].join("");

        const links = (e.links || [])
          .map(
            (l) =>
              `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label || l.url)}</a>`
          )
          .join("");

        const warn = e.verification
          ? `<div class="warn">⚠️ ${escapeHtml(e.verification)}</div>`
          : "";

        return `
          <article class="card" data-category="${escapeHtml(e.category)}">
            <div class="card-top">
              <span class="badge ${escapeHtml(e.category)}">${CAT_LABEL[e.category] || e.category}</span>
              <time class="found-at" datetime="${escapeHtml(e.found_at)}">${formatFoundAt(e.found_at)}</time>
            </div>
            <h2>${escapeHtml(e.title)}</h2>
            <p class="body">${escapeHtml(e.body)}</p>
            ${tags ? `<div class="tags">${tags}</div>` : ""}
            ${links ? `<div class="links">${links}</div>` : ""}
            ${warn}
          </article>
        `;
      })
      .join("");
  }

  document.querySelectorAll(".filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      filter = btn.dataset.filter;
      document.querySelectorAll(".filter").forEach((b) => {
        const on = b === btn;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
      render();
    });
  });

  fetch("data/scans.json")
    .then((r) => {
      if (!r.ok) throw new Error("load failed");
      return r.json();
    })
    .then((data) => {
      if (data.meta?.subtitle) subtitleEl.textContent = data.meta.subtitle;
      if (data.meta?.note) metaNoteEl.textContent = data.meta.note;
      entries = Array.isArray(data.entries) ? data.entries : [];
      render();
    })
    .catch(() => {
      timeline.innerHTML = '<p class="empty">載入 data/scans.json 失敗</p>';
      countEl.textContent = "";
    });
})();
