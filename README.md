# FisioLab — Portal de Treinamentos de Fisioterapia

Portal estático, responsivo, para publicação no GitHub Pages. Não usa servidor, autenticação, serviços pagos ou banco de dados.

## Conteúdo

| Página | Resumo DOCX | Mapa mental PDF | Podcast MP3 |
| --- | :---: | :---: | :---: |
| `oxigenoterapia.html` | Sim | Sim | Sim |
| `vni.html` | Sim | Sim | Sim |
| `via-aerea-artificial.html` | Sim | Sim | Sim |
| `pcr.html` | Sim | Sim | Sim |
| `cnaf.html` | Sim | Sim | Não foi fornecido |
| `ventilacao-mecanica.html` | Sim | Sim | Sim |

O texto dos seis resumos foi incorporado no site para leitura sem abrir o Word. Os 17 arquivos originais continuam acessíveis nas pastas de materiais.

## Como publicar no GitHub

1. Extraia o ZIP deste projeto no computador.
2. Entre em https://github.com e crie um repositório, por exemplo `treinamentos-fisioterapia`.
3. Entre no repositório e clique em **Add file → Upload files**. Arraste **o conteúdo da pasta extraída**, incluindo `index.html`, os outros `.html`, `app.js`, `estilos.css`, `conteudos.js` e a pasta `materiais`. Não envie apenas o ZIP, porque o GitHub Pages não vai descompactá-lo automaticamente.
4. Clique em **Commit changes** para confirmar os arquivos no ramo `main`.
5. Entre em **Settings → Pages**.
6. Em **Build and deployment**, selecione **Source: Deploy from a branch** e depois **Branch: main** e **Folder: /(root)**. Salve.
7. Após a publicação, o site ficará em um endereço no formato `https://USUARIO.github.io/NOME-DO-REPOSITORIO/`.

**Importante:** o arquivo `index.html` deve estar na raiz do repositório, não dentro de uma segunda pasta `portal_treinamentos`.

## Estrutura

```text
index.html
oxigenoterapia.html
vni.html
via-aerea-artificial.html
pcr.html
cnaf.html
ventilacao-mecanica.html
estilos.css
app.js
conteudos.js
favicon.svg
.nojekyll
atualizar_resumos.py
materiais/
  oxigenoterapia/
    resumo.docx
    mapa-mental.pdf
    podcast.mp3
  vni/
    resumo.docx
    mapa-mental.pdf
    podcast.mp3
  via-aerea-artificial/
    resumo.docx
    mapa-mental.pdf
    podcast.mp3
  pcr/
    resumo.docx
    mapa-mental.pdf
    podcast.mp3
  cnaf/
    resumo.docx
    mapa-mental.pdf
  ventilacao-mecanica/
    resumo.docx
    mapa-mental.pdf
    podcast.mp3
```

## Personalização e atualização

- **Nome no cabeçalho e rodapé:** edite os textos `FISIOLAB` e `Fisiolab` dos arquivos `.html` e o rodapé em `estilos.css`, se necessário.
- **Cores e layout:** edite `estilos.css`. O site não depende de bibliotecas externas.
- **Substituir PDF ou áudio:** troque os arquivos mantendo os mesmos nomes e localizações. Exemplo: `materiais/vni/podcast.mp3`.
- **Atualizar o Word original e o texto exibido na página:** substitua `materiais/<modulo>/resumo.docx`, execute `python -m pip install python-docx` e depois `python atualizar_resumos.py`. Envie o novo `conteudos.js` e o Word atualizado ao GitHub.
- **Adicionar novos treinamentos:** requer cadastrar o novo módulo no arquivo `conteudos.js`, adicionar a respectiva página `.html` e o link na navegação. É possível automatizar essa expansão numa próxima versão.
- **Barra de progresso:** usa `localStorage`; o status de conclusão é individual por navegador/dispositivo. Sem servidor, ele **não** é compartilhado com a coordenação nem constitui um registro formal de capacitação.

## Limitações e cuidados

Os arquivos PDF são abertos no visualizador de PDF disponível em cada navegador. Se o visualizador incorporado não funcionar no celular, os botões de abrir e baixar continuam disponíveis.

**Segurança e confidencialidade:** o GitHub Pages normalmente publica um site acessível publicamente. Antes de disponibilizar conteúdos assistenciais, verifique autorizações de publicação, dados pessoais e direitos de uso de documentos e áudios. O conteúdo dos materiais foi reproduzido dos arquivos fornecidos, sem validação clínica independente. A prática deve seguir os protocolos assistenciais vigentes.
