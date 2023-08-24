import ProfilePostItem from '../ProfilePostItem/ProfilePostItem'
import styles from './ProfilePosts.module.sass'

const ProfilePosts = ({ userPosts }: any) => {
  return (
    <div className={styles.main}>
      {userPosts.map((post: any) => (
        <ProfilePostItem key={post.id} post={post} />
      ))}
    </div>
  )
}

export default ProfilePosts
