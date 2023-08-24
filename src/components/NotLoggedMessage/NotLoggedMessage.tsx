import styles from './NotLoggedMessage.module.sass'
import { Link } from 'react-router-dom'
const NotLoggedMessage = () => {
  return (
    <div className={styles.main}>
      <div className={styles.message}>
        <h1>
          You have to be logged in to view this page,{' '}
          <button>
            <Link to="/login">Login</Link>
          </button>
        </h1>
      </div>
    </div>
  )
}

export default NotLoggedMessage
