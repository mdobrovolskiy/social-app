import { useEffect, useMemo, useState, useRef } from 'react'
import {
  collection,
  orderBy,
  query,
  onSnapshot,
  where,
  getDocs,
} from 'firebase/firestore'
import styles from './MessageList.module.sass'
import { Link, useParams } from 'react-router-dom'
import { db } from '../../firebase'
import MessageHandler from '../MessageHandler/MessageHandler'
import MessageItem from '../MessageItem/MessageItem'
import Avatar from '../Avatar/Avatar'
const MessageList = ({ clientName }: any) => {
  const containerRef: any = useRef()
  const [messages, setMessages] = useState<any>(null)
  const [companionInfo, setCompanionInfo] = useState<any>({})
  const [isAnyModalOpened, setIsAnyModalOpened] = useState(false) // there is a bug when modal opened different posts go over it so we just hide different messages when modal is opened
  const { user } = useParams()
  const getCompanionData = async () => {
    const q = query(collection(db, 'users'), where('userName', '==', user))
    const querySnapshot = await getDocs(q)
    let result: any = false
    querySnapshot.forEach((doc: any) => {
      result = { ...doc.data(), id: doc.id }
    })

    setCompanionInfo(result)
  }
  useEffect(() => {
    if (user) {
      getCompanionData()
    }
  }, [user])

  const endPoint = useMemo(() => {
    if (user && clientName) {
      if (clientName[0] > user[0]) {
        return `${clientName}${user}`
      } else {
        return `${user}${clientName}`
      }
    }
  }, [user, clientName])
  useEffect(() => {
    containerRef.current.scrollTop = containerRef.current.scrollHeight
  }, [messages])

  useEffect(() => {
    if (endPoint) {
      const getMessages = () => {
        const q = query(
          collection(db, 'chatDb', 'chatId', endPoint),
          orderBy('createdAt', 'asc')
        )
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
          let messages: any = []
          QuerySnapshot.forEach((doc) => {
            messages.push({ ...doc.data(), id: doc.id })
          })
          setMessages(messages)
        })
        return () => {
          unsubscribe()
        }
      }

      getMessages()
    }
  }, [endPoint])
  return (
    <div className={styles.main}>
      <div className={styles.info}>
        <Link to={`/${companionInfo.userName}`}>
          <div className={styles.userAvatar}>
            <Avatar img={companionInfo.avatar} />
          </div>
        </Link>

        <div className={styles.name}>
          <Link to={`/${companionInfo.userName}`}>
            {companionInfo.userName}
          </Link>
        </div>
      </div>
      <div className={styles.container}>
        <div ref={containerRef} className={styles.messageWrapper}>
          <div className={styles.fix}></div>
          <div
            className={`${styles.noMessages} ${
              messages && messages.length === 0 ? '' : styles.hidden
            }`}
          >
            <div className={styles.action}>
              No messages yet, say hi to {user} 👋!
            </div>
          </div>
          {messages?.map((item: any) => (
            <MessageItem
              setIsAnyModalOpened={setIsAnyModalOpened}
              isAnyModalOpened={isAnyModalOpened}
              post={item?.post}
              key={item.id}
              clientName={clientName}
              userName={item.userName}
              text={item.text}
              createdAt={item.createdAt}
            />
          ))}
        </div>

        <MessageHandler endPoint={endPoint} clientName={clientName} />
      </div>
    </div>
  )
}

export default MessageList
