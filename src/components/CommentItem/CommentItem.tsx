import React from 'react'
import styles from './CommentItem.module.sass'
import { Link } from 'react-router-dom'
interface comment {
  userName?: string
  text?: string
}
const CommentItem = ({ userName, text }: comment) => {
  return (
    <div className={styles.main}>
      <Link to={`${userName}`}>
        <div className={styles.name}>{userName}</div>
      </Link>
      <div className={styles.comment}>{text}</div>
    </div>
  )
}

export default CommentItem
