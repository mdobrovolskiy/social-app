import React, { useState, useEffect, useRef } from 'react'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import Loader from '../Loader/Loader'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import styles from './CreateStory.module.sass'
import ErrorModal from '../ErrorModal/ErrorModal'
import CloseIcon from '../CloseIcon/CloseIcon'
interface ICreateStory {
  authorId?: string
  avatar?: string
  userName?: string
  closeModal: () => void
}
const CreateStory = ({
  authorId,
  avatar,
  userName,
  closeModal,
}: ICreateStory) => {
  const [images, setImages] = React.useState<any>([])
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const maxNumber = 10
  useEffect(() => {
    if (
      document.documentElement.clientHeight <
      document.documentElement.offsetHeight
    ) {
      document.documentElement.style.overflowY = 'scroll'
    }

    document.documentElement.style.position = 'fixed'

    return () => {
      document.documentElement.style.overflowY = 'auto'
      document.documentElement.style.position = ''
    }
  }, [])
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (images[0]) {
      e.preventDefault()
      uploadImage(images[0].file)
    }
  }

  const modalRef: React.RefObject<HTMLDivElement> = useRef(null)

  useEffect(() => {
    if (progress === 100) {
      closeModal()
    }
  }, [progress])
  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit

    setImages(imageList as never[])
  }
  const metadata = {
    contentType: 'image/jpeg',
  }
  const sendPost = (image: string) => {
    addDoc(collection(db, 'stories'), {
      authorId,
      avatar,
      imageUrl: image,
      text,
      userName,
      createdAt: serverTimestamp(),
    })
  }
  const uploadImage = (file: any) => {
    const storage = getStorage()
    setIsLoading(true)
    if (
      (file.type === 'image/webp' ||
        file.type === 'image/png' ||
        file.type === 'image/jpeg' ||
        file.type === 'image/gif' ||
        file.type === 'image/bmp' ||
        file.type === 'image/heif' ||
        file.type === 'image/heic') &&
      file.size <= 5 * 1024 * 1024
    ) {
      // Upload file and metadata to the object 'images/mountains.jpg'
      const storageRef = ref(storage, 'images/' + file.name)
      const uploadTask = uploadBytesResumable(storageRef, file, metadata)

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setProgress(progress)
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused')
              break
            case 'running':
              console.log('Upload is running')
              break
          }
        },
        (error: any) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              setError(error)
              break
            case 'storage/canceled':
              // User canceled the upload
              setError(error)
              break

            // ...

            case 'storage/unknown':
              setError(error)
              break
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            sendPost(downloadURL)
          })
          setIsLoading(false)
        }
      )
    } else {
      alert('Max photo size is 5 mb, please choose different image')
    }
  }
  useEffect(() => {
    function handler(e: any) {
      if (e.target.contains(modalRef.current)) {
        closeModal()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
    }
  }, [])
  const closeThisModal = () => {
    closeModal()
  }
  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.main}>
          <div className={styles.item}>
            <Loader />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.close}>
        <CloseIcon func={closeThisModal} />
      </div>
      <div ref={modalRef} className={styles.main}>
        <form onSubmit={(e) => onSubmit(e)} id="main">
          <div className={styles.addPhoto}>
            {error && <ErrorModal err={error} />}
            <ImageUploading
              multiple
              value={images}
              onChange={onChange}
              maxNumber={maxNumber}
            >
              {({
                imageList,
                onImageUpload,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
              }) => (
                <>
                  {!imageList.length && (
                    <div className={styles.addButton}>
                      <button
                        type="button"
                        style={isDragging ? { color: 'red' } : undefined}
                        onClick={onImageUpload}
                        {...dragProps}
                      >
                        <img
                          width="60"
                          height="60"
                          src="https://img.icons8.com/ios-filled/50/228BE6/plus-key.png"
                          alt="plus-key"
                        />
                      </button>
                    </div>
                  )}
                  &nbsp;
                  {imageList.map((image, index) => (
                    <div key={index} className={styles.imageItem}>
                      <img
                        src={image.dataURL}
                        alt=""
                        className={styles.selectedImage}
                      />
                      <div className={styles.updateWrapper}>
                        <button
                          type="button"
                          className={styles.update}
                          onClick={() => onImageUpdate(index)}
                        >
                          <img
                            width="25"
                            height="25"
                            src="https://img.icons8.com/ios-filled/50/FFFFFF/synchronize.png"
                            alt="available-updates"
                          />
                        </button>
                        <button
                          type="button"
                          className={styles.update}
                          onClick={() => onImageRemove(index)}
                        >
                          <img
                            width="25"
                            height="25"
                            src="https://img.icons8.com/glyph-neue/64/FFFFFF/delete-forever.png"
                            alt="delete-forever"
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </ImageUploading>
          </div>

          <div className={styles.submit}>
            <button
              style={images[0] ? {} : { backgroundColor: 'grey' }}
              disabled={!images[0]}
              type="submit"
              form="main"
            >
              Upload story
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default CreateStory
