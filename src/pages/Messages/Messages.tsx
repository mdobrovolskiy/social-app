import { useEffect, useState } from 'react'
import { onSnapshot, doc } from 'firebase/firestore'
import styles from './Messages.module.sass'
import MessagePanel from '../../components/MessagePanel/MessagePanel'
import MessageList from '../../components/MessageList/MessageList'
import { db } from '../../firebase'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { setAuth } from '../../redux/slices/authSlice'
import NotLoggedMessage from '../../components/NotLoggedMessage/NotLoggedMessage'
import Loader from '../../components/Loader/Loader'
import { setUser } from '../../redux/slices/userSlice'
import ErrorModal from '../../components/ErrorModal/ErrorModal'

const Messages = () => {
  const auth = getAuth()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const userData = useAppSelector((state) => state.userSlice)
  const dispatch = useAppDispatch()
  const isAuthed = useAppSelector((state) => state.authSlice.isAuthed)
  const clientId = useAppSelector((state) => state.authSlice.id)
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
      setIsLoading(false)
    })
  }
  async function getUserData(id: string) {
    try {
      const unsub = onSnapshot(doc(db, 'users', id), (doc) => {
        dispatch(setUser(doc.data()))
      })
      return () => {
        unsub()
      }
    } catch (error: any) {
      setError(error)
    }
  }
  useEffect(() => {
    if (clientId && !userData.id) {
      getUserData(clientId)
    }
  }, [clientId, userData])

  useEffect(() => {
    checkAuth()
  }, [])
  if (isLoading) {
    return <Loader />
  }
  if (!isAuthed && !isLoading) {
    return <NotLoggedMessage />
  }
  return (
    <div className={styles.main}>
      {error && <ErrorModal err={error} />}
      <MessagePanel following={userData.following} />
      <MessageList clientName={userData.userName} />
    </div>
  )
}

export default Messages
