import { dialog, shell, app } from 'electron'
import { mainWindow } from '../main'

import * as fs from 'fs'
import * as path from 'path'

export function selectDirectory(file: string) {
  const result = dialog.showSaveDialogSync(mainWindow as Electron.BrowserWindow)

  if (result !== undefined) {
    fs.copyFile(
      path.resolve(app.getAppPath(), 'import', file),
      result + '.xls',
      err => {
        if (err) throw err
      }
    )

    setTimeout(() => {
      shell.openPath(result + '.xls')
    }, 300)
  }
}
