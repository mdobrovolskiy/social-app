import styles from './Feed.module.sass'
import Post from '../Post/Post'
import { useEffect, useState } from 'react'
import { db } from '../../firebase'
import {
  collection,
  query,
  getDocs,
  where,
  limit,
  startAfter,
  orderBy,
  doc,
  getDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore'
import ErrorModal from '../ErrorModal/ErrorModal'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { changeCategory } from '../../redux/slices/categorySlice'
interface IFeed {
  following: string[]
  clientName?: string
  likedPosts?: string[]
}
const Feed = ({ following, clientName, likedPosts }: IFeed) => {
  const [error, setError] = useState<string | null>(null)
  const [exploreFeed, setExploreFeed] = useState<any>([])
  const [followingFeed, setFollowingFeed] = useState<any>([])
  const [lastDoc, setLastDoc] = useState<any>(null)
  const [lastPostCount, setLastPostCount] = useState(5)
  const [noFollowingPosts, setNoFollowingPosts] = useState(false)
  const [likedPostsFeed, setLikedPostsFeed] = useState<any>([])
  const category = useAppSelector((state) => state.categorySlice.category)
  const deletePost = async (id: string) => {
    await deleteDoc(doc(db, 'posts', id))
    if (category === 'explore') {
      const updatedState = exploreFeed.filter((post: any) => post.id !== id)
      setExploreFeed(updatedState)
    } else if (category === 'following') {
      const updatedState = followingFeed.filter((post: any) => post.id !== id)
      setFollowingFeed(updatedState)
    } else if (category === 'likes') {
      const updatedState = likedPostsFeed.filter((post: any) => post.id !== id)
      setLikedPostsFeed(updatedState)
    }
  }
  const dispatch = useAppDispatch()
  const getExplore = async (lastDoc: any) => {
    if (!lastDoc) {
      try {
        const first = query(
          collection(db, 'posts'),
          orderBy('createdAt', 'desc'),
          limit(3)
        )

        const unsubscribe = onSnapshot(first, (querySnapshot) => {
          const posts: any = []

          querySnapshot.forEach((doc) => {
            posts.push({ ...doc.data(), id: doc.id })
          })

          const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
          setLastDoc(lastVisible)
          setExploreFeed(posts)
          return () => {
            unsubscribe()
          }
        })
      } catch (error: any) {
        setError(error)
      }
    } else {
      try {
        const next = query(
          collection(db, 'posts'),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(3)
        )

        const unsubscribe = onSnapshot(next, (querySnapshot) => {
          const posts: any = []

          querySnapshot.forEach((doc) => {
            posts.push({ ...doc.data(), id: doc.id })
          })

          const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
          setLastDoc(lastVisible)
          setExploreFeed((prev: any) => [...prev, ...posts])
        })
        return () => {
          unsubscribe()
        }
      } catch (error: any) {
        setError(error)
      }
    }
  }

  useEffect(() => {
    getExplore(lastDoc)
  }, [lastPostCount])

  async function getFollowingPost(uid: string) {
    try {
      const q = query(collection(db, 'posts'), where('authorId', '==', uid))
      const querySnapshot = await getDocs(q)
      let result: any = null
      querySnapshot.forEach((doc: any) => {
        result = { ...doc.data(), id: doc.id }
      })
      return result
    } catch (error: any) {
      setError(error)
    }
  }
  const getUserDataForFollowing = async () => {
    try {
      const promises = following.map((item: any) => getFollowingPost(item))
      const userDataArray: any = await Promise.all(promises)
      const cleanedResult = userDataArray.filter((item: any) => item)

      if (cleanedResult.length === 0) {
        setNoFollowingPosts(true)
        return
      }

      for (let newPost of cleanedResult) {
        for (let existingPost of followingFeed) {
          if (existingPost.id === newPost.id) {
            // checking if our state has this post so we prevent doubling
            return
          }
        }
      }
      setFollowingFeed((prev: any) => [...prev, ...cleanedResult])
    } catch (error: any) {
      setError(error)
    }
  }
  useEffect(() => {
    if (following && following.length && category === 'following') {
      getUserDataForFollowing()
    } else {
      setNoFollowingPosts(true)
    }
  }, [following, category])

  useEffect(() => {
    if (noFollowingPosts && followingFeed.length > 0) {
      setNoFollowingPosts(false)
    }
  }, [noFollowingPosts, followingFeed])
  const getPost = async (postId: string) => {
    const docRef = doc(db, 'posts', postId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id }
    } else {
      return false
    }
  }
  const getLikedPosts = async () => {
    if (likedPosts) {
      const result = likedPosts.map((id: string) => getPost(id))
      const likedPostsData = await Promise.all(result)
      const onlyTrueElems = likedPostsData.filter((item) => item)
      setLikedPostsFeed(onlyTrueElems)
    }
  }
  useEffect(() => {
    if (category === 'likes') {
      getLikedPosts()
    }
  }, [category])

  return (
    <div className={styles.mama}>
      <div className={styles.main}>
        <div className={styles.category}>
          {error && <ErrorModal err={error} />}
          <button
            onClick={() => dispatch(changeCategory('following'))}
            className={category === 'following' ? styles.active : ''}
          >
            Followings
          </button>
          <button
            onClick={() => dispatch(changeCategory('explore'))}
            className={category === 'explore' ? styles.active : ''}
          >
            Explore
          </button>
          <button
            onClick={() => dispatch(changeCategory('likes'))}
            className={category === 'likes' ? styles.active : ''}
          >
            Liked
          </button>
        </div>
        {noFollowingPosts && category === 'following' && (
          <div className={styles.noPostMessage}>
            <h1>
              Your following feed is empty, follow someone with posts or
              <button onClick={() => dispatch(changeCategory('explore'))}>
                explore
              </button>
            </h1>
          </div>
        )}
        {category === 'explore' &&
          exploreFeed?.map((post: any, i: number) => (
            <Post
              deletePost={deletePost}
              post={post}
              likes={post?.likes}
              likedPosts={likedPosts}
              clientName={clientName}
              comments={post.comments}
              id={post.id}
              name="explore"
              setLastPostCount={setLastPostCount}
              arrayLength={exploreFeed.length}
              index={i}
              key={post.id}
              imageUrl={post?.imageUrl}
              userName={post?.userName}
              avatar={post?.avatar}
              text={post?.text}
            />
          ))}
        {category === 'following' &&
          followingFeed?.map((post: any, i: number) => (
            <Post
              post={post}
              likes={post?.likes}
              likedPosts={likedPosts}
              clientName={clientName}
              comments={post.comments}
              id={post.id}
              index={i}
              name="following"
              arrayLength={followingFeed.length}
              key={post.id}
              imageUrl={post?.imageUrl}
              userName={post?.userName}
              avatar={post?.avatar}
              text={post?.text}
            />
          ))}
        {category === 'likes' &&
          likedPostsFeed?.map((post: any, i: number) => (
            <Post
              post={post}
              likes={post?.likes}
              likedPosts={likedPosts}
              clientName={clientName}
              comments={post?.comments}
              id={post.id}
              index={i}
              name="following"
              arrayLength={likedPostsFeed.length}
              key={post.id}
              imageUrl={post?.imageUrl}
              userName={post?.userName}
              avatar={post?.avatar}
              text={post?.text}
            />
          ))}
      </div>
    </div>
  )
}

export default Feed
