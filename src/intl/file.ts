import { existsSync, readFileSync, readdirSync } from 'fs'
import { extname, join } from 'path'
import type { WorkspaceFolder } from 'vscode'
import { workspace } from 'vscode'
import { getUserConfig } from '../config'

class File {
  #rootPath = ''

  public init() {
    const workspaceFolders: ReadonlyArray<WorkspaceFolder> | undefined = workspace.workspaceFolders

    if (!workspaceFolders)
      return

    const root = workspaceFolders[0]
    const localesPath = getUserConfig().localesPath
    const path = join(root.uri.fsPath, localesPath)
    this.#rootPath = path
  }

  public readDir(path: string) {
    const dir = readdirSync(path)
    return dir
  }

  public readFile(path: string) {
    const content = readFileSync(path, 'utf-8')
    return content
  }

  public exists(path: string) {
    const isExists = existsSync(path)
    return isExists
  }

  public createPath = (relpath: string, dirname: string) => {
    let abspath = relpath
    if (/^./.test(relpath))
      abspath = join(dirname, relpath)

    return this.revisePath(abspath)
  }

  public revisePath = (abspath: string) => {
    if (extname(abspath) && this.exists(abspath))
      return { dir: abspath.substring(0, abspath.lastIndexOf('.')), path: abspath }

    const suffixSet = ['.ts', '.js', '.json', '/index.ts', '/index.js']
    const idx = suffixSet.findIndex((suffix: string) => this.exists(`${abspath}${suffix}`))
    const fullpath = idx > -1 ? `${abspath}${suffixSet[idx]}` : null

    return {
      dir: abspath,
      path: fullpath,
    }
  }

  get rootPath() {
    return this.#rootPath
  }
}

const file = new File()

export default file
