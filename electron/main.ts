import 'dotenv/config'

import {
  app,
  BrowserWindow,
  nativeImage,
  Menu,
  shell,
  MenuItemConstructorOptions,
  ipcMain,
  dialog
} from 'electron'
import { autoUpdater } from 'electron-updater'
import * as path from 'path'
import * as url from 'url'
import { writeFile } from './ipc/genarateCaralog'
import * as generateBarcode from './ipc/generateBarcode'
import { selectDirectory } from './ipc/selectDirectory'

import i18n from '../i18n'
import {
  getWindowBounds,
  setWindowBounds
} from '../src/utils/windowBoundsController'

export let mainWindow: Electron.BrowserWindow | null

function createWindow() {
  const icon = nativeImage.createFromPath(`${app.getAppPath()}/build/icon.png`)

  if (app.dock) {
    app.dock.setIcon(icon)
  }

  mainWindow = new BrowserWindow({
    ...getWindowBounds(),
    icon,
    minWidth: 800,
    minHeight: 500,
    width: 800,
    height: 500,
    // frame: false,
    // transparent: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4000')
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'renderer/index.html'),
        protocol: 'file:',
        slashes: true
      })
    )
  }

  mainWindow.on('close', () => {
    setWindowBounds(mainWindow?.getBounds())
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

async function createMenu() {
  await i18n.loadNamespaces('applicationMenu')

  const template: MenuItemConstructorOptions[] = [
    // {
    //   label: 'Rocketredis',
    //   submenu: [
    //     {
    //       label: i18n.t('applicationMenu:newConnection'),
    //       accelerator: 'CmdOrCtrl+N',
    //       click: () => {
    //         mainWindow?.webContents.send('newConnection')
    //       }
    //     },
    //     {
    //       type: 'separator'
    //     },
    //     {
    //       label: i18n.t('applicationMenu:exit'),
    //       role: 'quit',
    //       accelerator: 'CmdOrCtrl+Q'
    //     }
    //   ]
    // },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: () => {
            shell.openExternal('https://github.com/matheusthiesen/catalog/')
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

async function registerListeners() {
  /**
   * This comes from bridge integration, check bridge.ts
   */
  ipcMain.on('message', (event, message) => {
    setTimeout(() => {
      console.log('heyyyy', message)

      event.reply('message-reply', 'pong')
    }, 2000)
  })

  ipcMain.on('select-dir', async event => {
    const result = await dialog.showOpenDialog(
      mainWindow as Electron.BrowserWindow,
      {
        properties: ['openDirectory']
      }
    )

    event.reply('selected-dir', result.filePaths[0])
  })

  ipcMain.on('download-default-file', async (_event, file) => {
    selectDirectory(file)
  })

  ipcMain.on('generate-catalog', async (event, props) => {
    try {
      await writeFile(props)

      event.returnValue = { error: false, generated: true }
    } catch (error) {
      event.returnValue = { error: true, description: error }
    }
  })

  ipcMain.on('generate-barcode', async (event, props) => {
    const {
      authentication,
      normilized,
      generateFile,
      generateBarcode: generateBarcodeFunc,
      clientId
    } = generateBarcode

    const auth = await authentication()
    const normilizedData = await normilized(props)

    var responseData: generateBarcode.BarcodeResponse[] = []

    for (const item of normilizedData) {
      try {
        const responseSuccess = await generateBarcodeFunc(item, {
          access_token: auth.data.access_token,
          client_id: clientId
        })

        const {
          product
        } = responseSuccess.data as generateBarcode.ReponseBarcode
        const newBarcode: generateBarcode.BarcodeResponse = {
          situação: product.gtinStatusCode,
          ean: product.gs1TradeItemIdentificationKey.gtin,
          ...item,
          observação: ''
        }

        responseData.push(newBarcode)
      } catch (error) {
        const err = error as any
        console.log(error)

        if (err && err.response && err.response.data) {
          const { message } = err.response
            .data as generateBarcode.ReponseBarcodeError
          const newBarcode: generateBarcode.BarcodeResponse = {
            situação: 'ERRO',
            ean: '',
            ...item,
            observação: message
          }

          responseData.push(newBarcode)
        } else {
          const newBarcode: generateBarcode.BarcodeResponse = {
            situação: 'ERRO',
            ean: '',
            ...item,
            observação: 'Error'
          }

          responseData.push(newBarcode)
        }
      }

      event.reply('generated-barcode', {
        total: normilizedData.length,
        progress: responseData.length,
        finished: normilizedData.length === responseData.length ? true : false,
        description: item.descricao
      })
    }

    const resultFilePath = dialog.showSaveDialogSync(
      mainWindow as Electron.BrowserWindow,
      {
        filters: [{ name: '', extensions: ['xls'] }]
      }
    )

    generateFile(resultFilePath, responseData)

    event.reply('generated-barcode', { finished: true })
  })
}

app.on('ready', () => {
  registerListeners()
  createWindow()
  autoUpdater.checkForUpdatesAndNotify()
  createMenu()
})

app.allowRendererProcessReuse = true
