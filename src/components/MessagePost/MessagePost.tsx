import React, { useState, useEffect } from 'react'
import styles from './MessagePost..module.sass'
import Avatar from '../Avatar/Avatar'
import Post from '../Post/Post'
import { useAppSelector } from '../../hooks'
import CloseIcon from '../CloseIcon/CloseIcon'
const MessagePost = ({ post, isAnyModalOpened, setIsAnyModalOpened }: any) => {
  const likedPosts = useAppSelector((state) => state.userSlice.likedPosts)
  const clientName = useAppSelector((state) => state.userSlice.userName)
  const [postModalOpened, setPostModalOpened] = useState(false)
  useEffect(() => {
    function handler(e: any) {
      if (e.path[0]?.classList[0]?.includes('postWrapper')) {
        setPostModalOpened(false)
        setIsAnyModalOpened(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
    }
  }, [postModalOpened])
  const openModal = () => {
    setPostModalOpened(true)
    setIsAnyModalOpened(true)
  }
  const closePost = () => {
    setPostModalOpened(false)
    setIsAnyModalOpened(false)
  }
  return (
    <>
      {postModalOpened && post && (
        <div className={styles.postWrapper}>
          <div className={styles.containerPost}>
            <div className={styles.closeWrap}>
              <CloseIcon func={closePost} />
            </div>
            <Post
              likedPosts={likedPosts}
              avatar={post.avatar}
              userName={post.userName}
              id={post.id}
              clientName={clientName}
              likes={post.likes}
              post={post}
              arrayLength={2}
              name="message"
              imageUrl={post.imageUrl}
            />
          </div>
        </div>
      )}

      <div
        onClick={openModal}
        style={isAnyModalOpened ? { visibility: 'hidden' } : {}}
        className={styles.main}
      >
        <div className={styles.user}>
          <div className={styles.avatarWrapper}>
            <Avatar img={post.avatar} />
          </div>
          <div className={styles.name}>{post.userName}</div>
        </div>
        <div className={styles.content}>
          <img className={styles.imageUrl} src={post.imageUrl} alt="" />
        </div>
      </div>
    </>
  )
}

export default MessagePost
