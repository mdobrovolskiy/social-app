import styles from './Following.module.sass'
import { db } from '../../firebase'
import { useState, useEffect, useRef } from 'react'

import { doc, getDoc } from 'firebase/firestore'
import FollowUser from '../FollowUser/FollowUser'
import Loader from '../Loader/Loader'
interface IFollowList {
  followingOpen: boolean
  setFollowingOpen: React.Dispatch<React.SetStateAction<boolean>>
  following: string[]
}

const Following = ({
  followingOpen,
  setFollowingOpen,
  following,
}: IFollowList) => {
  const [isLoading, setIsLoading] = useState(false)
  const [followingUsers, setFollowingUsers] = useState<any>([])
  const [error, setError] = useState(false)
  const modalRef: any = useRef()
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
        setFollowingOpen(false)
      }
    }
    if (followingOpen) {
      document.addEventListener('mousedown', handler)
      return () => {
        document.removeEventListener('mousedown', handler)
      }
    }
  }, [followingOpen])

  async function getUserData(uid: string) {
    const docRef = doc(db, 'users', uid)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      console.log('No such document!')
    }
  }

  useEffect(() => {
    if (following && following.length) {
      setIsLoading(true)
      const getUserDataForFollowing = async () => {
        const promises = following.map((item: any) => getUserData(item))
        const userDataArray: any = await Promise.all(promises)
        setFollowingUsers(userDataArray)
        setIsLoading(false)
      }

      getUserDataForFollowing()
    }
  }, [following])
  console.log(following)

  return (
    <div className={styles.main}>
      <div ref={modalRef} className={styles.container}>
        <h3>Following</h3>{' '}
        <div className={styles.wrapper}>
          {isLoading ? (
            <Loader />
          ) : followingUsers.length > 0 ? (
            followingUsers.map((user: any, i: number) => (
              <FollowUser
                key={i}
                username={user.userName}
                avatar={user.avatar}
              />
            ))
          ) : (
            <span>No following users{':('}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Following
