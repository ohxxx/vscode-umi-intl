import { getLocale, setLocale, useIntl } from 'umi'
import styles from './index.less'

const LocalesComps = () => {
  const intl = useIntl()
  const currentLocale = getLocale()

  const handleLangChange = () => {
    setLocale(currentLocale === 'en-US' ? 'zh-CN' : 'en-US')
  }
  return (
    <div className={styles.box}>
      <button className={styles.btn} onClick={handleLangChange}>修改语言</button>
      <h3 className={styles.title}>当前语言：{currentLocale}</h3>
      <div className={styles.text}>
        {intl.formatMessage(
          { id: 'WELCOME' },
          { name: 'xxx' },
        )}
      </div>
    </div>
  )
}

export default function IndexPage() {
  return <LocalesComps/>
}
