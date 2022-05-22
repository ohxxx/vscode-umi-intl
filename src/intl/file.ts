import { readFileSync, readdirSync } from 'fs'

/** ... */
class File {
  public readDir(path: string) {
    const dir = readdirSync(path)
    return dir
  }

  public readFile(path: string) {
    const content = readFileSync(path, 'utf-8')
    return content
  }
}

export default File
