import { useState, useEffect, useRef } from 'react'
import styles from './SendPostList.module.sass'
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAppSelector } from '../../hooks'
import Avatar from '../Avatar/Avatar'
import Loader from '../Loader/Loader'
import SendPostUser from '../SendPostUser/SendPostUser'
import CloseIcon from '../CloseIcon/CloseIcon'
import { IPostData } from '../../types'
interface IPost {
  post: IPostData
  setSendModalOpened: React.Dispatch<React.SetStateAction<boolean>>
}
const SendPostList = ({ post, setSendModalOpened }: IPost) => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const following = useAppSelector((state) => state.userSlice.following)
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
  useEffect(() => {
    function handler(e: any) {
      if (e.path[0] === modalRef.current) {
        setSendModalOpened(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
    }
  }, [])
  async function getFollowingUsers(uid: string) {
    const q = query(collection(db, 'users'), where('id', '==', uid))
    const querySnapshot = await getDocs(q)
    let result: any = false
    querySnapshot.forEach((doc: any) => {
      result = { ...doc.data(), id: doc.id }
    })
    return result
  }
  useEffect(() => {
    if (following) {
      const getUsers = async () => {
        const users = following?.map((id: string) => getFollowingUsers(id))
        const result: any = await Promise.all(users)
        setUsers(result)
        setIsLoading(false)
      }
      getUsers()
    } else {
      setIsLoading(false)
    }
  }, [following])
  const closeModal = () => {
    setSendModalOpened(false)
  }
  if (isLoading) {
    return (
      <div className={styles.main}>
        <div className={styles.closeWrap}></div>
        <div className={styles.content}>
          <Loader />
        </div>
      </div>
    )
  }
  return (
    <div ref={modalRef} className={styles.main}>
      <div className={styles.closeWrap}>
        <CloseIcon func={closeModal} />
      </div>
      <div className={styles.content}>
        {users.map((user: any) => (
          <SendPostUser key={user.id} post={post} user={user} />
        ))}
        {users.length === 0 && (
          <h3 style={{ textAlign: 'center' }}>
            Follow someone to start messaging
          </h3>
        )}
      </div>
    </div>
  )
}

export default SendPostList
