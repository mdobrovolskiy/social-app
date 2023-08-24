import { useEffect, useState } from 'react'
import styles from './ProfilePage.module.sass'
import ProfileHeader from '../../components/ProfileHeader/ProfileHeader'
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
} from 'firebase/firestore'
import { db } from '../../firebase'
import { useParams } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { setAuth } from '../../redux/slices/authSlice'
import ProfilePosts from '../../components/ProfilePosts/ProfilePosts'
import Loader from '../../components/Loader/Loader'
import ErrorModal from '../../components/ErrorModal/ErrorModal'
import MobileRecs from '../../components/MobileRecs/MobileRecs'
// interface IUser {
//   email: string
//   avatar: string
//   userName: string
//   followers: object[]
//   following: number
//   postCount: number
//   id: string
// }
const ProfilePage = () => {
  const dispatch = useAppDispatch()
  const isAuthed = useAppSelector((state) => state.authSlice.isAuthed)
  const clientId = useAppSelector((state) => state.authSlice.id)
  const mobileRecOpened = useAppSelector(
    (state) => state.mobileRecSlice.mobileRecOpened
  )
  const { username } = useParams()
  const [userData, setUserData] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isClientFollowed, setIsClientFollowed] = useState(false)
  const [userPosts, setUserPosts] = useState<any>([])
  const [postsLoading, setPostsLoading] = useState(true)
  const auth = getAuth()
  const checkAuth = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid
        if (!isAuthed) {
          dispatch(setAuth({ isAuthed: true, id: uid }))
        }
      } else {
        console.log('NOT SIGNED')
        if (isAuthed) {
          dispatch(setAuth({ isAuthed: false, id: '' }))
        }
      }
    })
  }
  useEffect(() => {
    checkAuth()
  }, [])

  const checkFollowStatus = () => {
    const userFollowers = userData.followers
    if (userFollowers.includes(clientId)) {
      setIsClientFollowed(true)
    } else {
      setIsClientFollowed(false)
    }
  }
  useEffect(() => {
    if (userData.followers) {
      checkFollowStatus()
    }
  }, [userData])

  const getUserData = async (name?: string) => {
    try {
      setIsLoading(true)
      const q = query(collection(db, 'users'), where('userName', '==', name))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.docs.length > 0) {
        const userData = querySnapshot.docs[0].data()
        setUserData(userData)

        const userDocRef = doc(db, 'users', userData.id)
        const unsub = onSnapshot(userDocRef, (doc) => {
          setUserData(doc.data())
        })
        setIsLoading(false)
        return Promise.resolve(unsub)
      } else {
        setError('No user found, please try again')
        setIsLoading(false)
      }
    } catch (error) {
      setError('An error occurred while fetching user data')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (username) {
      let unsubscribe: any
      const fetchData = async () => {
        unsubscribe = await getUserData(username)
      }
      fetchData()
      return () => {
        if (unsubscribe) {
          unsubscribe()
        }
      }
    }
  }, [username])
  async function getPosts(id: string) {
    try {
      const roundWordsRef = collection(db, 'posts')
      const q = query(roundWordsRef, where('authorId', '==', id))
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const wordsCurr: any = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
        setUserPosts(wordsCurr)
      })
      return () => {
        unsubscribe()
      }
    } catch (error: any) {
      setError(error)
    } finally {
      setPostsLoading(false)
    }
  }
  useEffect(() => {
    if (userData.id) {
      getPosts(userData.id)
    }
  }, [userData])

  if (isLoading) {
    return <Loader />
  }
  if (error) {
    return <ErrorModal err={error} />
  }
  return (
    <>
      <div className={styles.container}>
        {mobileRecOpened && <MobileRecs />}
        <ProfileHeader
          postsCount={userPosts.length}
          checkFollowStatus={checkFollowStatus}
          isClientFollowed={isClientFollowed}
          followers={userData.followers}
          following={userData.following}
          userId={userData.id}
          userName={userData.userName}
          avatar={userData.avatar}
          isLoading={isLoading}
        />
        {!postsLoading && <ProfilePosts userPosts={userPosts} />}
      </div>
    </>
  )
}

export default ProfilePage
