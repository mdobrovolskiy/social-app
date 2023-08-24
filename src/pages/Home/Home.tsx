import { useEffect, useState } from 'react'
import StoriesList from '../../components/StoriesList/StoriesList'
import RightPanel from '../../components/RightPanel/RightPanel'
import Feed from '../../components/Feed/Feed'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { setAuth } from '../../redux/slices/authSlice'
import { db } from '../../firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import Loader from '../../components/Loader/Loader'
import CreatePost from '../../components/CreatePost/CreatePost'
import CreateStory from '../../components/CreateStory/CreateStory'
import { setUser } from '../../redux/slices/userSlice'
import ErrorModal from '../../components/ErrorModal/ErrorModal'
import MobileRecs from '../../components/MobileRecs/MobileRecs'
import { IUserData } from '../../types'

const Home = () => {
  const [createStoryOpened, setCreateStoryOpened] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [media, setMedia] = useState<'mobile' | 'desktop' | null>(null)
  const navigate = useNavigate()
  const isAuthed = useAppSelector((state) => state.authSlice.isAuthed)
  const clientId = useAppSelector((state) => state.authSlice.id)
  const userData: IUserData = useAppSelector((state) => state.userSlice)
  useEffect(() => {
    const mediaWatcher = window.matchMedia('(max-width: 1100px)')
    if (mediaWatcher.matches) {
      setMedia('mobile')
    } else {
      setMedia('desktop')
    }

    function updateIsNarrowScreen(e: any) {
      if (mediaWatcher.matches) {
        setMedia('mobile')
      } else {
        setMedia('desktop')
      }
    }
    mediaWatcher.addEventListener('change', updateIsNarrowScreen)

    return function cleanup() {
      mediaWatcher.removeEventListener('change', updateIsNarrowScreen)
    }
  }, [])

  const mobileRecOpened = useAppSelector(
    (state) => state.mobileRecSlice.mobileRecOpened
  )
  const createPostOpened = useAppSelector(
    (state) => state.createPostSlice.createPostOpened
  )
  const dispatch = useAppDispatch()
  const auth = getAuth()
  useEffect(() => {
    async function getUserData(id: string) {
      setIsLoading(true)
      try {
        const unsub = onSnapshot(doc(db, 'users', id), (doc) => {
          dispatch(setUser(doc.data()))
        })
        return () => {
          unsub()
        }
      } catch (err: any) {
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }
    if (clientId && !userData.id) {
      getUserData(clientId)
    }
  }, [clientId])

  const checkAuth = () => {
    setIsLoading(true)
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid
        if (!isAuthed) {
          dispatch(setAuth({ isAuthed: true, id: uid }))
        }
      } else {
        navigate('/login')
        if (isAuthed) {
          dispatch(setAuth({ isAuthed: false, id: '' }))
        }
      }
    })
    setIsLoading(false)
  }

  useEffect(() => {
    checkAuth()
  }, [])
  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="home">
      {createPostOpened && <CreatePost />}

      {error && <ErrorModal err={error} />}
      {mobileRecOpened && <MobileRecs />}
      {createStoryOpened && (
        <CreateStory
          closeModal={() => setCreateStoryOpened(false)}
          userName={userData.userName}
          avatar={userData.avatar}
          authorId={userData.id}
        />
      )}
      <StoriesList setCreateStoryOpened={setCreateStoryOpened} />
      {media === 'desktop' && (
        <RightPanel userName={userData.userName} avatar={userData.avatar} />
      )}
      {userData.following && (
        <Feed
          likedPosts={userData.likedPosts}
          following={userData.following}
          clientName={userData.userName}
        />
      )}
    </div>
  )
}

export default Home
