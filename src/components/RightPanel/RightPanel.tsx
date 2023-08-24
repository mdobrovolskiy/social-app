import { useEffect, useState } from 'react'
import styles from './RightPanel.module.sass'
import Avatar from '../Avatar/Avatar'
import { getAuth, signOut } from 'firebase/auth'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { setAuth } from '../../redux/slices/authSlice'
import { Link } from 'react-router-dom'
import { collection, limit, query, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase'
import { setUser } from '../../redux/slices/userSlice'
import RecUser from '../RecUser/RecUser'
import ErrorModal from '../ErrorModal/ErrorModal'

interface IUserData {
  userName?: string
  avatar?: string
}
const RightPanel = ({ userName, avatar }: IUserData) => {
  const [recommended, setRecommended] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const clientId = useAppSelector((state) => state.authSlice.id)
  const dispatch = useAppDispatch()
  const logOut = () => {
    const auth = getAuth()
    signOut(auth)
      .then(() => {
        dispatch(setAuth({ isAuthed: false, id: '' }))
        dispatch(setUser({}))
      })
      .catch((error) => {})
  }

  useEffect(() => {
    async function getRecommendedUsers() {
      setIsLoading(true)
      try {
        const q = query(collection(db, 'users'), limit(5))
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
    return <></>
  }

  return (
    <div className={styles.main}>
      <div className={styles.thisHeader}>
        <div className={styles.avatarWrapper}>
          <Link to={`/${userName}`}>
            <Avatar img={avatar} />
          </Link>
        </div>
        {error.length > 0 && <ErrorModal err={error} />}
        <div className={styles.name}>
          <span>
            <Link to={`/${userName}`}>{userName}</Link>
          </span>
          <Link to={`/${userName}`}>
            <span className={styles.subtext}>{userName}</span>
          </Link>
        </div>

        <div onClick={logOut} className={styles.action}>
          Log out
        </div>
      </div>
      <div className={styles.recommend}>Recommendations for you</div>
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
      <div className={styles.info}>
        <ul>
          <li>Help</li>
          <li>Jobs</li>
          <li>Privacy</li>
          <li>API</li>
          <li>About</li>
          <li>Press</li>
          <li>Language</li>
          <li>Locations</li>
        </ul>
        <div>
          <span>© 2023 INSTAGRAM BY MISHA</span>
        </div>
      </div>
    </div>
  )
}

export default RightPanel
