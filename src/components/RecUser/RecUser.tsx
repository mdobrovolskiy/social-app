import styles from './RecUser.module.sass'
import Avatar from '../Avatar/Avatar'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { handleMobileRec } from '../../redux/slices/mobileRecSlice'
import Loader from '../Loader/Loader'
import { db } from '../../firebase'
import { arrayUnion, arrayRemove, updateDoc, doc } from '@firebase/firestore'
import { useState } from 'react'
interface IRecUser {
  username: string
  avatar: string
  id: string
  followers: any
  clientId: string
}
const RecUser = ({ username, avatar, id, followers, clientId }: IRecUser) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const handleFollow = async (userId: string, clientId: string) => {
    setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
  }
  const handleUnFollow = async (userId: string, clientId: string) => {
    setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
  }
  const mobileRecOpened = useAppSelector(
    (state) => state.mobileRecSlice.mobileRecOpened
  )
  const dispatch = useAppDispatch()
  const handleAction = (action: string) => {
    if (action === 'follow') {
      handleFollow(id, clientId)
    } else {
      handleUnFollow(id, clientId)
    }
  }
  const handleLink = () => {
    if (mobileRecOpened) {
      dispatch(handleMobileRec(false))
    }
  }
  if (id === clientId) {
    return <></>
  }
  return (
    <div className={styles.main}>
      <div className={styles.user}>
        <div className={styles.avatar}>
          <Link onClick={handleLink} to={`/${username}`}>
            <Avatar img={avatar} />
          </Link>
        </div>

        <div className={styles.data}>
          <Link onClick={handleLink} to={`/${username}`}>
            {username}
          </Link>
        </div>
      </div>
      <div className={styles.follow}>
        {isLoading ? (
          <Loader />
        ) : (
          <button
            style={{
              backgroundColor: followers?.includes(clientId) ? '#fff' : '',
              color: followers?.includes(clientId) ? '#000' : '',
            }}
            onClick={() =>
              handleAction(
                followers?.includes(clientId) ? 'unfollow' : 'follow'
              )
            }
          >
            {followers?.includes(clientId) ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>
    </div>
  )
}

export default RecUser
