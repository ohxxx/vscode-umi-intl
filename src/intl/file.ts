import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import type { WorkspaceFolder } from 'vscode'
import { workspace } from 'vscode'

class File {
  #rootPath = ''

  public init() {
    const workspaceFolders: ReadonlyArray<WorkspaceFolder> | undefined = workspace.workspaceFolders

    if (!workspaceFolders)
      return

    const root = workspaceFolders[0]
    const path = join(root.uri.fsPath, 'src/locales' /** get config */)
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

  get rootPath() {
    return this.#rootPath
  }
}

const file = new File()

export default file
