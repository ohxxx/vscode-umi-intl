import fs from 'fs'
import { join } from 'path'
import type { WorkspaceFolder } from 'vscode'
import { workspace } from 'vscode'

class PackageParser {
  public init() {
    const workspaceFolders: ReadonlyArray<WorkspaceFolder> | undefined = workspace.workspaceFolders

    if (!workspaceFolders)
      return false

    const root = workspaceFolders[0]
    const rootPath = join(root.uri.fsPath)

    const packageContent = fs.readFileSync(`${rootPath}/package.json`, 'utf8')
    const raw = JSON.parse(packageContent)
    return 'umi' in raw.dependencies
  }
}

const packageParser = new PackageParser()

export default packageParser
