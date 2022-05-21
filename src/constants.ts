/**
 * 多语言正则
 *   暂时只支持 {intl.formatMessage({ id: 'xxx' })}
 *   等完成最小闭环后补全
 */
export const INTL_RE = /(?<=\bformatMessage\(\s*\{\s*id:\s*['"`]).*?(?=['"`])/gmi
