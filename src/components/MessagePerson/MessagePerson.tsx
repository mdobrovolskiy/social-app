import styles from './MessagePerson.module.sass'
import Avatar from '../Avatar/Avatar'
import { Link } from 'react-router-dom'
interface IUser {
  userName: string
  avatar: string
  user?: string
  setIsMobilePanelOpen: any
}
const MessagePerson = ({
  userName,
  avatar,
  user,
  setIsMobilePanelOpen,
}: IUser) => {
  return (
    <Link
      onClick={() => setIsMobilePanelOpen(false)}
      to={`/messages/${userName}`}
    >
      <div
        className={`${styles.main} ${user === userName ? styles.active : ''}`}
      >
        <div className={styles.avatar}>
          <Avatar img={avatar} />
        </div>
        <div className={styles.info}>
          <div className={styles.name}>{userName}</div>
        </div>
      </div>
    </Link>
  )
}

export default MessagePerson
