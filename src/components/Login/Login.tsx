import styles from './Login.module.sass'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth'
import { Link } from 'react-router-dom'
import Loader from '../Loader/Loader'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { setAuth } from '../../redux/slices/authSlice'

const Login = () => {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const auth = getAuth()
  const isAuthed = useAppSelector((state) => state.authSlice.isAuthed)

  const handleError = (message: string) => {
    switch (message) {
      case 'Firebase: Error (auth/invalid-email).':
        setError('invalid email')
        break
      case 'Firebase: Error (auth/user-not-found).':
        setError('user not found')
        break
      case 'Firebase: Error (auth/wrong-password).':
        setError('wrong password')
        break
      default:
        setError('an error occured, please check your connection')
        break
    }
  }

  const handleSignIn = (email: string, password: string) => {
    setIsLoading(true)
    const auth = getAuth()
    signInWithEmailAndPassword(auth, email, password)
      .then(() => navigate('/'))
      .catch((error) => {
        handleError(error.message)
        console.log(error.message)
      })
      .finally(() => setIsLoading(false))
  }
  const handleForm = (e: any) => {
    e.preventDefault()
    handleSignIn(email, pass)
  }
  const checkAuth = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('SIGNED IN')

        const uid = user.uid
        if (!isAuthed) {
          dispatch(setAuth({ isAuthed: true, id: uid }))
        }
      } else {
        console.log('NOT SIGNED')
        if (isAuthed) {
          dispatch(setAuth({ isAuthed: false, id: '' }))
        }
      }
    })
  }
  if (isAuthed) {
    navigate('/')
  }
  useEffect(() => {
    checkAuth()
  }, [])
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <form>
          <div className={styles.input}>
            <h1>Log in</h1>
          </div>
          <div className={styles.input}>
            <div className={styles.wrapper}>
              <input
                className={
                  error === 'invalid email' || error === 'user not found'
                    ? styles.activeError
                    : ''
                }
                type="email"
                placeholder="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {(error === 'invalid email' || error === 'user not found') && (
                <div className={styles.emailError}>{error}</div>
              )}
            </div>
          </div>
          <div className={styles.input}>
            <div className={styles.wrapper}>
              <input
                className={
                  error === 'wrong password' || error === 'user not found'
                    ? styles.activeError
                    : ''
                }
                type="password"
                placeholder="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
              <div className={styles.passError}>
                {error === 'wrong password' && error}
              </div>
            </div>
          </div>
          <div>
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
          <div className={styles.input}>
            <button onClick={handleForm}>Login</button>
          </div>
          <div className={styles.loader}>{isLoading && <Loader />} </div>
        </form>
      </div>
    </div>
  )
}

export default Login
