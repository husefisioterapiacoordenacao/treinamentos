/* Portal de treinamentos - site estático para GitHub Pages. */
(() => {
  'use strict';
  const modules = window.PORTAL_MODULES || [];
  const storageKey = 'fisiolab:treinamentos:concluidos:v1';
  const currentPage = document.documentElement.dataset.page || 'inicio';
  const main = document.getElementById('main');
  const breadcrumb = document.getElementById('breadcrumb');
  const menuButton = document.getElementById('mobile-menu');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobile-overlay');
  let completed = readCompleted();

  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon = (name, className = 'ico') => `<svg class="${className}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  const moduleUrl = (m) => `${m.slug}.html`;
  const normalize = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const isDone = (slug) => completed.includes(slug);

  function readCompleted() {
    try {
      const list = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return Array.isArray(list) ? list.filter(x => modules.some(m => m.slug === x)) : [];
    } catch (_) { return []; }
  }
  function saveCompleted() {
    try {localStorage.setItem(storageKey, JSON.stringify(completed));} catch (_) { /* Navegação privada pode bloquear armazenamento. */ }
    refreshProgress();
  }
  function refreshProgress() {
    const total = modules.length;
    const done = completed.length;
    const value = document.getElementById('side-progress-value');
    const bar = document.getElementById('side-progress-bar');
    if (value) value.textContent = `${done} de ${total}`;
    if (bar) bar.style.width = `${total ? done / total * 100 : 0}%`;
    document.querySelectorAll('[data-complete-icon]').forEach(el => {
      el.innerHTML = isDone(el.dataset.completeIcon) ? icon('checkcircle') : '';
    });
    const heroPercentage = document.getElementById('hero-percentage');
    const heroRing = document.getElementById('hero-ring');
    if (heroPercentage) heroPercentage.textContent = `${total ? Math.round(done / total * 100) : 0}%`;
    if (heroRing) heroRing.style.setProperty('--progress', String(total ? done / total * 100 : 0));
  }
  function closeMenu() {
    sidebar.classList.remove('menu-open');
    overlay.classList.remove('show');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
  }
  menuButton.addEventListener('click', () => {
    const open = !sidebar.classList.contains('menu-open');
    sidebar.classList.toggle('menu-open', open);
    overlay.classList.toggle('show', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  overlay.addEventListener('click', closeMenu);
  window.addEventListener('keydown', (e) => {if (e.key === 'Escape') closeMenu();});
  document.querySelectorAll('.nav-entry').forEach(el => {
    if (el.dataset.nav === currentPage) {el.classList.add('active');el.setAttribute('aria-current','page');}
    el.addEventListener('click', closeMenu);
  });

  function renderOverview() {
    breadcrumb.textContent = 'Visão geral';
    const audioCount = modules.filter(m => m.files.podcast).length;
    const fileCount = modules.reduce((n,m) => n + Object.values(m.files).filter(Boolean).length, 0);
    const cards = modules.map(m => `
      <a class="course-card" href="${moduleUrl(m)}" style="--accent:${m.accent}" data-card="${m.slug}">
        <div class="course-top"><div class="course-icon">${icon(m.icon)}</div><span class="course-index">${m.number} / 0${modules.length}</span></div>
        <div class="course-tag">${esc(m.tag)}</div><h3>${esc(m.title)}</h3><p class="course-description">${esc(m.sub)}</p>
        <div class="course-footer"><span>${isDone(m.slug) ? `<span class="card-complete">${icon('checkcircle')} Concluído</span>` : `${m.files.podcast ? '3' : '2'} materiais`}</span>
        <span class="learn-more">Acessar módulo ${icon('arrow')}</span></div>
      </a>`).join('');
    main.innerHTML = `
    <div class="page-container">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-left">
          <div class="eyebrow">FORMAÇÃO PARA A PRÁTICA CLÍNICA</div>
          <h1 id="hero-title">Aprendizado que transforma <em>a prática assistencial.</em></h1>
          <p>Uma biblioteca de treinamentos de Fisioterapia, com resumos para leitura, mapas mentais e podcasts reunidos em um só lugar.</p>
          <a class="hero-button" href="#treinamentos">Explorar treinamentos ${icon('arrow')}</a>
        </div>
        <div class="hero-progress" aria-label="Progresso dos módulos"><div class="progress-ring" id="hero-ring"><div class="progress-ring-inner"><strong id="hero-percentage">0%</strong><span>CONCLUÍDO</span></div></div></div>
      </section>
      <div class="metrics-grid" aria-label="Resumo da biblioteca">
        <div class="metric"><div class="metric-icon">${icon('book')}</div><div class="metric-text"><strong>${modules.length.toString().padStart(2,'0')}</strong><span>Módulos disponíveis</span></div></div>
        <div class="metric"><div class="metric-icon blue">${icon('file')}</div><div class="metric-text"><strong>${fileCount.toString().padStart(2,'0')}</strong><span>Materiais didáticos</span></div></div>
        <div class="metric"><div class="metric-icon orange">${icon('headphones')}</div><div class="metric-text"><strong>${audioCount.toString().padStart(2,'0')}</strong><span>Podcasts em áudio</span></div></div>
      </div>
      <section id="treinamentos" aria-labelledby="section-title">
        <div class="section-heading"><div><h2 id="section-title">Biblioteca de treinamentos</h2><p>Escolha um módulo para começar ou continuar seus estudos.</p></div>
          <label class="search-wrap">${icon('search')}<input id="course-search" type="search" aria-label="Buscar treinamento" placeholder="Pesquisar treinamento..." autocomplete="off"></label>
        </div>
        <div class="module-grid" id="module-grid">${cards}</div>
        <p id="search-count" class="sr-only" aria-live="polite"></p>
      </section>
      <aside class="information-note">${icon('shield')}<p>Este espaço organiza materiais de capacitação. A conclusão de um módulo é registrada apenas neste navegador e não corresponde a certificação. As condutas clínicas devem seguir os protocolos institucionais e referências atualizadas.</p></aside>
    </div>`;
    const search = document.getElementById('course-search');
    search.addEventListener('input', () => {
      const term = normalize(search.value.trim());
      let found = 0;
      modules.forEach(m => {
        const card = document.querySelector(`[data-card="${m.slug}"]`);
        const match = normalize([m.title,m.short,m.sub,m.tag,m.keywords.join(' '),m.article.replace(/<[^>]+>/g,' ')].join(' ')).includes(term);
        card.hidden = !match;
        if (match) found++;
      });
      const noResults = document.getElementById('empty-results');
      if (noResults) noResults.remove();
      if (!found) document.getElementById('module-grid').insertAdjacentHTML('beforeend','<div class="empty-state" id="empty-results"><h3>Nenhum treinamento encontrado</h3><p>Experimente outro termo de pesquisa.</p></div>');
      document.getElementById('search-count').textContent = `${found} treinamento(s) encontrado(s).`;
    });
    refreshProgress();
  }

  function renderModule(m) {
    breadcrumb.textContent = m.short;
    const hasPodcast = Boolean(m.files.podcast);
    const tabs = [
      {id:'resumo',icon:'book',label:'Resumo da aula'},
      {id:'mapa',icon:'map',label:'Mapa mental'},
      ...(hasPodcast ? [{id:'podcast',icon:'headphones',label:'Ouvir podcast'}] : []),
    ];
    const next = modules[(modules.indexOf(m)+1) % modules.length];
    const resources = [
      {label:'Resumo original',sub:'Arquivo Word · DOCX',file:m.files.resumo,icon:'file',download:true},
      {label:'Mapa mental',sub:'Documento · PDF',file:m.files['mapa-mental'],icon:'map',download:false},
      ...(hasPodcast ? [{label:'Podcast',sub:'Áudio · MP3',file:m.files.podcast,icon:'headphones',download:false}] : []),
    ];
    main.innerHTML = `
      <div class="page-container" style="--accent:${m.accent}">
      <a href="index.html" class="return-link">${icon('arrow')} Voltar para todos os treinamentos</a>
      <section class="module-hero">
        <div class="module-heading"><div class="eyebrow">MÓDULO ${m.number} · ${esc(m.tag)}</div><h1>${esc(m.title)}</h1><p>${esc(m.sub)}</p>
        <div class="pill-row"><span class="info-pill">${icon('book')} Resumo completo</span><span class="info-pill">${icon('map')} Mapa mental</span>${hasPodcast ? `<span class="info-pill">${icon('headphones')} Podcast</span>` : ''}</div>
        </div><div class="module-hero-icon">${icon(m.icon)}</div>
      </section>
      <div class="module-toolbar"><div class="module-toolbar-text">Material do treinamento<span>Escolha como prefere estudar o conteúdo.</span></div>
        <button id="mark-complete" class="completion-btn" type="button"></button>
      </div>
      <section class="learning-surface" aria-label="Materiais do treinamento">
        <div class="tabs" role="tablist" aria-label="Formatos de conteúdo">${tabs.map(t => `<button type="button" class="tab-button" role="tab" id="tab-${t.id}" data-tab="${t.id}" aria-selected="false" aria-controls="panel-${t.id}">${icon(t.icon)} ${t.label}</button>`).join('')}</div>
        <div class="tab-body">
          <section id="panel-resumo" class="tab-panel" role="tabpanel" aria-labelledby="tab-resumo" data-tab-panel="resumo">
            <div class="reading-layout"><article class="reading-main"><div class="content-intro"><h2>Resumo da aula</h2><p>Conteúdo integral adaptado para leitura a partir do documento enviado · ${m.words.toLocaleString('pt-BR')} palavras</p></div>
              <div class="lesson-text">${m.article}</div></article>
              <aside class="contents-card"><h3>Nesta aula</h3><nav aria-label="Sumário do conteúdo">${m.toc.map(s => `<a href="#${esc(s.anchor)}">${esc(s.text)}</a>`).join('')}</nav><div class="hint">Navegue pelos tópicos ou leia o material completo.</div></aside>
            </div>
          </section>
          <section id="panel-mapa" class="tab-panel" role="tabpanel" aria-labelledby="tab-mapa" data-tab-panel="mapa" hidden>
            <div class="panel-heading"><div><h2>Mapa mental da aula</h2><p>Uma visão visual e resumida dos principais conceitos do treinamento.</p></div><div class="file-actions"><a class="small-action" href="${m.files['mapa-mental']}" target="_blank" rel="noopener">${icon('external')} Abrir PDF</a><a class="small-action primary" href="${m.files['mapa-mental']}" download>${icon('download')} Baixar</a></div></div>
            <div class="pdf-wrapper"><iframe title="Mapa mental de ${esc(m.title)}" loading="lazy" data-pdf="${m.files['mapa-mental']}#view=FitH"></iframe><div class="pdf-fallback">Se o PDF não aparecer no seu dispositivo, use o botão “Abrir PDF”.</div></div>
          </section>
          ${hasPodcast ? `<section id="panel-podcast" class="tab-panel" role="tabpanel" aria-labelledby="tab-podcast" data-tab-panel="podcast" hidden>
            <div class="podcast-area"><div class="podcast-art">${icon('headphones')}</div><div class="mini-label">PODCAST DE REVISÃO</div><h2>${esc(m.title)}</h2><p>Revise o conteúdo da aula em áudio. Você pode ouvir diretamente neste navegador ou baixar o MP3 para escutar quando quiser.</p>
              <div class="audio-box"><audio controls preload="metadata" aria-label="Podcast de ${esc(m.title)}"><source src="${m.files.podcast}" type="audio/mpeg">Seu navegador não suporta reprodução de áudio.</audio></div>
              <a class="small-action audio-download" href="${m.files.podcast}" download>${icon('download')} Baixar áudio MP3</a></div></section>` : ''}
        </div>
      </section>
      <section class="resource-strip" aria-label="Arquivos originais">${resources.map(r=> `<a class="resource-link" href="${r.file}" ${r.download ? 'download' : 'target="_blank" rel="noopener"'}>${icon(r.icon)}<span><strong>${r.label}</strong><small>${r.sub}</small></span>${icon(r.download ? 'download' : 'external','ico arrow')}</a>`).join('')}</section>
      <div class="next-course"><div><small>CONTINUE APRENDENDO</small><h3>${esc(next.title)}</h3></div><a href="${moduleUrl(next)}">Próximo módulo ${icon('arrow')}</a></div>
      </div>`;

    const completeButton = document.getElementById('mark-complete');
    function updateButton() {
      const done = isDone(m.slug);
      completeButton.classList.toggle('completed', done);
      completeButton.innerHTML = `${icon(done ? 'checkcircle' : 'check')} ${done ? 'Módulo concluído' : 'Marcar como concluído'}`;
      completeButton.setAttribute('aria-pressed', String(done));
      completeButton.setAttribute('aria-label', done ? 'Desmarcar módulo concluído' : 'Marcar módulo como concluído');
    }
    completeButton.addEventListener('click', () => {
      if (isDone(m.slug)) completed = completed.filter(s => s !== m.slug);
      else completed = [...completed, m.slug];
      saveCompleted();
      updateButton();
    });
    updateButton();

    const tabButtons = [...document.querySelectorAll('[data-tab]')];
    const tabNames = tabs.map(t => t.id);
    const urlParams = new URLSearchParams(location.search);
    let currentTab = tabNames.includes(urlParams.get('aba')) ? urlParams.get('aba') : 'resumo';
    function activateTab(id, updateUrl) {
      if (!tabNames.includes(id)) return;
      const audio = document.querySelector('audio');
      if (id !== 'podcast' && audio && !audio.paused) audio.pause();
      tabButtons.forEach(button => {
        const active = button.dataset.tab === id;
        button.setAttribute('aria-selected', String(active));
        button.tabIndex = active ? 0 : -1;
      });
      document.querySelectorAll('[data-tab-panel]').forEach(panel => {panel.hidden = panel.dataset.tabPanel !== id;});
      if (id === 'mapa') {
        const iframe = document.querySelector('[data-pdf]');
        if (iframe && !iframe.src) iframe.src = iframe.dataset.pdf;
      }
      currentTab = id;
      if (updateUrl) {
        const url = new URL(location.href);
        if (id === 'resumo') url.searchParams.delete('aba');
        else url.searchParams.set('aba', id);
        history.replaceState(null, '',url.pathname + url.search + (id !== 'resumo' ? '' : ''));
      }
    }
    tabButtons.forEach((button,index) => {
      button.addEventListener('click', () => activateTab(button.dataset.tab,true));
      button.addEventListener('keydown', (event) => {
        if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
        event.preventDefault();
        let target = index;
        if (event.key === 'ArrowLeft') target = (index - 1 + tabButtons.length) % tabButtons.length;
        if (event.key === 'ArrowRight') target = (index + 1) % tabButtons.length;
        if (event.key === 'Home') target = 0;
        if (event.key === 'End') target = tabButtons.length - 1;
        activateTab(tabButtons[target].dataset.tab,true);
        tabButtons[target].focus();
      });
    });
    activateTab(currentTab,false);
    refreshProgress();
  }
  if (currentPage === 'inicio') renderOverview();
  else {
    const current = modules.find(m => m.slug === currentPage);
    if (current) renderModule(current);
    else { breadcrumb.textContent = 'Não encontrado';main.innerHTML = '<div class="page-container"><h1>Treinamento não encontrado</h1><a href="index.html">Voltar ao início</a></div>'; }
  }
})();
