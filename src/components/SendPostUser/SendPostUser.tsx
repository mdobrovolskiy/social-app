import { useMemo, useState } from 'react'
import styles from '../SendPostList/SendPostList.module.sass'
import Avatar from '../Avatar/Avatar'
import { db } from '../../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useAppSelector } from '../../hooks'
import { Link } from 'react-router-dom'
import { IUserData, IPostData } from '../../types'
interface ISendPostUser {
  user: IUserData
  post: IPostData
}
const SendPostUser = ({ user, post }: ISendPostUser) => {
  console.log(user)
  const [alreadySent, setAlreadySent] = useState(false)
  const clientName = useAppSelector((state) => state.userSlice.userName)
  const endPoint = useMemo(() => {
    if (clientName && user.userName) {
      if (clientName[0] > user.userName[0]) {
        return `${clientName}${user.userName}`
      } else {
        return `${user.userName}${clientName}`
      }
    }
  }, [user, clientName])
  const sendMessage = async () => {
    if (endPoint) {
      addDoc(collection(db, 'chatDb', 'chatId', endPoint), {
        post: post,
        createdAt: serverTimestamp(),
        userName: clientName,
      })
      setAlreadySent(true)
    }
  }
  return (
    <div key={user.id} className={styles.user}>
      <div className={styles.userData}>
        <Link to={`/${user.userName}`}>
          <div className={styles.avatarWrapper}>
            <Avatar img={user.avatar} />
          </div>
        </Link>
        <Link to={`/${user.userName}`}>
          <div className={styles.name}>{user.userName}</div>
        </Link>
      </div>
      <div className={styles.send}>
        {!alreadySent ? (
          <button onClick={sendMessage}>Send</button>
        ) : (
          <button style={{ backgroundColor: '#fff', color: '#000' }}>
            Sent
          </button>
        )}
      </div>
    </div>
  )
}

export default SendPostUser
