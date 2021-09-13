import { app } from 'electron'
import { CatalagoProps } from '../index'
import path from 'path'

export interface CoresProps {
  tipo: number
  cor: string
  filename: string
}

export function generateHtml(data: CatalagoProps[]) {
  function generateCores(cores: CoresProps[]) {
    var CORES = ''

    for (const cor of cores) {
      CORES += `
                <div class="container-image-color">
                  <img class="image-color" src="${cor.filename}" />
                    <div>
                      <span>${cor.cor}</span>
                    </div>
                </div>
                `
    }

    return CORES
  }
  function genatePaginas() {
    var PAGINAS = ''

    for (const pagina of data) {
      if (pagina.staticImage) {
        PAGINAS += `
        <div class="page">
          <img class="image-default" src="${pagina.fotoStatic}" />
        </div>
        `
      } else {
        PAGINAS += `
      <div class="page">
      <header class="header">
        <img src="${path.resolve(
          pagina.pathFile,
          'cabecalho.png'
        )}" alt="Cabecalho" />
      </header>
      <div class="content">
        <div class="container-main">
          <div class="content-main">
            <img class="image-main" src="${pagina.fotoPrincipal}" />
            <div class="container-texts">
              <span>REFERÊNCIA : <b>${pagina.referencia}</b></span>
              <span
                >CARACTERÍSTICAS: <b>${pagina.caracteristicas}</b></span>
            </div>
          </div>
          <div class="content-main">
            <img class="image-main" src="${pagina.fotoDetalhe}" />
            <div class="container-texts">
              <span>GRADE : <b>${pagina.grade}</b></span>
              <span>COMPOSIÇÃO: <b>${pagina.composicao}</b></span>
              <span>PREÇO: <b>${Number(pagina.preco).toLocaleString('pt-br', {
                style: 'currency',
                currency: 'BRL'
              })}</b></span>
            </div>
            <div class="container-float-color">
              <span>COR: <b>${pagina.cor}</b></span>
            </div>
          </div>
        </div>

        <div class="container-colors">
          ${generateCores(pagina.cores)}
        </div>
      </div>
      <footer class="footer">
        <img src="${path.resolve(
          pagina.pathFile,
          'rodape.png'
        )}" alt="Rodape" />
      </footer>
    </div>
      `
      }
    }

    return PAGINAS
  }

  const HTML = `
  <html>
  <head>
    <meta charset="utf8" />
    <title>Catalogo</title>
    <style>
      * {
        --cor-principal: #000;
      }

      html,
      body {
        margin: 0;
        padding: 0;

        font-family: sans-serif;
        font-weight: 500;

        background: rgb(200, 200, 200);
        -webkit-print-color-adjust: exact;
        box-sizing: border-box;
      }

      .page {
        position: relative;
        height: 297mm;
        width: 210mm;

        background: #fff;
        page-break-after: auto;
        margin: auto;
        margin-top: 50px;
        margin-bottom: 50px;
        overflow: hidden;
      }

      @media print {
        body {
          background: transparent;
        }

        .page {
          margin: 0;
          height: 100%;
          width: 100%;
        }
      }

      .image-default {
        position: relative;
        height: 100%;
        margin: auto;
      }

      .header {
        height: 10%;
        width: 100%;
      }
      .header > img {
        width: 100%;
        max-height: 100%;
        margin-top: 2mm;
      }

      .footer {
        width: 100%;
        height: 6%;
      }
      .footer > img {
        width: 100%;
        max-height: 100%;
        margin-bottom: 3mm;
      }

      .content {
        width: 100%;
        height: 84%;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .container-main {
        width: 80%;
        height: 55%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr;
        column-gap: 8mm;
      }

      .container-main > .content-main {
        display: flex;
        flex-direction: column;
        position: relative;
      }

      .container-float-color {
        position: absolute;
        top: 2mm;
        right: 2mm;
      }
      .container-float-color > span {
        font-size: 0.8rem;
        color: var(--cor-principal);
      }

      .content-main > .image-main {
        max-width: 100%;
        max-height: 80%;

        border: 1.6px solid var(--cor-principal);
      }

      .content-main > .container-texts {
        height: 20%;

        display: flex;
        justify-content: space-evenly;
        flex-direction: column;

        font-size: 0.9rem;
        color: var(--cor-principal);
      }

      .container-colors {
        width: 80%;
        height: 45%;

        display: grid;
        grid-template-columns: 30mm 30mm 30mm 30mm;
        grid-template-rows: 1fr 1fr;
        justify-content: space-between;
        row-gap: 4mm;
      }

      .container-image-color {
        width: 100%;
      }

      .container-image-color > img {
        width: 100%;
        max-height: 90%;
        border: 1.6px solid var(--cor-principal);
      }

      .container-image-color > div {
        padding: 6px 0 0 0;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .container-image-color > div > span {
        font-size: 0.8rem;
        font-weight: 700;
        margin: auto;
        color: var(--cor-principal);
      }
    </style>
  </head>
  <body>
    ${genatePaginas()}
  </body>
</html>

  `

  return HTML
}
