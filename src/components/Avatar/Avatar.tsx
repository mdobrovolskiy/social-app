import styles from './Avatar.module.sass'
import { useState } from 'react'
interface IAvatar {
  img?: string
  profileEdit?: boolean
}
const Avatar = ({ img, profileEdit }: IAvatar) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const handleLoad = () => {
    setImageLoaded(true)
  }
  return (
    <div style={profileEdit ? { opacity: '0.5' } : {}} className={styles.main}>
      <img
        style={
          imageLoaded ? { visibility: 'visible' } : { visibility: 'hidden' }
        }
        src={img}
        alt="avatar"
        onLoad={handleLoad}
      />
    </div>
  )
}

export default Avatar
