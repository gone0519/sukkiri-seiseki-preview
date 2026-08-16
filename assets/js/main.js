/* ==========================================================================
   スッキリ整骨院 聖蹟桜ヶ丘院 — main.js
   ・ハンバーガーメニュー
   ・ヘッダーの影 / 追従CTAの表示制御
   ・スクロールでのフェードイン
   ・FAQ アコーディオン（同時に1つだけ開く）
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- ハンバーガーメニュー ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function closeNav() {
    if (!nav || !burger) return;
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'メニューを開く');
    document.body.style.overflow = '';
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var willOpen = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', willOpen);
      burger.setAttribute('aria-expanded', String(willOpen));
      burger.setAttribute('aria-label', willOpen ? 'メニューを閉じる' : 'メニューを開く');
      document.body.style.overflow = willOpen ? 'hidden' : '';
    });

    // メニュー内のリンクを押したら閉じる
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    // Esc で閉じる
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    // PC幅に戻ったら状態をリセット
    var mq = window.matchMedia('(min-width: 1180px)');
    var onMq = function (e) { if (e.matches) closeNav(); };
    if (mq.addEventListener) mq.addEventListener('change', onMq);
    else if (mq.addListener) mq.addListener(onMq);
  }

  /* ---------- ヘッダーの影 / 追従CTA ---------- */
  var hd = document.getElementById('hd');
  var follow = document.getElementById('follow');
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;

    if (hd) hd.classList.toggle('is-scrolled', y > 10);

    if (follow) {
      // FV を通り過ぎたら表示、フッターに到達したら隠す
      var docH = document.documentElement.scrollHeight;
      var nearBottom = y + window.innerHeight > docH - 160;
      var show = y > window.innerHeight * 0.6 && !nearBottom;
      follow.classList.toggle('is-visible', show);
      follow.setAttribute('aria-hidden', String(!show));
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  /* ---------- スクロールでのフェードイン ---------- */
  var targets = document.querySelectorAll('[data-reveal]');

  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // 同じグループ内での並び順に応じて少しずつ遅らせる
        var group = el.closest('[data-reveal-group]');
        var delay = 0;
        if (group) {
          var siblings = group.querySelectorAll('[data-reveal]');
          delay = Math.min(Array.prototype.indexOf.call(siblings, el), 8) * 70;
        }
        el.style.transitionDelay = delay + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
  }

  /* ---------- FAQ：同時に1つだけ開く ---------- */
  var faqItems = document.querySelectorAll('.faq__item');
  Array.prototype.forEach.call(faqItems, function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      Array.prototype.forEach.call(faqItems, function (other) {
        if (other !== item) other.open = false;
      });
    });
  });
})();
