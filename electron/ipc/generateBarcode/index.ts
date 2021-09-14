import 'dotenv/config'

//@ts-ignore
import { mask } from 'remask'
import fs from 'fs'
import { dialog, shell } from 'electron'
import { mainWindow } from '../../main'
import path from 'path'
import XLSX from 'xlsx'
import Axios, { AxiosResponse } from 'axios'

interface Barcode {
  company: {
    cad: string
  }
  gtinStatusCode: string
  gs1TradeItemIdentificationKey: {
    gs1TradeItemIdentificationKeyCode: string
  }
  tradeItemDescriptionInformation: {
    tradeItemDescription: string
  }
  referencedFileInformations: {
    uniformResourceIdentifier: string
    referencedFileTypeCode: string
    featuredFile: boolean
  }[]
  brandNameInformation: {
    brandName: string
  }
  tradeItemMeasurements: {
    netContent: {
      measurementUnitCode: string
      value: number
    }
  }
  tradeItemClassification: {
    additionalTradeItemClassifications: {
      additionalTradeItemClassificationSystemCode: string
      additionalTradeItemClassificationCodeValue: string
    }[]
    gpcCategoryCode: string
  }
  tradeItem: {
    targetMarket: {
      targetMarketCountryCodes: string[]
    }
    tradeItemUnitDescriptorCode: string
  }
  placeOfProductActivity: {
    countryOfOrigin: {
      countrySubdivisionCodes: never[]
      countryCode: string
    }
  }
  additionalTradeItemIdentifications: {
    additionalTradeItemIdentificationTypeCode: string
    additionalTradeItemIdentificationValue: string
  }[]
  acceptResponsibility: boolean
  shareDataIndicator: boolean
  tradeItemWeight: {
    grossWeight: {
      measurementUnitCode: string
      value: number
    }
    netWeight: {
      measurementUnitCode: null
      value: null
    }
  }
  withoutCest?: boolean
}

interface BarcodeRecive {
  descricao: string
  referencia: string
  linkImagem: string
  marca: string
  pesoLiquido: string
  pesoBruto: string
  ncm: string
  cest?: string
  gpc: string
}

interface Authentication {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

interface AuthRecive {
  access_token: string
  client_id: string
}

interface ReponseBarcode {
  result: string
  product: {
    gtinStatusCode: string
    gs1TradeItemIdentificationKey: {
      gs1TradeItemIdentificationKeyCode: string
      gtin: string
    }
  }
  validations: never[]
}

interface ReponseBarcodeError {
  statusCode: number
  error: string
  message: string
}

interface BarcodeResponse extends BarcodeRecive {
  ean: string
  observação: string
  situação: string
}

const baseUrl = process.env.GS1_BASE_URL || ''
const clientId = process.env.GS1_CLIENT_ID || ''
const clientSecret = process.env.GS1_CLIENT_SECRET || ''
const username = process.env.GS1_USERNAME || ''
const password = process.env.GS1_PASSWORD || ''

async function normilized(pathFile: string) {
  const fileXLSX = XLSX.readFile(path.resolve(pathFile), {
    cellDates: true
  })
  const aba = fileXLSX.Sheets[fileXLSX.SheetNames[0]]
  const data = XLSX.utils.sheet_to_json(aba) as BarcodeRecive[]

  return data
}

async function authentication(): Promise<AxiosResponse<Authentication>> {
  const AuthRequest = Axios({
    method: 'post',
    url: `${baseUrl}/oauth/access-token`,
    headers: {
      client_id: clientId
    },
    auth: {
      username: clientId,
      password: clientSecret
    },
    data: {
      grant_type: 'password',
      username: username,
      password: password
    }
  })

  return new Promise((resolve, reject) => {
    AuthRequest.then(reponse => {
      resolve(reponse)
    }).catch(reponse => {
      reject(reponse)
    })
  })
}

async function generateBarcode(
  barcode: BarcodeRecive,
  auth: AuthRecive
): Promise<AxiosResponse<ReponseBarcode | ReponseBarcodeError | undefined>> {
  const {
    descricao,
    marca,
    linkImagem,
    pesoBruto,
    pesoLiquido,
    gpc,
    ncm,
    cest,
    referencia
  } = barcode

  const data: Barcode | any = {
    company: {
      cad: 'A10944'
    },
    gtinStatusCode: 'ACTIVE',
    gs1TradeItemIdentificationKey: {
      gs1TradeItemIdentificationKeyCode: 'GTIN_13'
    },
    tradeItemDescriptionInformation: {
      tradeItemDescription: descricao
    },

    referencedFileInformations: [
      {
        uniformResourceIdentifier: linkImagem,
        referencedFileTypeCode: 'PLANOGRAM',
        featuredFile: true
      }
    ],

    brandNameInformation: {
      brandName: marca
    },
    tradeItemMeasurements: {
      netContent: {
        measurementUnitCode: 'GRM',
        value: Number(pesoLiquido)
      }
    },
    tradeItemClassification: {
      additionalTradeItemClassifications: cest
        ? [
            {
              additionalTradeItemClassificationSystemCode: 'NCM',
              additionalTradeItemClassificationCodeValue: mask(ncm, [
                '9999.99.99'
              ])
            },
            {
              additionalTradeItemClassificationSystemCode: 'CEST',
              additionalTradeItemClassificationCodeValue: mask(cest, [
                '99.999.99'
              ])
            }
          ]
        : [
            {
              additionalTradeItemClassificationSystemCode: 'NCM',
              additionalTradeItemClassificationCodeValue: mask(ncm, [
                '9999.99.99'
              ])
            }
          ],
      gpcCategoryCode: String(gpc)
    },
    withoutCest: cest ? true : false,
    tradeItem: {
      targetMarket: {
        targetMarketCountryCodes: ['076']
      },
      tradeItemUnitDescriptorCode: 'BASE_UNIT_OR_EACH'
    },
    placeOfProductActivity: {
      countryOfOrigin: {
        countrySubdivisionCodes: [],
        countryCode: '076'
      }
    },
    additionalTradeItemIdentifications: [
      {
        additionalTradeItemIdentificationTypeCode: 'FOR_INTERNAL_USE_1',
        additionalTradeItemIdentificationValue: referencia
      }
    ],
    acceptResponsibility: true,
    shareDataIndicator: true,
    tradeItemWeight: {
      grossWeight: {
        measurementUnitCode: 'GRM',
        value: Number(pesoBruto)
      },
      netWeight: {
        measurementUnitCode: null,
        value: null
      }
    }
  }

  const Request = Axios({
    method: 'POST',
    url: `${baseUrl}/gs1/v0/products`,
    headers: {
      ['Content-Type']: 'application/json',
      ['client_id']: auth.client_id,
      ['access_token']: auth.access_token
    },
    data: data
  })

  return new Promise<any>((resolve, reject) => {
    Request.then(reponse => {
      resolve(reponse)
    }).catch(reponse => {
      reject(reponse)
    })
  })
}

export async function handle(file: string) {
  try {
    const auth = await authentication()
    const normilizedData = await normilized(file)

    var responseData: BarcodeResponse[] = []

    for (const item of normilizedData) {
      try {
        const responseSuccess = await generateBarcode(item, {
          access_token: auth.data.access_token,
          client_id: clientId
        })
        const { product } = responseSuccess.data as ReponseBarcode
        const newBarcode: BarcodeResponse = {
          situação: product.gtinStatusCode,
          ean: product.gs1TradeItemIdentificationKey.gtin,
          ...item,
          observação: ''
        }

        responseData.push(newBarcode)
      } catch (err) {
        console.log(err)

        if (err && err.response && err.response.data) {
          const { message } = err.response.data as ReponseBarcodeError
          const newBarcode: BarcodeResponse = {
            situação: 'ERRO',
            ean: '',
            ...item,
            observação: message
          }

          responseData.push(newBarcode)
        } else {
          const newBarcode: BarcodeResponse = {
            situação: 'ERRO',
            ean: '',
            ...item,
            observação: 'Error'
          }

          responseData.push(newBarcode)
        }
      }
    }

    const resultFilePath = dialog.showSaveDialogSync(
      mainWindow as Electron.BrowserWindow,
      {
        filters: [{ name: '', extensions: ['xls'] }]
      }
    )

    console.log(responseData)

    const newFile = XLSX.utils.book_new()
    const newAba = XLSX.utils.json_to_sheet(responseData)
    XLSX.utils.book_append_sheet(newFile, newAba, 'Plan1')

    if (resultFilePath !== undefined) {
      const split = resultFilePath.split('.')
      const nameFile =
        split[split.length - 1].toUpperCase() !== 'XLS'
          ? resultFilePath + '.xls'
          : resultFilePath

      XLSX.writeFile(newFile, nameFile)
      setTimeout(() => {
        shell.showItemInFolder(nameFile)
      }, 1000)
    }
  } catch (error) {
    console.log(error)
    return { message: 'Erro na autenticação', error: true }
  }
}
