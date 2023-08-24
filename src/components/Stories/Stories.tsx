import styles from './Stories.module.sass'
import { useEffect, useRef, useState } from 'react'
import { db } from '../../firebase'
import {
  getDocs,
  query,
  collection,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import MainStory from './MainStory'
import { useParams } from 'react-router-dom'
import Loader from '../Loader/Loader'
import { IStoriesData } from '../../types'

const Stories = () => {
  const navigate = useNavigate()
  const params = useParams()
  const findCurrStory = (params: any) => {
    if (stories.length > 0) {
      setCurrentStory(
        stories.findIndex((item: any) => item.id === params.story)
      )
    }
  }
  const [media, setMedia] = useState<'mobile' | 'desktop' | null>(null)
  const [currentStory, setCurrentStory] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [stories, setStories] = useState<IStoriesData[]>([])
  const [lastDoc, setLastDoc] = useState<any>(null)
  const [alreadySkip, setAlreadySkip] = useState(false)
  const lineRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
  const centerRef: React.RefObject<HTMLDivElement> =
    useRef<HTMLDivElement>(null)
  const modalRef: React.RefObject<HTMLDivElement> = useRef(null)
  useEffect(() => {
    const mediaWatcher = window.matchMedia('(max-width: 1000px)')
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
  useEffect(() => {
    findCurrStory(params)
  }, [stories])
  const getExplore = async (lastDoc: any) => {
    setIsLoading(true)
    if (!lastDoc) {
      const first = query(
        collection(db, 'stories'),
        orderBy('createdAt', 'desc'),
        limit(20)
      )
      const documentSnapshots = await getDocs(first)

      const posts: any = []
      documentSnapshots.forEach((doc) => {
        posts.push({ ...doc.data(), id: doc.id })
      })

      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1]
      setLastDoc(lastVisible)
      setStories(posts)
    } else {
      const next = query(
        collection(db, 'stories'),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(20)
      )
      const posts: any = []
      const documentSnapshots = await getDocs(next)
      documentSnapshots.forEach((doc) => {
        posts.push({ ...doc.data(), id: doc.id })
      })
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1]
      setLastDoc(lastVisible)
      setStories((prev: any) => [...prev, ...posts])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    getExplore(lastDoc)
  }, [])

  const [isAnimationPaused, setIsAnimationPaused] = useState(false)

  const handlePauseUp = () => {
    setIsAnimationPaused(false)
  }
  const handlePauseDown = () => {
    setIsAnimationPaused(true)
  }

  const handleStoryRight = () => {
    if (stories[currentStory + 1]) {
      setIsAnimationPaused(false)
      setCurrentStory(+currentStory + 1)
    }
  }
  const handleStoryLeft = () => {
    setIsAnimationPaused(false)
    if (currentStory > 0) setCurrentStory(currentStory - 1)
  }
  function handler(e: any) {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      navigate('/')
    }
  }

  useEffect(() => {
    if (stories.length > 0) {
      lineRef.current?.classList.add(`${styles.reset}`)
      setAlreadySkip(false)
      setTimeout(() => {
        lineRef.current?.classList.remove(`${styles.reset}`)
      }, 10)

      document.addEventListener('mousedown', handler)

      return () => {
        document.removeEventListener('mousedown', handler)
      }
    }
  }, [currentStory, lineRef])

  useEffect(() => {
    if (stories.length > 0) {
      let check = setInterval(() => {
        if (alreadySkip) {
        }
        if (
          stories[currentStory + 1] &&
          lineRef.current?.clientWidth &&
          lineRef.current?.clientWidth === centerRef.current?.clientWidth
        ) {
          setCurrentStory(+currentStory + 1)
          setAlreadySkip(true)
        } else if (
          !stories[currentStory + 1] &&
          lineRef.current?.clientWidth === centerRef.current?.offsetWidth
        ) {
          navigate('/')
        }
      }, 200)
      return () => clearInterval(check)
    }
  }, [currentStory, stories])
  console.log(stories)
  if (isLoading) {
    return <Loader />
  }
  return (
    <div className={styles.wrapper}>
      <div ref={modalRef} className={styles.main}>
        <img
          onClick={() => navigate('/')}
          className={styles.close}
          src="https://img.icons8.com/ios-filled/50/FFFFFF/delete-sign--v1.png"
          alt=""
        />
        {media === 'desktop' && (
          <div className={styles.side}>
            {stories[currentStory - 2] && (
              <div className={styles.sideItem}>
                <img src={stories[currentStory - 2].imageUrl} alt="" />
              </div>
            )}
            {stories[currentStory - 1] && (
              <div className={styles.sideItem}>
                <img src={stories[currentStory - 1].imageUrl} alt="" />
              </div>
            )}
          </div>
        )}
        {stories[currentStory] && (
          <div ref={centerRef} className={styles.center}>
            <div
              ref={lineRef}
              className={styles.fillLine}
              style={{
                animationPlayState: isAnimationPaused ? 'paused' : 'running',
              }}
            ></div>
            <div className={styles.fillLineBg}></div>
            <img
              onClick={() => handleStoryLeft()}
              className={styles.navLeft}
              src="https://img.icons8.com/pastel-glyph/64/FFFFFF/circled-left.png"
              alt=""
            />
            <MainStory
              story={stories[currentStory]}
              handlePauseUp={handlePauseUp}
              handlePauseDown={handlePauseDown}
            />

            <img
              onClick={() => handleStoryRight()}
              className={styles.navRight}
              src="https://img.icons8.com/pastel-glyph/64/FFFFFF/circled-right.png"
              alt=""
            />
          </div>
        )}
        {media === 'desktop' && (
          <div className={styles.side}>
            {stories[currentStory + 1] && (
              <div className={styles.sideItem}>
                <img src={stories[currentStory + 1].imageUrl} alt="" />
              </div>
            )}
            {stories[currentStory + 2] && (
              <div className={styles.sideItem}>
                <img src={stories[currentStory + 2].imageUrl} alt="" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Stories
