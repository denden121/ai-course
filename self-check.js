/*
 * Спойлеры в блоке «Проверь себя» для статических страниц уроков.
 * Ответы заблюрены, пока по ним не кликнут. Состояние не сохраняется:
 * при перезагрузке страницы ответы снова блюрятся, а кликнутые остаются
 * видимыми до перезагрузки.
 */
(function () {
  function wrapAnswer(p) {
    if (p.querySelector('.qa-spoiler')) return;        // уже обёрнут
    var br = p.querySelector('br');
    if (!br) return;                                   // нет разделителя «вопрос/ответ»
    var span = document.createElement('span');
    span.className = 'qa-spoiler';
    span.setAttribute('role', 'button');
    span.setAttribute('tabindex', '0');
    span.setAttribute('aria-label', 'Показать ответ');
    span.title = 'Нажми, чтобы показать ответ';
    var node = br.nextSibling;
    while (node) {
      var next = node.nextSibling;
      span.appendChild(node);
      node = next;
    }
    if (!span.childNodes.length) return;               // после <br> ничего нет
    p.appendChild(span);
    var reveal = function () {
      span.classList.add('revealed');
      span.removeAttribute('tabindex');
      span.removeAttribute('role');
      span.removeAttribute('title');
      span.removeAttribute('aria-label');
    };
    span.addEventListener('click', reveal);
    span.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reveal(); }
    });
  }

  function init() {
    var headings = document.querySelectorAll('h2, h3');
    for (var i = 0; i < headings.length; i++) {
      var heading = headings[i];
      if (!/Провер[ья]\s+себя/i.test(heading.textContent)) continue;
      var el = heading.nextElementSibling;
      while (el && !/^H[1-3]$/.test(el.tagName)) {
        if (el.tagName === 'P') wrapAnswer(el);
        el = el.nextElementSibling;
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
