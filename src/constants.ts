export const INTL_ID_RE = /(?<=\bformatMessage\(\s*\{\s*id:\s*['"`]).*?(?=['"`])/gmi

export const INTL_FILE_RE = /\b([a-zA-Z]+\-[a-zA-Z]+)(?=\.(json|js|ts))/i

export const INTL_KEY_VALUE_RE = /\b['"`]*(.*?)['"`]*:\s*['"`](.*?)['"`],*/gmi
