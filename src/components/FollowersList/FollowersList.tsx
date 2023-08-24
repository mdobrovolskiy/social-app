import React, { useRef, useState, useEffect } from 'react'
import styles from './FollowersList.module.sass'
import FollowUser from '../FollowUser/FollowUser'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import Loader from '../Loader/Loader'
interface IFollowList {
  followersOpen: boolean
  setFollowersOpen: React.Dispatch<React.SetStateAction<boolean>>
  followers: string[]
}
const FollowersList = ({
  followersOpen,
  setFollowersOpen,
  followers,
}: IFollowList) => {
  const [followedUsers, setFollowedUsers] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false)
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

  const modalRef: any = useRef()
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
    console.log(followers)
    if (followers && followers.length) {
      setIsLoading(true)
      const getFollowersData = async () => {
        const promises = followers.map((item: any) => getUserData(item))
        const userDataArray: any = await Promise.all(promises)
        setFollowedUsers(userDataArray)
        setIsLoading(false)
      }

      getFollowersData()
    } else {
      setIsLoading(false)
    }
  }, [followers])

  useEffect(() => {
    function handler(e: any) {
      if (e.target.contains(modalRef.current)) {
        setFollowersOpen(false)
      }
    }
    if (followersOpen) {
      document.addEventListener('mousedown', handler)
      return () => {
        document.removeEventListener('mousedown', handler)
      }
    }
  }, [followersOpen])

  return (
    <div className={styles.main}>
      <div ref={modalRef} className={styles.container}>
        <h3>Followers</h3>{' '}
        <div className={styles.wrapper}>
          {isLoading ? (
            <Loader />
          ) : followedUsers.length > 0 ? (
            followedUsers.map((user: any, i: number) => (
              <FollowUser
                key={i}
                username={user.userName}
                avatar={user.avatar}
              />
            ))
          ) : (
            <span>No followers {':('}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default FollowersList
