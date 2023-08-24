import React from 'react'
import styles from './CloseIcon.module.sass'
interface CloseIconI {
  func: () => void
}
const CloseIcon = ({ func }: CloseIconI) => {
  return (
    <div className={styles.closeDiv}>
      <div onClick={func} className={styles.close}>
        <div className={styles.closeItemLeft}></div>
        <div className={styles.closeItemRight}></div>
      </div>
    </div>
  )
}

export default CloseIcon
