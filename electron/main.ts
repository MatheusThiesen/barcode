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
}

app.on('ready', () => {
  registerListeners()
  createWindow()
  autoUpdater.checkForUpdatesAndNotify()
  createMenu()
})

app.allowRendererProcessReuse = true
