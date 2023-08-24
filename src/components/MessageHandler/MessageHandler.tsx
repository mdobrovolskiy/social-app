import { useState, useEffect, useRef } from 'react'
import styles from './MessageHandler.module.sass'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useParams } from 'react-router-dom'
import { db } from '../../firebase'
import ErrorModal from '../ErrorModal/ErrorModal'
const MessageHandler = ({ endPoint, clientName }: any) => {
  const [media, setMedia] = useState<'mobile' | 'desktop' | null>(null)
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
  const { user } = useParams()
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  useEffect(() => {
    setError('')
  }, [user])
  const sendMessage = async () => {
    if (!user) {
      setError('You have to open chat with someone')
      return
    }
    if (text.length > 0 && text.trim() !== '') {
      addDoc(collection(db, 'chatDb', 'chatId', endPoint), {
        text,
        userName: clientName,
        createdAt: serverTimestamp(),
      })
      setText('')
    }
  }
  const handleSendByEnter = (e: any) => {
    if (e.keyCode === 13) {
      sendMessage()
    }
  }
  const inputRef: any = useRef()
  useEffect(() => {
    if (user && media === 'desktop') {
      inputRef.current.focus()
    }
  }, [user, media])
  return (
    <div className={styles.main}>
      <div className={styles.content}>
        {error && <ErrorModal err={error} />}
        <div className={styles.wrapper}>
          <input
            ref={inputRef}
            onKeyDown={(e) => handleSendByEnter(e)}
            value={text}
            onChange={(e) => setText(e.target.value)}
            type="text"
            placeholder="Message"
          />
        </div>

        <div>
          <button onClick={sendMessage} className={styles.btn}>
            <img
              src="https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/48/FFFFFF/external-send-social-media-ui-tanah-basah-glyph-tanah-basah.png"
              alt="external-send-social-media-ui-tanah-basah-glyph-tanah-basah"
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MessageHandler
