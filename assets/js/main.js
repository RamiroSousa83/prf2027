document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Link do checkout (trocar aqui quando tiver o link) ---------- */
  const CHECKOUT_URL = "";

  /* ---------- Módulos: nome, mapas, imagem ---------- */
  const MODULOS = [
    ["Trânsito", 108], ["Português e Redação Oficial", 48], ["Direito Administrativo", 28],
    ["Direito Constitucional", 28], ["Direito Penal", 26], ["Direito Processual Penal", 24],
    ["Legislação Especial", 30], ["Direitos Humanos", 16], ["Raciocínio Lógico-Matemático", 21],
    ["Informática", 20], ["Física", 19], ["Ética e Cidadania", 12], ["Geopolítica", 12],
    ["Inglês", 14], ["Espanhol", 14],
  ];

  /* ---------- Data na faixa de topo ---------- */
  const dateEl = document.getElementById("topbar-date");
  if (dateEl) {
    const d = new Date();
    dateEl.textContent = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  }

  /* ---------- Checkout ---------- */
  document.querySelectorAll("[data-checkout]").forEach((a) => {
    if (CHECKOUT_URL) a.href = CHECKOUT_URL;
    else a.addEventListener("click", (e) => e.preventDefault());
  });

  /* ---------- Galeria de mapas ---------- */
  const track1 = document.getElementById("marquee-1-track");
  if (track1) {
    const build = () =>
      Array.from({ length: 18 }, (_, i) =>
        { const n = String(i + 1).padStart(2, "0");
          return `<img src="/assets/img/mapa-${n}-360.webp" srcset="/assets/img/mapa-${n}-360.webp 360w, /assets/img/mapa-${n}-540.webp 540w" sizes="(min-width: 760px) 300px, 250px" width="540" height="763" alt="Página de exemplo do Rota PRF 2027" loading="lazy" decoding="async" />`; }
      ).join("");
    track1.innerHTML = build() + build();
  }

  /* ---------- Grade de módulos ---------- */
  const modulesEl = document.getElementById("modules");
  if (modulesEl) {
    modulesEl.innerHTML = MODULOS.map(([nome, n], i) => {
      const num = String(i + 1).padStart(2, "0");
      const featured = i === 0;
      return `
        <article class="module${featured ? " module--featured" : ""}">
          <div class="module__thumb">${featured
            ? `<img src="/assets/img/modulo-01-420.webp" srcset="/assets/img/modulo-01-420.webp 420w, /assets/img/modulo-01-640.webp 640w" sizes="(min-width: 960px) 420px, 42vw" width="640" height="905" alt="Primeira página do módulo ${nome}" loading="lazy" decoding="async" />`
            : `<img src="/assets/img/modulo-${num}-360.webp" width="360" height="255" alt="Primeira página do módulo ${nome}" loading="lazy" decoding="async" />`}</div>
          <div class="module__body">
            ${featured ? '<span class="module__badge">O MAIOR MÓDULO</span>' : ""}
            <span class="module__n">MÓDULO ${num}</span>
            <h3 class="module__name">${nome}</h3>
            <span class="module__count"><b>${n} mapas</b></span>
          </div>
        </article>`;
    }).join("");
  }

  /* ---------- Controles da galeria ---------- */
  document.querySelectorAll("[data-marquee-toggle]").forEach((btn) => {
    const target = document.getElementById(btn.dataset.marqueeToggle);
    btn.addEventListener("click", () => {
      target.classList.toggle("is-paused");
      btn.textContent = target.classList.contains("is-paused") ? "Continuar" : "Pausar";
    });
  });

  const nudge = (id, dir) => {
    const track = document.getElementById(`${id}-track`);
    if (!track) return;
    document.getElementById(id).classList.add("is-paused");
    document.querySelectorAll(`[data-marquee-toggle="${id}"]`).forEach((b) => (b.textContent = "Continuar"));
    const current = getComputedStyle(track).transform;
    const x = current && current !== "none" ? new DOMMatrixReadOnly(current).m41 : 0;
    track.style.animation = "none";
    track.style.transition = "transform .35s ease";
    const half = track.scrollWidth / 2;
    let next = x - dir * 320;
    if (next > 0) next -= half;
    if (next < -half) next += half;
    track.style.transform = `translateX(${next}px)`;
  };
  document.querySelectorAll("[data-marquee-prev]").forEach((b) => b.addEventListener("click", () => nudge(b.dataset.marqueePrev, -1)));
  document.querySelectorAll("[data-marquee-next]").forEach((b) => b.addEventListener("click", () => nudge(b.dataset.marqueeNext, 1)));
  document.querySelectorAll("[data-marquee-toggle]").forEach((b) =>
    b.addEventListener("click", () => {
      const track = document.getElementById(`${b.dataset.marqueeToggle}-track`);
      if (track.style.animation === "none" && !document.getElementById(b.dataset.marqueeToggle).classList.contains("is-paused")) {
        track.style.transition = "";
        track.style.transform = "";
        track.style.animation = "";
      }
    })
  );

  /* ---------- Comparador (arrasta pelo botão central) ---------- */
  const compare = document.getElementById("compare");
  const before = document.getElementById("compare-before");
  const handle = document.getElementById("compare-handle");
  if (compare && before && handle) {
    compare.querySelectorAll("img").forEach((img) => (img.draggable = false));
    const setPos = (clientX) => {
      const r = compare.getBoundingClientRect();
      const pct = Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100));
      before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      handle.style.left = `${pct}%`;
    };
    let active = false;
    handle.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      active = true;
      try { handle.setPointerCapture(e.pointerId); } catch (_) {}
      handle.classList.add("is-dragging");
    });
    handle.addEventListener("pointermove", (e) => active && setPos(e.clientX));
    const stop = (e) => {
      active = false;
      try { handle.releasePointerCapture(e.pointerId); } catch (_) {}
      handle.classList.remove("is-dragging");
    };
    handle.addEventListener("pointerup", stop);
    handle.addEventListener("pointercancel", stop);
  }

  /* ---------- FAQ ---------- */
  document.querySelectorAll(".faq-item__q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const open = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item.is-open").forEach((o) => {
        o.classList.remove("is-open");
        o.querySelector(".faq-item__a").style.maxHeight = null;
      });
      if (!open) {
        item.classList.add("is-open");
        const a = item.querySelector(".faq-item__a");
        a.style.maxHeight = `${a.scrollHeight}px`;
      }
    });
  });

  /* ---------- CTA fixo no celular: aparece depois do hero, some na oferta ---------- */
  const sticky = document.getElementById("sticky-cta");
  const hero = document.querySelector(".hero");
  const oferta = document.getElementById("oferta");
  if (sticky && hero && oferta && "IntersectionObserver" in window) {
    let heroVisible = true, ofertaVisible = false;
    const update = () => sticky.classList.toggle("is-visible", !heroVisible && !ofertaVisible);
    new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; update(); }).observe(hero);
    new IntersectionObserver(([e]) => { ofertaVisible = e.isIntersecting; update(); }).observe(oferta);
  }
});
