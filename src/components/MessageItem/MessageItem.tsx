import styles from './MessageItem.module.sass'
import { IPostData } from '../../types'
import MessagePost from '../MessagePost/MessagePost'
import Post from '../Post/Post'
import { useRef, useState, useEffect } from 'react'
interface IMessage {
  text: string
  createdAt: any
  userName: string
  clientName: string
  post?: IPostData
  setIsAnyModalOpened: any
  isAnyModalOpened: boolean
}
const MessageItem = ({
  text,
  createdAt,
  userName,
  clientName,
  post,
  setIsAnyModalOpened,
  isAnyModalOpened,
}: IMessage) => {
  const modalRef: React.RefObject<HTMLDivElement> = useRef(null)
  function getTimeFromSeconds(seconds: any) {
    if (seconds) {
      const currentDate = new Date(seconds * 1000)
      let hours: any = currentDate.getHours()
      let minutes: any = currentDate.getMinutes()
      if (hours < 10) {
        hours = '0' + hours
      }
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      return hours + ':' + minutes
    }
  }
  const seconds = createdAt?.seconds
  const result = getTimeFromSeconds(seconds)

  if (!createdAt) {
    return <></>
  }
  return (
    <div
      className={`${styles.wrapper} ${
        clientName === userName ? '' : styles.friend
      }`}
    >
      {post ? (
        <div className={styles.postMain}>
          <MessagePost
            setIsAnyModalOpened={setIsAnyModalOpened}
            isAnyModalOpened={isAnyModalOpened}
            post={post}
          />
        </div>
      ) : (
        <div className={styles.main}>
          <div className={styles.message}>{text}</div>
          <div className={styles.time}>{result}</div>
        </div>
      )}
    </div>
  )
}

export default MessageItem
