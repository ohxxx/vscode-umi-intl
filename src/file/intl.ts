import { join } from 'path'
import { readFileSync, readdirSync } from 'fs'
import type { WorkspaceFolder } from 'vscode'
import { workspace } from 'vscode'

class IntlFile {
  #config: Record<string, Record<string, string>> = {}

  constructor() {
    this.#init()
  }

  #init() {
    const workspaceFolders: ReadonlyArray<WorkspaceFolder> | undefined = workspace.workspaceFolders
    if (workspaceFolders) {
      const root = workspaceFolders[0]
      const path = join(root.uri.fsPath, 'src/locales')
      this.#readDir(path)
      /** ... */
      // this.#readFile(`${path}/zh-CN.ts`)
    }
  }

  #readDir(path: string) {
    const dir = readdirSync(path)
    console.warn('xxx#dir', dir)
    /** ... */
  }

  #readFile(path: string) {
    const fileData = readFileSync(path, 'utf-8')
    console.warn('xxx#path', fileData)
    /** ... */
  }

  get config() {
    return this.#config
  }
}

const intl = new IntlFile()

export default intl
