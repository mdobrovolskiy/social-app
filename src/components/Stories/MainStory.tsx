import React from 'react'

import styles from './Stories.module.sass'
import { useState } from 'react'
import Loader from '../Loader/Loader'
import { Link } from 'react-router-dom'
interface IMainStory {
  story: any
  handlePauseDown: any
  handlePauseUp: any
}
const MainStory: React.FC<IMainStory> = ({
  story,
  handlePauseUp,
  handlePauseDown,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  return (
    <>
      <div className={styles.avatarText}>
        <Link to={`/${story.userName}`}>
          <span>{story.userName}</span>
        </Link>
      </div>
      <Link to={`/${story.userName}`}>
        <img className={styles.avatar} src={story.avatar} alt="avatar" />
      </Link>
      {!imageLoaded && <Loader />}
      <img
        style={
          imageLoaded ? { visibility: 'visible' } : { visibility: 'hidden' }
        }
        onMouseDown={() => handlePauseDown()}
        onMouseUp={() => handlePauseUp()}
        src={story.imageUrl}
        alt=""
        onLoad={() => setImageLoaded(true)}
      />
    </>
  )
}

export default MainStory
