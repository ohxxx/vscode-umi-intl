import { INTL_FILE_RE, INTL_KEY_VALUE_RE } from './constants'
import type { TObj } from './types'
import { getUserConfig } from './config'
import { showErrorMsg } from './helpers'
import TextParser from './parsers/text'
import file from './file'

class IntlFile {
  #displayLanguage: string = getUserConfig().displayLanguage
  #config: Record<string, Record<string, string>> = {}

  #updateConfig(key: string, value: Record<string, string>) {
    this.#config[key] = value
  }

  #value(id: string) {
    return this.#config[this.#displayLanguage][id]
  }

  #values(id: string) {
    return Object
      .entries(this.#config)
      .reduce((acc, [key, values]) => {
        return { ...acc, ...{ [key]: values[id] } }
      }, {})
  }

  #readDir(path: string) {
    const dir = file.readDir(path)
    const fileNames = dir.filter((item: string) => INTL_FILE_RE.test(item))

    for (const fileName of fileNames) {
      const key = fileName.match(INTL_FILE_RE)![0]
      const values = this.#readFile(`${path}/${fileName}`)
      this.#updateConfig(key, values)
    }
  }

  #readFile(path: string) {
    let text = file.readFile(path)
    const values: TObj = {}

    if (!path.endsWith('.json'))
      text = new TextParser().parse(text, file.localesPath)

    for (const match of text.matchAll(INTL_KEY_VALUE_RE))
      values[match[1]] = match[2]

    return values
  }

  get config() {
    return this.#config
  }

  public init() {
    const isFileReady = file.init()

    if (isFileReady)
      this.#readDir(file.localesPath)
    else
      showErrorMsg('多语言文件夹不存在')

    return isFileReady
  }

  public value(id: string) {
    return this.#value(id)
  }

  public values(id: string) {
    return this.#values(id)
  }
}

const intlFile = new IntlFile()

export default intlFile
