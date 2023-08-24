import { useEffect } from 'react'
import styles from './Post.module.sass'
import Avatar from '../Avatar/Avatar'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import Loader from '../Loader/Loader'
import { useState } from 'react'
import { db } from '../../firebase'
import {
  addDoc,
  serverTimestamp,
  query,
  collection,
  orderBy,
  limit,
  startAfter,
  getDocs,
  updateDoc,
  arrayUnion,
  doc,
  arrayRemove,
  deleteDoc,
} from 'firebase/firestore'
import CommentItem from '../CommentItem/CommentItem'
import ErrorModal from '../ErrorModal/ErrorModal'
import { useAppSelector } from '../../hooks'
import PostLikesList from '../PostLikesList/PostLikesList'
import SendPostList from '../SendPostList/SendPostList'
import EditPost from '../EditPost/EditPost'
interface IPostProps {
  userName?: string
  imageUrl?: string
  text?: string
  avatar?: string
  ref?: any
  index?: number
  arrayLength: number
  setLimitPosts?: any
  setStart?: any
  setLastPostCount?: any
  id: string
  name: 'following' | 'explore' | 'likes' | 'message'
  comments?: any
  clientName?: string
  likedPosts?: string[]
  likes: string[]
  post: any
  deletePost?: any
}
const Post = ({
  likedPosts,
  userName,
  imageUrl,
  text,
  avatar,
  index,
  arrayLength,
  setLastPostCount,
  name,
  id,
  likes,
  clientName,
  post,
  deletePost,
}: IPostProps) => {
  const [sendModalOpened, setSendModalOpened] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [commentInputOpened, setCommentInputOpened] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [comments, setComments] = useState<any>([])
  const [lastComment, setLastComment] = useState<any>(null)
  const [editOpened, setEditOpened] = useState(false)
  const [editDescrOpened, setEditDescrOpened] = useState(false)
  const [error, setError] = useState('')
  const [areThereMoreComments, setAreThereMoreComments] = useState(true)
  const [whoLikedOpened, setWhoLikedOpened] = useState(false)
  const [editDescrValue, setEditDescrValue] = useState(text || '')
  const clientId = useAppSelector((state) => state.authSlice.id)

  const handleLike = async () => {
    const userLiked = doc(db, 'users', clientId)
    await updateDoc(userLiked, {
      likedPosts: arrayUnion(id),
    })
    const postLikes = doc(db, 'posts', id)
    await updateDoc(postLikes, {
      likes: arrayUnion(clientId),
    })
  }
  const handleRemoveLike = async () => {
    const userLiked = doc(db, 'users', clientId)
    await updateDoc(userLiked, {
      likedPosts: arrayRemove(id),
    })
    const postLikes = doc(db, 'posts', id)
    await updateDoc(postLikes, {
      likes: arrayRemove(clientId),
    })
  }

  const { ref, inView } = useInView({
    threshold: 0.2,
  })
  const getComments = async (lastDoc: any) => {
    if (!lastDoc) {
      try {
        const first = query(
          collection(db, 'posts', id, 'comments'),
          orderBy('createdAt', 'desc'),
          limit(3)
        )
        const documentSnapshots = await getDocs(first)

        const posts: any = []
        documentSnapshots.forEach((doc) => {
          posts.push({ ...doc.data(), id: doc.id })
        })

        const lastVisible =
          documentSnapshots.docs[documentSnapshots.docs.length - 1]
        if (documentSnapshots.docs.length < 3) {
          setAreThereMoreComments(false)
        }
        setLastComment(lastVisible)
        setComments(posts)
      } catch (error: any) {
        setError(error)
      }
    } else {
      try {
        const next = query(
          collection(db, 'posts', id, 'comments'),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(3)
        )
        const posts: any = []
        const documentSnapshots = await getDocs(next)
        documentSnapshots.forEach((doc) => {
          posts.push({ ...doc.data(), id: doc.id })
        })
        const lastVisible =
          documentSnapshots.docs[documentSnapshots.docs.length - 1]
        if (documentSnapshots.docs.length < 3) {
          setAreThereMoreComments(false)
        }
        if (lastVisible) {
          setLastComment(lastVisible)
        } else {
          setAreThereMoreComments(false)
        }
        setComments((prev: any) => [...prev, ...posts])
      } catch (error: any) {
        setError(error)
      }
    }
  }
  const handleEditDescrKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      updateDescription()
    } else if (e.keyCode === 27) {
      cancelComment()
    }
  }
  const updateDescription = async () => {
    if (
      editDescrValue.trim().length > 0 &&
      editDescrValue !== text &&
      editDescrValue.length < 15
    ) {
      setEditDescrValue('')
      setEditDescrOpened(false)
      const docRef = doc(db, 'posts', id)

      await updateDoc(docRef, {
        text: editDescrValue,
      })
    }
  }
  useEffect(() => {
    getComments(lastComment)
  }, [])

  const onKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      addComment(inputValue, id)
    }
  }

  const cancelComment = () => {
    setCommentInputOpened(false)
  }

  const addComment = async (value: string, postId: string) => {
    if (inputValue.trim().length !== 0) {
      setInputValue('')
      setCommentInputOpened(false)
      const docRef = await addDoc(collection(db, 'posts', postId, 'comments'), {
        userName: clientName,
        text: value,
        createdAt: serverTimestamp(),
      })
      setComments((state: any) => [
        { userName: clientName, text: value, createdAt: serverTimestamp() },
        ...state,
      ])
    }
  }

  const checkRef = arrayLength - 1 === index ? ref : null
  useEffect(() => {
    if (inView) {
      if (name === 'explore') {
        setLastPostCount((prev: number) => prev + 5)
      } else if (name === 'following') {
      }
    }
  }, [inView])

  return (
    <div ref={checkRef} className={styles.main}>
      {/* {error && <ErrorModal err={error} />} */}
      <div
        style={name === 'message' ? { width: '80%' } : {}}
        className={styles.container}
      >
        <div className={styles.userInfo}>
          <div className={styles.avatarWrapper}>
            <Link to={`/${userName}`}>
              <Avatar img={avatar} />
            </Link>
          </div>
          <Link to={`/${userName}`}>
            <div>{userName}</div>
          </Link>
        </div>
        <div className={styles.content}>
          {!imageLoaded && <Loader />}
          <img
            style={
              imageLoaded ? { visibility: 'visible' } : { visibility: 'hidden' }
            }
            src={imageUrl}
            onLoad={() => setImageLoaded(true)}
            alt=""
          />
        </div>
        <div className={styles.actions}>
          <div className={styles.mainActions}>
            <button>
              {likedPosts?.includes(id) ? (
                <img
                  onClick={handleRemoveLike}
                  src="https://img.icons8.com/glyph-neue/64/FFFFFF/like--v1.png"
                  alt="liked"
                />
              ) : (
                <img
                  onClick={handleLike}
                  src="https://img.icons8.com/glyph-neue/64/FFFFFF/hearts.png"
                  alt=""
                />
              )}
            </button>
            <button onClick={() => setCommentInputOpened((state) => !state)}>
              <img
                src="https://img.icons8.com/external-flat-icons-inmotus-design/67/FFFFFF/external-comment-browser-ui-small-size-optimized-set-flat-icons-inmotus-design.png"
                alt=""
              />
            </button>
            <button>
              <img
                onClick={() => setSendModalOpened(true)}
                src="https://img.icons8.com/sf-black-filled/64/FFFFFF/sent.png"
                alt=""
              />
            </button>
          </div>
          {clientName === userName && (
            <div className={styles.edit}>
              <button
                onClick={() => setEditOpened((state) => !state)}
                className={styles.editDots}
              >
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
              </button>
            </div>
          )}
          {editOpened && (
            <EditPost
              setEditOpened={setEditOpened}
              setEditDescrOpened={setEditDescrOpened}
              id={id}
              deletePost={deletePost}
            />
          )}
        </div>
        <button
          className={styles.whoLiked}
          onClick={() => setWhoLikedOpened(true)}
        >
          view likes
        </button>
        {sendModalOpened && (
          <SendPostList setSendModalOpened={setSendModalOpened} post={post} />
        )}
        {whoLikedOpened && (
          <PostLikesList setWhoLikedOpened={setWhoLikedOpened} id={id} />
        )}
        {!editDescrOpened ? (
          <div className={styles.likes}>
            <div>{userName}</div>{' '}
            <div className={styles.descrWrapper}>
              <span className={styles.descr}>{text}</span>
            </div>
          </div>
        ) : (
          <div className={styles.likes}>
            <div>{userName}</div>
            <div className={styles.editInput}>
              <input
                autoFocus
                onKeyDown={(e) => handleEditDescrKeyDown(e)}
                onChange={(e) => setEditDescrValue(e.target.value)}
                value={editDescrValue}
                className={styles.editName}
                type="text"
                placeholder={text ? text : 'description'}
              />
              <img
                className={styles.cancelEdit}
                onClick={() => setEditDescrOpened(false)}
                src="https://img.icons8.com/ios/50/22C3E6/cancel.png"
                alt=""
              />
              <img
                className={styles.sentEdit}
                onClick={updateDescription}
                src="https://img.icons8.com/sf-black-filled/64/22C3E6/sent.png"
                alt=""
              />
            </div>
          </div>
        )}
        <div className={styles.dots}>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>
        <div className={styles.comments}>
          {comments?.map((item: any) => (
            <CommentItem
              key={item.id}
              userName={item.userName}
              text={item.text}
            />
          ))}
        </div>
        <div>
          {areThereMoreComments && (
            <button
              onClick={() => getComments(lastComment)}
              className={styles.more}
            >
              View more comments
            </button>
          )}
        </div>
        {commentInputOpened && (
          <div className={styles.comDiv}>
            <input
              onKeyDown={(e) => onKeyDown(e)}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={styles.commentInput}
              type="text"
              placeholder="comment"
              autoFocus
            />
            <img
              onClick={() => addComment(inputValue, id)}
              className={styles.send}
              src="https://img.icons8.com/sf-black-filled/64/22C3E6/sent.png"
              alt="sent"
            />
            <img
              onClick={cancelComment}
              className={styles.cancel}
              src="https://img.icons8.com/ios/50/22C3E6/cancel.png"
              alt="cancel"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Post
