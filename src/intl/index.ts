import { join } from 'path'
import { readFileSync, readdirSync } from 'fs'
import type { WorkspaceFolder } from 'vscode'
import { workspace } from 'vscode'
import { INTL_FILE_RE, INTL_KEY_VALUE_RE } from '../constants'

class IntlFile {
  #config: Record<string, Record<string, string>> = {}

  constructor() {
    this.#init()
  }

  #updateConfig(key: string, value: Record<string, string>) {
    this.#config[key] = value
  }

  #value(id: string) {
    return this.#config['zh-CN' /** get config */][id]
  }

  #init() {
    const workspaceFolders: ReadonlyArray<WorkspaceFolder> | undefined = workspace.workspaceFolders

    if (!workspaceFolders)
      return

    const root = workspaceFolders[0]
    const path = join(root.uri.fsPath, 'src/locales' /** get config */)
    this.#readDir(path)
  }

  #readDir(path: string) {
    const dir = readdirSync(path)
    const fileNames = dir.filter((item: string) => INTL_FILE_RE.test(item))

    fileNames.forEach((item) => {
      const key = item.match(INTL_FILE_RE)![0]
      const values = this.#readFile(`${path}/${item}`)
      this.#updateConfig(key, values)
    })
  }

  #readFile(path: string) {
    const text = readFileSync(path, 'utf-8')
    const values: Record<string, string> = {}

    for (const match of text.matchAll(INTL_KEY_VALUE_RE))
      values[match[1]] = match[2]

    return values
  }

  get config() {
    return this.#config
  }

  public value(id: string) {
    return this.#value(id)
  }
}

const intl = new IntlFile()

export default intl
