import { workspace } from 'vscode'
import type { IUserConfig } from './types'

export const getUserConfig = () => {
  const config = workspace.getConfiguration('umi-intl')
  const localesPath = config.get('localesPath')
  const displayLanguage = config.get('displayLanguage')
  const autoDetection = config.get('autoDetection')
  return { localesPath, displayLanguage, autoDetection } as IUserConfig
}
