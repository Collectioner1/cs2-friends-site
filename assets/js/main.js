(function () {
  'use strict';

  document.documentElement.classList.add('js');
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  /* Уведомления */
  const toast = $('#toast');
  let toastTimer;
  function showToast(text) {
    toast.textContent = text;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2800);
  }

  /* Мобильное меню */
  const burger = $('#burger');
  const nav = $('#nav');

  function closeNav() {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }

  burger.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });

  $$('a', nav).forEach((link) => link.addEventListener('click', closeNav));
  document.addEventListener('click', (event) => {
    if (nav.classList.contains('is-open') && !nav.contains(event.target) && !burger.contains(event.target)) closeNav();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNav();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeNav();
  });

  /* Фильтр матчей */
  const tabs = $$('.tab');
  const matches = $$('.match');
  const matchEmpty = $('#matchEmpty');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
      });

      let visible = 0;
      matches.forEach((match) => {
        const show = match.dataset.type === tab.dataset.tab;
        match.hidden = !show;
        if (show) visible++;
      });
      matchEmpty.hidden = visible > 0;
    });
  });

  /* Раскрытие заметок */
  $$('[data-news-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.news-card');
      const open = card.classList.toggle('is-open');
      button.textContent = open ? 'Свернуть ↑' : 'Читать заметку →';
    });
  });

  /* Копирование приглашения */
  const inviteText = 'Присоединяйся к NEXUS: Discord @nexus-cs2, Telegram @nexus_cs2. Ищем Sixth игрока в команду друзей по CS2.';

  async function copyInvite() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(inviteText);
      } else {
        const field = document.createElement('textarea');
        field.value = inviteText;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        document.execCommand('copy');
        field.remove();
      }
      showToast('Приглашение скопировано');
    } catch (error) {
      showToast('Не удалось скопировать — используйте контакты в подвале');
    }
  }

  $$('#copyInvite, #copyInviteFooter, [data-copy-invite]').forEach((button) => {
    button.addEventListener('click', copyInvite);
  });

  /* Демонстрационная заявка */
  $('#joinForm').addEventListener('submit', (event) => {
    event.preventDefault();
    event.target.reset();
    showToast('Заявка принята (демонстрация). Мы свяжемся!');
  });

  /* Появление блоков при прокрутке */
  const revealItems = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }
})();
