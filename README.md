# AGILE BUY — site comercial

Site de `agilebuy.com.br`. HTML, CSS e JavaScript puros, sem build e sem dependência — o mesmo
padrão do `agiletrade-website`, publicado por **GitHub Pages** a partir da branch `main`, raiz do
repositório. Custo zero.

```
index.html      a página
obrigado.html   retorno do formulário
styles.css      tokens do design system + estilos
script.js       menu do celular, ano do rodapé, animação do fluxo
CNAME           agilebuy.com.br
robots.txt      sitemap.xml
assets/         imagens e ícones
```

Para trabalhar: abra `index.html` no navegador. Não há servidor nem passo de build.

O design system que rege cores, tipografia, componentes e acessibilidade está em
`agile-portal/docs/AGILE_BUY_DESIGN_SYSTEM.md`.

---

## PENDÊNCIAS — o que falta para o site ficar completo

### 1. Arquivos da marca (bloqueante para a identidade)

A pasta `assets/` está **vazia** e o site hoje mostra apenas o logotipo em texto
(`AGILE BUY` + `COMPRAS INTELIGENTES`), sem o símbolo. Isso é deliberado: o símbolo do Agile Buy é
o infinito da Agile em violeta com o ponto vermelho da marca-mãe, e **recriá-lo em código seria
inventar a marca**. Enquanto o arquivo oficial não entra aqui, é melhor mostrar só a tipografia do
que mostrar um desenho parecido.

Colocar em `assets/`:

| Arquivo | Uso |
|---|---|
| `logo-agilebuy.svg` | topo e rodapé |
| `logo-agilebuy-claro.svg` | versão para fundo escuro |
| `favicon.png` (512×512) | aba do navegador |
| `apple-touch-icon.png` (180×180) | atalho no iPhone |
| `og-image.png` (1200×630) | pré-visualização no WhatsApp e redes |
| `logo-agile-solution.svg` | assinatura institucional no rodapé |

Depois de colocá-los, trocar no `index.html` o `<span class="marca__nome">` por `<img>` nos dois
lugares (topo e rodapé) e conferir o `og:image`.

**Sem o `og-image.png`, o link compartilhado no WhatsApp aparece sem imagem.** É o mesmo problema
que já apareceu em outro produto da casa: não é favicon, é Open Graph.

### 2. Ativar o FormSubmit (bloqueante para receber lead)

O formulário envia para `suporte@agilesolution.com.br` via FormSubmit. **O serviço só passa a
funcionar depois da primeira confirmação:** no primeiro envio, o FormSubmit manda um e-mail de
ativação para esse endereço, e alguém precisa clicar no link. Antes disso, nenhum lead chega.

Faça um envio de teste pelo site assim que ele estiver no ar e confirme o e-mail.

### 3. DNS no registro.br

Apontar `agilebuy.com.br` para o GitHub Pages:

```
A     @    185.199.108.153
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
CNAME www  agilesolutionorg.github.io
```

O arquivo `CNAME` deste repositório já contém `agilebuy.com.br`. Depois da propagação, ligue
**Enforce HTTPS** nas configurações de Pages do repositório.

### 4. Analytics e Search Console

Seguir o que o `agiletrade-website` já faz: GA4 e Google Search Console. Ainda não configurados
aqui.

---

## Regras de conteúdo

- **Nenhum case, depoimento, cliente ou percentual real inventado.** Todo número exibido é
  demonstrativo e está marcado como tal na própria página.
- Funcionalidade que ainda não existe no produto vai marcada como **Em evolução** (hoje: “Pergunte
  ao AGILE”) ou não vai.
- O site só publica o que o produto realmente faz. Quem entra pelo site e depois faz login precisa
  reconhecer o que viu.
