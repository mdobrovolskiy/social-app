import React from 'react'
import styles from './PostLikesList.module.sass'
import { db } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState, useRef } from 'react'
import FollowUser from '../FollowUser/FollowUser'
import Loader from '../Loader/Loader'
import CloseIcon from '../CloseIcon/CloseIcon'
interface IPostLikes {
  id: string
  setWhoLikedOpened: any
}
const PostLikesList = ({ id, setWhoLikedOpened }: IPostLikes) => {
  const [likes, setLikes] = useState<any>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const modalRef: any = useRef(null)
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

  async function getUserData(uid: string) {
    const docRef = doc(db, 'users', uid)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return {
        avatar: docSnap.data().avatar,
        id: docSnap.data().id,
        userName: docSnap.data().userName,
      }
    } else {
      console.log('No such document!')
    }
  }
  const getLikes = async () => {
    const docRef = doc(db, 'posts', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const likeList = docSnap.data().likes
      const result = await Promise.all(
        likeList.map((id: string) => getUserData(id))
      )
      setLikes(result)
    } else {
      setError('No likes found, try again')
    }
    setIsLoading(false)
  }

  useEffect(() => {
    getLikes()
  }, [id])
  const closeModal = () => {
    setWhoLikedOpened(false)
  }
  if (isLoading) {
    return (
      <div ref={modalRef} className={styles.main}>
        <div className={styles.content}>
          <Loader />
        </div>
      </div>
    )
  }
  return (
    <div ref={modalRef} className={styles.main}>
      <div className={styles.content}>
        <div className={styles.closeWrap}>
          <CloseIcon func={closeModal} />
        </div>
        <span>Likes</span>
        {likes.length > 0 ? (
          likes.map((user: any) => (
            <FollowUser
              key={user.id}
              avatar={user.avatar}
              username={user.userName}
            />
          ))
        ) : (
          <h1>Nobody liked this :( </h1>
        )}
      </div>
    </div>
  )
}

export default PostLikesList
