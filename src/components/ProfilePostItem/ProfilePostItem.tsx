import { useState } from 'react'
import styles from '../ProfilePosts/ProfilePosts.module.sass'
import Post from '../Post/Post'
import { useAppSelector } from '../../hooks'
import CloseIcon from '../CloseIcon/CloseIcon'
import { IPostData } from '../../types'
interface IPost {
  post: IPostData
}
const ProfilePostItem = ({ post }: IPost) => {
  const [postOpened, setPostOpened] = useState(false)
  const clientName = useAppSelector((state) => state.userSlice.userName)
  const likedPosts = useAppSelector((state) => state.userSlice.likedPosts)
  const closePostModal = () => {
    setPostOpened(false)
  }
  return (
    <div key={post.id} className={styles.postWrapper}>
      {postOpened && (
        <div className={styles.mainBg}>
          <div className={styles.close}>
            <CloseIcon func={closePostModal} />
          </div>
          <div className={styles.postWrap}>
            <Post
              id={post.id}
              name="message"
              userName={post.userName}
              imageUrl={post.imageUrl}
              post={post}
              arrayLength={1}
              likes={post.likes}
              clientName={clientName}
              avatar={post.avatar}
              likedPosts={likedPosts}
            />
          </div>
        </div>
      )}
      <div
        onClick={() => setPostOpened(true)}
        className={styles.postImage}
        style={{
          backgroundImage: `url('${post.imageUrl}')`,
        }}
      ></div>
    </div>
  )
}

export default ProfilePostItem
