import { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import styles from './MessagePanel.module.sass'
import MessagePerson from '../MessagePerson/MessagePerson'
import { db } from '../../firebase'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import Loader from '../Loader/Loader'
interface IMessagePanel {
  following: any
}
const MessagePanel = ({ following }: IMessagePanel) => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [media, setMedia] = useState<'mobile' | 'desktop' | null>(null)
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(true)
  const [panelStyle, setPanelStyle] = useState({ display: 'none' })
  const params = useParams()

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
    if (media === 'mobile' && params.user) {
      setIsMobilePanelOpen(false)
    }
  }, [media, params])
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
  const handleNavBar = () => {
    if (media === 'desktop') {
      setPanelStyle({ display: 'block' })
    } else if (media === 'mobile' && isMobilePanelOpen) {
      setPanelStyle({ display: 'block' })
    } else {
      setPanelStyle({ display: 'none' })
    }
  }
  useEffect(() => {
    handleNavBar()
  }, [media, isMobilePanelOpen])

  if (isLoading) {
    return (
      <div className={styles.main}>
        <Loader />
      </div>
    )
  }

  return (
    <>
      {media === 'mobile' && !isMobilePanelOpen && (
        <div
          onClick={() => setIsMobilePanelOpen((state) => !state)}
          className={styles.wrap}
        >
          <div className={styles.item}></div>
          <div className={styles.item}></div>
          <div className={styles.item}></div>
        </div>
      )}
      {isMobilePanelOpen && media === 'mobile' && (
        <div
          onClick={() => setIsMobilePanelOpen(false)}
          className={styles.close}
        >
          <div className={styles.closeItemLeft}></div>
          <div className={styles.closeItemRight}></div>
        </div>
      )}
      <div className={styles.fill}></div>
      <div style={panelStyle} className={styles.main}>
        <div>
          <Link to="/">
            <img
              className={styles.image}
              width="40"
              height="40"
              src="	https://cdn-icons-png.flaticon.com/128/5948/5948460.png"
              alt="external-home-essential-ui-v1-creatype-glyph-colourcreatype"
            />
          </Link>
        </div>
        {!isLoading && users.length === 0 && (
          <div className={styles.noUsers}>
            You have to follow someone to be able to message
          </div>
        )}
        {users.map((user: any) => (
          <MessagePerson
            setIsMobilePanelOpen={setIsMobilePanelOpen}
            user={params.user}
            key={user.id}
            userName={user.userName}
            avatar={user.avatar}
          />
        ))}
      </div>
    </>
  )
}

export default MessagePanel
