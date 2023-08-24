import { useState } from 'react'
import { useRef } from 'react'
import styles from './UserSettings.module.sass'
import ImageUploading, { ImageListType } from 'react-images-uploading'

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAppSelector } from '../../hooks'
import ErrorModal from '../ErrorModal/ErrorModal'

const storage = getStorage()

const metadata = {
  contentType: 'image/jpeg',
}

const UserSettings = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(40)
  const [images, setImages] = useState<any>([])

  const inputRef: any = useRef()
  const userId = useAppSelector((state) => state.authSlice.id)
  const updateImage = async (image: string) => {
    const userRef = doc(db, 'users', userId)

    await updateDoc(userRef, {
      avatar: image,
    })
  }
  const onSubmit = (e: any) => {
    if (images[0]) {
      e.preventDefault()
      uploadImage(images[0].file)
    }
  }
  const uploadImage = (file: any) => {
    setIsLoading(true)
    if (
      file.type === 'image/webp' ||
      file.type === 'image/png' ||
      file.type === 'image/jpeg' ||
      file.type === 'image/gif' ||
      file.type === 'image/bmp' ||
      (file.type === 'image/tiff' && file.size <= 5 * 1024 * 1024)
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
          switch (error.code) {
            case 'storage/unauthorized':
              setError(error)
              break
            case 'storage/canceled':
              setError(error)
              break

            case 'storage/unknown':
              setError(error)
              break
          }
        },
        () => {
          setIsLoading(false)
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            updateImage(downloadURL)
          })
          setImages([])
        }
      )
    }
  }
  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit

    setImages(imageList as never[])
  }
  const maxNumber = 10

  return (
    // <div>
    //
    //   <input type="file" ref={inputRef} accept="image/*" placeholder="upload" />
    //   <button
    //     style={{ color: '#fff' }}
    //     onClick={() => uploadImage(inputRef.current?.files[0])}
    //   >
    //     Upload
    //   </button>
    //
    // </div>
    <>
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
                      width="45"
                      height="45"
                      src="https://img.icons8.com/ios-filled/50/FFFFFF/plus-key.png"
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
                  {!isLoading && (
                    <div className={styles.updateWrapper}>
                      <button
                        type="button"
                        className={styles.update}
                        onClick={() => onImageUpdate(index)}
                      >
                        <img
                          className={styles.mainBtn}
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
                  )}
                </div>
              ))}
            </>
          )}
        </ImageUploading>
      </div>
      <div className={styles.loading}>
        {isLoading && (
          <>
            <label htmlFor="file">File progress:</label>
            <progress id="file" max="100" value={progress}>
              {' '}
              70%{' '}
            </progress>
          </>
        )}
      </div>
      {images[0] && !isLoading && (
        <div>
          {' '}
          <button
            className={styles.btn}
            style={{ color: '#fff' }}
            onClick={(e) => onSubmit(e)}
          >
            Upload
          </button>
        </div>
      )}
    </>
  )
}

export default UserSettings
