import { useState } from 'react'
import styles from './ProfileHeader.module.sass'
import Avatar from '../Avatar/Avatar'
import Button from '../Button/Button'
import { useRef } from 'react'
import Loader from '../Loader/Loader'
import { useAppSelector, useAppDispatch } from '../../hooks'
import EditProfile from '../EditProfile/EditProfile'
import Following from '../Following/Following'
import { doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore'
import { db } from '../../firebase'
import FollowersList from '../FollowersList/FollowersList'
import { useNavigate } from 'react-router-dom'
import { handlePostOpened } from '../../redux/slices/createPostSlice'
import CreatePost from '../CreatePost/CreatePost'

interface IProfileData {
  userName?: string
  avatar?: string
  isLoading: boolean
  userId?: string
  isClientFollowed?: boolean
  checkFollowStatus?: any
  followers?: any
  following: any
  postsCount: number
}
const ProfileHeader = ({
  postsCount,
  userName,
  avatar,
  isLoading,
  userId,
  isClientFollowed,
  checkFollowStatus,
  following,
  followers,
}: IProfileData) => {
  const [followingOpen, setFollowingOpen] = useState(false)
  const [editOpened, setEditOpened] = useState(false)
  const [followersOpen, setFollowersOpen] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const createPostOpened = useAppSelector(
    (state) => state.createPostSlice.createPostOpened
  )
  const dispatch = useAppDispatch()
  const clientId = useAppSelector((state) => state.authSlice.id)
  const mainRef: any = useRef()
  const navigate = useNavigate()
  if (isLoading) {
    return <Loader />
  }

  const handleFollow = async () => {
    if (userId && clientId) {
      setFollowLoading(true)
      const followingsRef = doc(db, 'users', clientId)
      await updateDoc(followingsRef, {
        following: arrayUnion(userId),
      })
      const followersRef = doc(db, 'users', userId)
      await updateDoc(followersRef, {
        followers: arrayUnion(clientId),
      })

      setFollowLoading(false)
    }
  }
  const handleUnFollow = async () => {
    setFollowLoading(true)
    if (userId) {
      const followingsRef = doc(db, 'users', clientId)
      await updateDoc(followingsRef, {
        following: arrayRemove(userId),
      })
      const followersRef = doc(db, 'users', userId)
      await updateDoc(followersRef, {
        followers: arrayRemove(clientId),
      })
    }
    setFollowLoading(false)
  }

  const pushToMessages = () => {
    navigate(`/messages/${userName}`)
  }
  const checkUserStatus = () => {
    if (isClientFollowed) {
      return (
        <>
          {followLoading ? (
            <div className={styles.follow}>
              <Loader />
            </div>
          ) : (
            <div className={styles.follow}>
              <Button
                text="Unfollow"
                bgc="#fff"
                color="#000"
                onClick={handleUnFollow}
              />
            </div>
          )}
          <div className={styles.follow}>
            <Button text="Message" onClick={pushToMessages} />
          </div>
        </>
      )
    } else if (clientId === userId) {
      return (
        <>
          <div className={styles.follow}>
            <Button
              bgc="#fff"
              color="#000"
              text="Edit account"
              onClick={() => setEditOpened(true)}
            />
          </div>
          <div className={styles.follow}>
            <Button
              text="Create post"
              onClick={() => dispatch(handlePostOpened(true))}
            />
          </div>
        </>
      )
    } else {
      return (
        <>
          {followLoading ? (
            <div className={styles.follow}>
              <Loader />
            </div>
          ) : (
            <div className={styles.follow}>
              <Button text="Follow" onClick={handleFollow} />
            </div>
          )}
          <div className={styles.follow}>
            <Button text="Message" onClick={pushToMessages} />
          </div>
        </>
      )
    }
  }

  return (
    <div ref={mainRef} className={styles.main}>
      <div className={styles.left}>
        <div className={styles.avatarWrapper}>
          <Avatar img={avatar} />
        </div>
      </div>
      {createPostOpened && <CreatePost />}
      {followersOpen && (
        <FollowersList
          followers={followers}
          followersOpen={followersOpen}
          setFollowersOpen={setFollowersOpen}
        />
      )}
      {followingOpen && (
        <Following
          following={following}
          followingOpen={followingOpen}
          setFollowingOpen={setFollowingOpen}
        />
      )}
      {editOpened && (
        <EditProfile
          setEditOpened={setEditOpened}
          userName={userName}
          avatar={avatar}
        />
      )}
      <div className={styles.layout}>
        <div className={styles.right}>
          <div className={styles.topSection}>
            <div className={styles.nickName}>{userName}</div>
            <div className={styles.actions}>{checkUserStatus()}</div>
          </div>
          <div className={styles.userStats}>
            <div className={styles.userStat}>Posts {postsCount}</div>
            <div
              onClick={() => setFollowersOpen(true)}
              className={styles.userStat}
            >
              Followers {followers ? followers.length : '0'}
            </div>
            <div
              className={styles.userStat}
              onClick={() => setFollowingOpen(true)}
            >
              Following {following ? following.length : '0'}
            </div>
          </div>
          <div className={styles.userName}></div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
