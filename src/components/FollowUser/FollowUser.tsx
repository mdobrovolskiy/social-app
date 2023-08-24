import styles from './FollowUser.module.sass'
import Avatar from '../Avatar/Avatar'
import { Link } from 'react-router-dom'
interface IFollowUser {
  avatar: string
  username: string
}
const FollowUser = ({ avatar, username }: IFollowUser) => {
  return (
    <div className={styles.main}>
      <Link to={`/${username}`}>
        <div className={styles.image}>
          <Avatar img={avatar} />
        </div>
      </Link>
      <Link to={`/${username}`}>
        <div className={styles.name}>{username}</div>
      </Link>
    </div>
  )
}

export default FollowUser
