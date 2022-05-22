import { getAllLocales, getLocale, setLocale, useIntl } from 'umi'
import styles from './index.less'

const LocalesComps = () => {
  const intl = useIntl()
  const currentLocale = getLocale()

  const handleLangChange = (value: string) => {
    setLocale(value)
  }
  return (
    <div className={styles.box}>
      <div className={styles.btnContent}>{
        getAllLocales().reverse().map((item: string) => {
          return (
            <button key={item} onClick={() => handleLangChange(item)}>
              {item}
            </button>
          )
        })
      }</div>
      <h3 className={styles.title}>当前语言：{currentLocale}</h3>
      <div className={styles.content}>
        <span>
        {intl.formatMessage(
          { id: 'WELCOME' },
          { name: 'xxx' },
        )}
        </span>
        <span>{intl.formatMessage({ id: 'title' })}</span>
        <span>{intl.formatMessage({ id: 'content' })}</span>
      </div>
    </div>
  )
}

export default function IndexPage() {
  return <LocalesComps/>
}
