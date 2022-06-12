import { INTL_FILE_RE, INTL_KEY_VALUE_RE } from '../constants'
import type { TObj } from '../types'
import { getUserConfig } from '../config'
import { showErrorMsg } from '../helpers'
import BaseParser from '../parsers/base'
import file from './file'

class Intl {
  #displayLanguage: string = getUserConfig().displayLanguage
  #config: Record<string, Record<string, string>> = {}

  #updateConfig(key: string, value: Record<string, string>) {
    this.#config[key] = value
  }

  #value(id: string) {
    return this.#config[this.#displayLanguage][id]
  }

  #values(id: string) {
    const result = Object
      .entries(this.#config)
      .reduce((acc, [key, values]) => {
        return { ...acc, ...{ [key]: values[id] ?? '-' } }
      }, {})

    const isExists = Object.values(result).every(v => v === '-')

    return isExists ? null : result
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
      text = new BaseParser().parse(text, file.localesPath)

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

  /** @TODO */
  public reloadFile(_path: string) {
    // const lang = path.match(INTL_FILE_RE)![0]
    // const values = this.#readFile(path)
  }

  public value(id: string) {
    return this.#value(id)
  }

  public values(id: string) {
    return this.#values(id)
  }
}

const intl = new Intl()

export default intl
