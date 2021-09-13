import fs from 'fs'
import path from 'path'
import XLSX from 'xlsx'

import { dialog } from 'electron'
import { mainWindow } from '../../main'
import { CatalagoProps as CatalagoNormalized } from './templates'

import tamplates from './templates'

export interface GenarateCaralogProps {
  template: 'laMartina' | 'usPolo'
  pathImages: string
  pathFile: string
}

interface NormalizedDataProps {
  pathImages: string
  pathFile: string
}

interface CoresProps {
  tipo: number
  cor: string
  filename: string
}

interface CatalogoReciveProps {
  pagina: string
  tipo: string
  referencia: string
  caracteristicas: string
  grade: string
  composicao: string
  preco: string
  cor: string
  imagem: string
}

async function normalizedData(props: NormalizedDataProps) {
  const { pathFile, pathImages } = props
  const normalized: CatalagoNormalized[] = []

  const fileXLSX = XLSX.readFile(path.resolve(pathFile), {
    cellDates: true
  })
  const aba = fileXLSX.Sheets[fileXLSX.SheetNames[0]]
  const data = XLSX.utils.sheet_to_json(aba) as CatalogoReciveProps[]

  for (const item of data) {
    var isExist = normalized.filter(
      filter => filter.pagina === Number(item.pagina)
    )

    const image = path.resolve(pathImages, String(item.imagem))

    if (isExist[0]) {
      normalized.map(itemNormalized => {
        if (+itemNormalized.pagina === +isExist[0].pagina) {
          if (Number(item.tipo) === 1) {
            itemNormalized.fotoPrincipal = image
          }

          if (Number(item.tipo) === 2) {
            itemNormalized.fotoDetalhe = image
          }

          if (Number(item.tipo) === 3) {
            itemNormalized.cores.push({
              cor: String(item.cor),
              tipo: Number(item.tipo),
              filename: path.resolve(pathImages, String(item.imagem))
            })
          }
        }
      })
    } else {
      normalized.push({
        pagina: Number(item.pagina),
        grade: String(item.grade),
        caracteristicas: String(item.caracteristicas),
        composicao: String(item.composicao),
        preco: Number(item.preco),
        referencia: String(item.referencia),
        cor: String(item.cor),
        fotoPrincipal: Number(item.tipo) === 1 ? image : undefined,
        fotoDetalhe: Number(item.tipo) === 2 ? image : undefined,
        staticImage: Number(item.tipo) === 4,
        fotoStatic: image,
        pathFile: pathImages,
        cores:
          Number(item.tipo) === 3
            ? [
                {
                  cor: String(item.cor),
                  tipo: Number(item.tipo),
                  filename: image
                }
              ]
            : []
      })
    }
  }

  return normalized
}

export async function writeFile(data: GenarateCaralogProps) {
  const { template, pathFile, pathImages } = data

  const result = dialog.showSaveDialogSync(mainWindow as Electron.BrowserWindow)

  const normalized = await normalizedData({
    pathFile,
    pathImages
  })

  const HTML = tamplates[template](normalized)

  if (result !== undefined) {
    fs.writeFile(result + '.html', HTML, err => {
      if (err) console.log(err)
    })
  }
}
