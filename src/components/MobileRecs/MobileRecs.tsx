import { useState, useEffect } from 'react'
import styles from './MobileRecs.module.sass'
import { handleMobileRec } from '../../redux/slices/mobileRecSlice'
import { db } from '../../firebase'
import {
  arrayUnion,
  updateDoc,
  arrayRemove,
  onSnapshot,
  query,
  collection,
  limit,
  doc,
} from 'firebase/firestore'
import { useAppSelector, useAppDispatch } from '../../hooks'
import RecUser from '../RecUser/RecUser'
import Loader from '../Loader/Loader'
const MobileRecs = ({ setMobileRecOpen }: any) => {
  const [recommended, setRecommended] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const dispatch = useAppDispatch()
  const clientId = useAppSelector((state) => state.authSlice.id)
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
  const closeRecs = () => {
    dispatch(handleMobileRec(false))
  }

  const handleFollow = async (userId: string, clientId: string) => {
    try {
      const followingsRef = doc(db, 'users', clientId)
      await updateDoc(followingsRef, {
        following: arrayUnion(userId),
      })
      const followersRef = doc(db, 'users', userId)
      await updateDoc(followersRef, {
        followers: arrayUnion(clientId),
      })
    } catch (err: any) {
      setError(err)
    }
  }
  const handleUnFollow = async (userId: string, clientId: string) => {
    try {
      const followingsRef = doc(db, 'users', clientId)
      await updateDoc(followingsRef, {
        following: arrayRemove(userId),
      })
      const followersRef = doc(db, 'users', userId)
      await updateDoc(followersRef, {
        followers: arrayRemove(clientId),
      })
    } catch (err: any) {
      setError(err)
    }
  }

  useEffect(() => {
    async function getRecommendedUsers() {
      setIsLoading(true)
      try {
        const q = query(collection(db, 'users'), limit(7))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const recommendedUsers: any = []
          querySnapshot.forEach((doc) => {
            recommendedUsers.push(doc.data())
          })
          setRecommended(recommendedUsers)
          setIsLoading(false)
        })

        return () => {
          unsubscribe()
        }
      } catch (err: any) {
        setError(err)
      }
    }
    getRecommendedUsers()
  }, [])
  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.main}>
          <Loader />
        </div>
      </div>
    )
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.closeDiv}>
        <div onClick={closeRecs} className={styles.close}>
          <div className={styles.closeItemLeft}></div>
          <div className={styles.closeItemRight}></div>
        </div>
      </div>
      <div className={styles.main}>
        {recommended.map((user: any) => (
          <RecUser
            clientId={clientId}
            key={user.id}
            avatar={user.avatar}
            username={user.userName}
            id={user.id}
            followers={user.followers}
          />
        ))}
      </div>
    </div>
  )
}

export default MobileRecs
