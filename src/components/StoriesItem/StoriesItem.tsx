import Avatar from '../Avatar/Avatar'
import styles from './StoriesItem.module.sass'
import { useNavigate } from 'react-router-dom'

interface IStoriesItem {
  avatar: string
  userName: string
  authorId?: string
  imageUrl?: string
  create?: boolean
  id?: string
  setCreateStoryOpened?: any
}
const StoriesItem = ({
  authorId,
  avatar,
  imageUrl,
  userName,
  create,
  id,
  setCreateStoryOpened,
}: IStoriesItem) => {
  const navigate = useNavigate()
  const handleNav = () => {
    if (id) {
      navigate(`/stories/${id}`)
    } else {
      setCreateStoryOpened(true)
    }
  }

  return (
    <div onClick={handleNav} className={styles.main}>
      <div
        style={create ? { background: '#fff' } : {}}
        className={styles.story}
      >
        <div
          style={create ? { background: 'none' } : {}}
          className={styles.storyBorder}
        >
          <div className={styles.image}>
            <div className={styles.back}></div>

            <Avatar img={avatar} />
          </div>
        </div>
      </div>
      <div className={styles.text}>{userName}</div>
    </div>
  )
}

export default StoriesItem
