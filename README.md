# AGILE BUY — site comercial

Site de `agilebuy.com.br`. HTML, CSS e JavaScript puros, sem build e sem dependência — o mesmo
padrão do `agiletrade-website`, publicado por **GitHub Pages** a partir da branch `main`, raiz do
repositório. Custo zero.

```
index.html        a página
seguranca.html    ficha de segurança e arquitetura para o TI do cliente
privacidade.html  Política de Privacidade (LGPD)
termos.html       Termos de Uso do site
obrigado.html     retorno do formulário
styles.css        tokens do design system + estilos
script.js         menu do celular, ano do rodapé, animação do fluxo, envio do formulário
CNAME             agilebuy.com.br
robots.txt        sitemap.xml
assets/           marca, ícones e imagem de compartilhamento
```

Para trabalhar: abra `index.html` no navegador. Não há servidor nem passo de build.

O design system que rege cores, tipografia, componentes e acessibilidade está em
`agile-portal/docs/AGILE_BUY_DESIGN_SYSTEM.md`.

---

## PENDÊNCIAS — o que falta para o site ficar completo

### 1. Dados da empresa nas páginas legais (bloqueante antes de mostrar a cliente)

O rodapé de todas as páginas, a Política de Privacidade, os Termos e a ficha de segurança têm
campos entre colchetes, destacados em amarelo (classe `.ph`). **Nenhum foi inventado** — precisam
vir do contrato social e de quem cuida da infraestrutura:

| Campo | Onde |
|---|---|
| `[RAZÃO SOCIAL]`, `[CNPJ]`, `[ENDEREÇO]` | rodapé (todas as páginas), privacidade, termos |
| `[E-MAIL DO ENCARREGADO]`, `[NOME DO ENCARREGADO]` | rodapé, privacidade, segurança |
| `[REGIÃO DO DATACENTER]` | privacidade, segurança |
| `[PROVEDOR DE E-MAIL]`, `[PAÍS DO PROVEDOR DE E-MAIL]` | privacidade |
| `[PRAZO DE RETENÇÃO DOS CONTATOS]`, `[POLÍTICA DE BACKUP]` | privacidade, segurança |
| `[COMARCA DO FORO]` | termos |

Para achar o que falta: `grep -n "class=\"ph\"" *.html`. Quando todos estiverem preenchidos, a
classe `.ph` pode sair do `styles.css`.

### 2. O formulário de contato

O envio vai para a nossa API (`https://app.agilebuy.com.br/api/publico/leads`). O FormSubmit
(`suporte@agilesolution.com.br`) ficou só como **segunda camada**: usado quando a API está fora
(erro de rede ou 5xx) e para quem está sem JavaScript. Timeout **não** reenvia — a API pode ter
gravado e só demorado, e reenviar duplicava o lead. Detalhes no comentário do `script.js`.

O FormSubmit só entrega depois que o e-mail de ativação for confirmado em
`suporte@agilesolution.com.br`. Enquanto ele existir, ele aparece como suboperador na Política de
Privacidade; se for removido, tirar de lá também.

O **Entrar** e a API do formulário dependem de `app.agilebuy.com.br` estar no ar. Não aponte o
Entrar para o Portal da Agile: o Agile Buy é aplicação própria, vendida a quem não tem conta lá.

### 3. DNS no registro.br

Apontar `agilebuy.com.br` para o GitHub Pages:

```
A     @    185.199.108.153
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
CNAME www  agilesolutionorg.github.io
```

O arquivo `CNAME` deste repositório já contém `agilebuy.com.br`.

**Apague qualquer outro registro A ou AAAA da zona.** Em 29/09 a zona subiu com quatro registros
extras (`200.160.0.14`, `200.192.232.14` e dois IPv6) que **não respondem** — o navegador sorteia
um dos oito e, caindo num morto, espera o tempo de conexão antes de tentar outro. Só os quatro
`185.199.*` devem ficar.

Depois disso o GitHub emite o certificado e o **Enforce HTTPS** pode ser ligado.

### 4. Analytics e Search Console

Ainda não configurados — e a Política de Privacidade hoje afirma que o site **não usa cookies nem
analytics**. Se entrar GA4 (ou qualquer medição), a política muda **antes** do script ir ao ar, e
passa a ser preciso um aviso de consentimento de cookies.

---

## Regras de conteúdo

- **Nenhum case, depoimento, cliente ou percentual real inventado.** Todo número exibido é
  demonstrativo e está marcado como tal na própria página.
- Funcionalidade que ainda não existe no produto vai marcada como **Em evolução** (hoje: “Pergunte
  ao AGILE”) ou não vai.
- O site só publica o que o produto realmente faz. Quem entra pelo site e depois faz login precisa
  reconhecer o que viu.
- As páginas legais e a ficha de segurança descrevem o que existe. Mudou suboperador (hospedagem,
  e-mail, formulário), passou a gravar cookie ou mudou o que o agente faz no ERP? Atualize
  `privacidade.html`/`seguranca.html` e a data “Última atualização” no mesmo commit.
