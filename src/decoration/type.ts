import type { TextEditorDecorationType } from 'vscode'
import { window } from 'vscode'

class DecorationType {
  #hideDecorationType: TextEditorDecorationType
    = window.createTextEditorDecorationType({
      textDecoration: 'none; display: none;',
    })

  #underlineDecorationType: TextEditorDecorationType
    = window.createTextEditorDecorationType({
      textDecoration: 'underline;',
      cursor: 'pointer',
    })

  #tipDecorationType: TextEditorDecorationType
    = window.createTextEditorDecorationType({})

  get hide(): TextEditorDecorationType {
    return this.#hideDecorationType
  }

  get underline(): TextEditorDecorationType {
    return this.#underlineDecorationType
  }

  get tip(): TextEditorDecorationType {
    return this.#tipDecorationType
  }
}

const decorationType = new DecorationType()

export default decorationType
