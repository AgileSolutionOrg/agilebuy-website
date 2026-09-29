/* AGILE BUY — site comercial.
   Só o indispensável: menu do celular, ano do rodapé e a animação do fluxo.
   Sem dependência externa, sem build. */

(function () {
  'use strict';

  // --- menu do celular -----------------------------------------------------
  var botao = document.getElementById('menu');
  var nav = document.getElementById('nav');

  if (botao && nav) {
    botao.addEventListener('click', function () {
      var aberto = nav.classList.toggle('aberto');
      botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    });

    // Clicar num item fecha a gaveta — senão ela cobre a seção que acabou de abrir.
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('aberto');
        botao.setAttribute('aria-expanded', 'false');
        botao.setAttribute('aria-label', 'Abrir menu');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('aberto')) {
        nav.classList.remove('aberto');
        botao.setAttribute('aria-expanded', 'false');
        botao.focus();
      }
    });
  }

  // --- ano do rodapé -------------------------------------------------------
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  // --- animação do fluxo ---------------------------------------------------
  // A informação percorre as etapas uma vez, quando a faixa entra na tela.
  // Respeita quem pediu menos movimento no sistema, e não fica em laço eterno:
  // é software B2B, não vitrine.
  var trilha = document.getElementById('trilha');
  if (!trilha) return;

  var menosMovimento = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var etapas = trilha.querySelectorAll('.etapa');
  if (menosMovimento) {
    for (var i = 0; i < etapas.length; i++) etapas[i].classList.add('on');
    return;
  }

  function percorrer() {
    etapas.forEach(function (etapa, i) {
      setTimeout(function () { etapa.classList.add('on'); }, i * 260);
    });
  }

  if (!('IntersectionObserver' in window)) { percorrer(); return; }

  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        percorrer();
        observador.disconnect();
      }
    });
  }, { threshold: 0.4 });

  observador.observe(trilha);
})();
