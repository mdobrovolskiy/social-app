import React from 'react'
import styles from './ErrorModal.module.sass'
const ErrorModal = ({ err }: any) => {
  return (
    <div className={styles.modal}>
      {err
        ? err
        : 'An error occured, please check your connection and try again'}
    </div>
  )
}

export default ErrorModal
