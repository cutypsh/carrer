(() => {
  'use strict';
  document.body.classList.add('js-ready');
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const closeMenu = () => {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', '메뉴 열기');
    nav.classList.remove('open');
  };
  toggle?.addEventListener('click', () => {
    const opened = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(opened));
    toggle.setAttribute('aria-label', opened ? '메뉴 닫기' : '메뉴 열기');
    nav?.classList.toggle('open', opened);
  });
  nav?.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (header && !header.contains(event.target)) closeMenu();
  });
  window.matchMedia('(min-width: 701px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-category]')];
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    cards.forEach(card => {
      const show = button.dataset.filter === 'all' || card.dataset.category === button.dataset.filter;
      card.hidden = !show;
      if (show) count++;
    });
    const status = document.querySelector('#filter-status');
    if (status) status.textContent = `${button.textContent.replace(/\d+/g, '').trim()} 프로젝트 ${count}개를 표시합니다.`;
  }));

  const planButtons = [...document.querySelectorAll('[data-plan]')];
  const planPanels = [...document.querySelectorAll('[data-plan-panel]')];
  if (planButtons.length) {
    const showPlan = value => {
      planButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.plan === value)));
      planPanels.forEach(panel => { panel.hidden = panel.dataset.planPanel !== value; });
    };
    showPlan('30');
    planButtons.forEach(button => button.addEventListener('click', () => showPlan(button.dataset.plan)));
  }

  document.querySelectorAll('[data-print]').forEach(button => {
    button.addEventListener('click', () => window.print());
  });

  const strengthButtons = [...document.querySelectorAll('[data-strength]')];
  const strengthPanels = [...document.querySelectorAll('[data-strength-panel]')];
  if (strengthButtons.length) {
    const showStrength = (value, announce = false) => {
      strengthButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.strength === value)));
      strengthPanels.forEach(panel => {
        const selected = panel.dataset.strengthPanel === value;
        panel.hidden = !selected;
        panel.classList.toggle('is-entering', selected);
      });
      const selectedButton = strengthButtons.find(button => button.dataset.strength === value);
      const jump = document.querySelector('#strength-panel-jump');
      if (jump && selectedButton) {
        jump.setAttribute('href', `#strength-panel-${value}`);
        jump.querySelector('[data-strength-jump-label]').textContent = `${selectedButton.querySelector('strong').textContent} 경험 보기`;
      }
      if (announce) {
        const selected = strengthButtons.find(button => button.dataset.strength === value);
        const status = document.querySelector('#strength-status');
        if (status && selected) status.textContent = `${selected.querySelector('strong').textContent} 관련 경험을 표시합니다.`;
      }
    };
    showStrength('market');
    strengthButtons.forEach((button, index) => {
      button.addEventListener('click', () => showStrength(button.dataset.strength, true));
      button.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % strengthButtons.length;
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + strengthButtons.length) % strengthButtons.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = strengthButtons.length - 1;
        else return;
        event.preventDefault();
        strengthButtons[next].focus();
        showStrength(strengthButtons[next].dataset.strength, true);
      });
    });
  }

  const sectionLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  if (sectionLinks.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach(link => {
          if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    sectionLinks.forEach(link => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) observer.observe(target);
    });
  }
})();
