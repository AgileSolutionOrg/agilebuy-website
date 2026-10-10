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


/* ==========================================================================
   O FORMULÁRIO DE CONTATO

   Manda para a nossa própria API, e não mais para o FormSubmit.

   Por quê: em 29/09/2026 o FormSubmit saiu do ar (HTTP 522/525 e depois sem
   resposta nenhuma) justamente no dia em que este site seria enviado ao
   primeiro cliente. Lead perdido não deixa rastro — a pessoa preenche, some, e
   ninguém fica sabendo que existiu. Dependência de terceiro no funil de vendas
   do próprio produto é risco sem contrapartida, e a gente tem backend.

   TRÊS CAMADAS, porque a única coisa inaceitável aqui é perder o contato:
     1. envia para a API;
     2. se a API estiver fora (erro de rede ou 5xx), cai no destino antigo do formulário
        (o action do HTML, FormSubmit). Timeout NÃO cai aqui — ver abaixo;
     3. se isso também falhar, abre o e-mail da pessoa com tudo preenchido e
        mostra o WhatsApp na tela. Nesse ponto o lead está nas mãos dela, mas
        ela SABE disso — que é infinitamente melhor que achar que enviou.
   ========================================================================== */
(function () {
  'use strict';

  var API = 'https://app.agilebuy.com.br/api/publico/leads';
  var DESTINO_OK = 'obrigado.html';
  var CONTATO = 'suporte@agilesolution.com.br';

  var form = document.querySelector('form.form');
  if (!form) return;

  var botao = form.querySelector('button[type=submit]');
  var textoOriginal = botao ? botao.textContent : '';

  function valor(nome) {
    var el = form.querySelector('[name="' + nome + '"]');
    return el ? String(el.value || '').trim() : '';
  }

  function avisar(texto, tipo) {
    var p = form.querySelector('.form__aviso');
    if (!p) {
      p = document.createElement('p');
      p.className = 'form__aviso';
      form.appendChild(p);
    }
    p.textContent = texto;
    p.setAttribute('role', 'status');
    p.dataset.tipo = tipo || 'info';
  }

  /* Último recurso: o lead vai pelo e-mail da própria pessoa, com tudo pronto. */
  function saidaDeEmergencia() {
    var corpo = [
      'Nome: ' + valor('Nome'),
      'Empresa: ' + valor('Empresa'),
      'E-mail: ' + valor('E-mail'),
      'WhatsApp: ' + valor('WhatsApp'),
      'ERP: ' + valor('ERP'),
      'Usuarios: ' + valor('Usuarios'),
      '',
      valor('Mensagem')
    ].join('\n');

    avisar('Não conseguimos enviar agora. Abrimos seu e-mail com tudo preenchido — '
         + 'ou fale direto com ' + CONTATO + '.', 'erro');

    window.location.href = 'mailto:' + CONTATO
      + '?subject=' + encodeURIComponent('AGILE BUY — contato pelo site')
      + '&body=' + encodeURIComponent(corpo);
  }

  function aoEnviar(e) {
    // Deixa a validação nativa do navegador agir antes de qualquer coisa.
    if (!form.checkValidity()) return;

    e.preventDefault();
    if (botao) { botao.disabled = true; botao.textContent = 'Enviando…'; }
    avisar('', 'info');

    var dados = {
      nome: valor('Nome'),
      empresa: valor('Empresa'),
      email: valor('E-mail'),
      telefone: valor('WhatsApp'),
      erp: valor('ERP'),
      usuarios: valor('Usuarios'),
      mensagem: valor('Mensagem'),
      origem: 'site',
      _honey: valor('_honey')
    };

    /* Um teto de tempo, para ninguem ficar olhando "Enviando..." para sempre.
       O que NAO se faz mais e reenviar pelo FormSubmit quando o teto estoura. Timeout nao quer
       dizer que a API nao recebeu: ela pode ter gravado o lead e so demorado a responder. Antes,
       com 12 s, isso virava DOIS leads (um na API, outro no FormSubmit). Agora:
         - erro de rede (a requisicao nem chegou) ou 5xx  -> segunda camada (FormSubmit);
         - 4xx (a API respondeu e recusou)                -> nao reenvia; pede para corrigir/escrever;
         - timeout                                        -> nao reenvia; avisa que o envio NAO foi
                                                             confirmado e oferece o e-mail, sem abrir
                                                             nada sozinho.
       O teto subiu para 25 s: e longo o bastante para uma API lenta terminar, e curto o
       bastante para a pessoa nao desistir sem saber o que aconteceu. */
    var relogio = new AbortController();
    var estourou = false;
    var teto = setTimeout(function () { estourou = true; relogio.abort(); }, 25000);

    function liberarBotao() {
      if (botao) { botao.disabled = false; botao.textContent = textoOriginal; }
    }

    function segundaCamada() {
      // O handler e removido pelo NOME. Antes estava `arguments.callee`, que e proibido em
      // modo estrito e teria estourado exatamente aqui.
      var antigo = form.getAttribute('data-fallback');
      if (!antigo) { saidaDeEmergencia(); return; }
      avisar('Reenviando por outro caminho…', 'info');
      form.setAttribute('action', antigo);
      form.removeEventListener('submit', aoEnviar);
      HTMLFormElement.prototype.submit.call(form);
    }

    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
      signal: relogio.signal
    })
      .then(function (r) {
        clearTimeout(teto);
        if (r.ok) { window.location.href = DESTINO_OK; return; }
        liberarBotao();
        if (r.status >= 500) { segundaCamada(); return; }
        avisar('Não conseguimos registrar o contato (erro ' + r.status + '). Confira os campos e '
             + 'tente de novo, ou escreva para ' + CONTATO + '.', 'erro');
      })
      .catch(function () {
        clearTimeout(teto);
        liberarBotao();
        if (estourou) {
          avisar('O envio demorou e não conseguimos confirmar se chegou. Para não duplicar, não '
               + 'reenviamos sozinhos: se não receber retorno, escreva para ' + CONTATO + '.', 'erro');
          return;
        }
        segundaCamada();   // erro de rede: a requisicao nao chegou a API
      });
  }

  form.addEventListener('submit', aoEnviar);
})();
