import { useEffect, useState } from 'react'
import styles from './EditProfile.module.sass'
import { useRef } from 'react'
import UserSettings from '../UserSettings/UserSettings'
import CloseIcon from '../CloseIcon/CloseIcon'
interface IEditProfile {
  userName?: string
  avatar?: string
  setEditOpened: any
}
const EditProfile = ({ userName, avatar, setEditOpened }: IEditProfile) => {
  const modalRef: any = useRef()
  const [nameValue, setNameValue] = useState('')
  const [nameLoading, setNameLoading] = useState(false)
  const [nameError, setNameError] = useState<boolean>(false)
  useEffect(() => {
    if (
      document.documentElement.clientHeight <
      document.documentElement.offsetHeight
    ) {
      document.documentElement.style.overflowY = 'scroll'
    }

    document.documentElement.style.position = 'fixed'

    return () => {
      document.documentElement.style.overflowY = 'auto'
      document.documentElement.style.position = ''
    }
  }, [])
  useEffect(() => {
    function handler(e: any) {
      if (e.target.contains(modalRef.current)) {
        setEditOpened(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
    }
  }, [])
  const closeModal = () => {
    setEditOpened(false)
  }
  return (
    <div className={styles.main}>
      <div ref={modalRef} className={styles.container}>
        <div className={styles.closeWrap}>
          <CloseIcon func={closeModal} />
        </div>
        <div className={styles.photo}>
          <div className={styles.left}>
            <div className={styles.image}>
              <UserSettings />
            </div>
          </div>
          <div className={styles.editPhoto}>Change avatar</div>
        </div>
        {/* <h3>Change username</h3> */}
        <div className={styles.name}>
          <input
            type="text"
            placeholder={userName}
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

export default EditProfile
