import { useEffect, memo } from 'react'
import styles from './StoriesList.module.sass'
import StoriesItem from '../StoriesItem/StoriesItem'
import { useRef, useState } from 'react'
import { db } from '../../firebase'
import {
  collection,
  onSnapshot,
  startAfter,
  orderBy,
  limit,
  getDocs,
  query,
} from 'firebase/firestore'
import ErrorModal from '../ErrorModal/ErrorModal'
interface ISL {
  setCreateStoryOpened: React.Dispatch<React.SetStateAction<boolean>>
}
const StoriesList = memo(({ setCreateStoryOpened }: ISL) => {
  const containerRef: React.LegacyRef<HTMLDivElement> = useRef(null)
  const [lastPostCount, setLastPostCount] = useState(20)
  const [storiesFeed, setStoriesFeed] = useState<any>([])
  const [error, setError] = useState<string | null>(null)
  const [lastDoc, setLastDoc] = useState<any>(null)
  const getExplore = async (lastDoc: any) => {
    try {
      const first = query(
        collection(db, 'stories'),
        orderBy('createdAt', 'desc'),
        limit(20)
      )

      const unsubscribe = onSnapshot(first, (querySnapshot) => {
        const posts: any = []
        querySnapshot.forEach((doc) => {
          posts.push({ ...doc.data(), id: doc.id })
        })
        setStoriesFeed(posts)
      })
      return () => unsubscribe()
    } catch (error: any) {
      setError(error)
    }
  }

  useEffect(() => {
    getExplore(lastDoc)
  }, [lastPostCount])
  return (
    <div ref={containerRef} className={styles.main}>
      {error && <ErrorModal err={error} />}
      <StoriesItem
        setCreateStoryOpened={setCreateStoryOpened}
        avatar="https://cdn.icon-icons.com/icons2/2406/PNG/512/plus_circle_new_create_icon_145948.png"
        userName="Create"
        create={true}
      />
      {storiesFeed.map((story: any) => (
        <StoriesItem
          key={story.id}
          id={story.id}
          avatar={story.avatar}
          authorId={story.authorId}
          imageUrl={story.imageUrl}
          userName={story.userName}
        />
      ))}
    </div>
  )
})

export default StoriesList
