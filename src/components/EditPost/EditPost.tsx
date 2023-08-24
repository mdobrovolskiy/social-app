import React from 'react'
import styles from './EditPost.module.sass'
interface IEditPost {
  setEditOpened: React.Dispatch<React.SetStateAction<boolean>>
  deletePost: any
  id: string
  setEditDescrOpened: React.Dispatch<React.SetStateAction<boolean>>
}
const EditPost = ({
  deletePost,
  id,
  setEditDescrOpened,
  setEditOpened,
}: IEditPost) => {
  console.log(deletePost)
  const checkConfirm = () => {
    setEditOpened(() => false)
    const q = window.confirm('Delete this post?')
    if (q) {
      deletePost(id)
    }
  }
  const openEdit = () => {
    setEditDescrOpened(true)
    setEditOpened(() => false)
  }
  return (
    <div className={styles.main}>
      <div onClick={checkConfirm} className={styles.delete}>
        Delete{' '}
        <img
          width="15"
          height="15"
          src="https://img.icons8.com/material-rounded/24/FFFFFF/filled-trash.png"
          alt="filled-trash"
        />
      </div>
      <div onClick={openEdit} className={styles.edit}>
        Edit{' '}
        <img
          width="24"
          height="24"
          src="https://img.icons8.com/material-sharp/24/FFFFFF/edit--v1.png"
          alt="edit--v1"
        />
      </div>
    </div>
  )
}

export default EditPost
