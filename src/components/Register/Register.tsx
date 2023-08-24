import { useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './Register.module.sass'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth'
import Loader from '../Loader/Loader'
import { debounce } from '../../hooks/debounce'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
import { doc, setDoc } from 'firebase/firestore'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { setAuth } from '../../redux/slices/authSlice'
const regExp =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

const Register = () => {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userName, setUserName] = useState('')
  const [nameLoading, setNameLoading] = useState(false)
  const [nameError, setNameError] = useState<boolean>(false)

  const isAuthed = useAppSelector((state) => state.authSlice.isAuthed)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const createUser = async (uid: string) => {
    await setDoc(doc(db, 'users', uid), {
      avatar:
        'https://vyshnevyi-partners.com/wp-content/uploads/2016/12/no-avatar.png',
      userName: userName.trim().toLowerCase(),
      email,
      id: uid,
      followers: [],
      following: [],
      likedPosts: [],
    })
    return uid
  }

  const handleError = (message: string) => {
    switch (message) {
      case 'Firebase: Error (auth/email-already-in-use).':
        setError('user with this email already exists')
        break
      default:
        setError('an error occured, plase check your connection')
        break
    }
  }
  const handleSignUp = async (email: string, password: string) => {
    if (!email.match(regExp)) {
      setError('Invalid email')
      return
    }
    if (nameError) {
      setError('username is already taken')
      return
    }
    if (userName.length < 4 || userName.length > 16) {
      setError('Username should be 16 or less symbols')
      return
    }
    if (email.length > 5 && password.length > 5 && userName.length > 3) {
      setIsLoading(true)

      try {
        const auth = getAuth()
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )
        const userId = await createUser(user.uid)
        dispatch(setAuth({ isAuthed: true, id: userId }))
      } catch (error: any) {
        handleError(error.message)
      } finally {
        setIsLoading(false)
        // navigate('/')
      }
    } else {
      setError('Email and password should be at least 6 symbols.')
    }
  }
  const handleForm = (e: any) => {
    e.preventDefault()
    handleSignUp(email, pass)
  }
  const checkUserName = async (name: string) => {
    if (name === 'login' || name === 'register' || name.trim().length < 4) {
      setError('username has to be between 4 to 16 characters')
      return
    }
    setNameLoading(true)
    const q = query(collection(db, 'users'), where('userName', '==', name))

    const querySnapshot = await getDocs(q)
    if (querySnapshot.docs.length > 0) {
      setNameError(true)
    } else {
      setNameError(false)
    }
    setNameLoading(false)
  }

  const debouncedConsole = useMemo(() => {
    return debounce(checkUserName, 1000)
  }, [])

  const onUserNameChange = (e: any) => {
    setUserName(e.target.value)
    debouncedConsole(e.target.value)
  }
  const checkAuth = () => {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid
        if (!isAuthed) {
          dispatch(setAuth({ isAuthed: true, id: uid }))
        }
      } else {
        if (isAuthed) {
          dispatch(setAuth({ isAuthed: false, id: '' }))
        }
      }
    })
  }
  useEffect(() => {
    if (isAuthed) {
      navigate('/')
    }
  }, [isAuthed])
  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <form>
          <div className={styles.input}>
            <h1>Sign up</h1>
          </div>
          {error && (
            <div className={styles.input}>
              <div className={styles.errorMessage}>{error}</div>
            </div>
          )}
          <div className={styles.input}>
            <input
              type="text"
              placeholder="username"
              value={userName}
              onChange={(e) => onUserNameChange(e)}
            />
            <div className={styles.status}>
              {nameLoading ? (
                <Loader />
              ) : nameError ? (
                <img
                  src="https://cdn-icons-png.flaticon.com/128/1828/1828665.png"
                  alt=""
                />
              ) : userName.trim().length > 3 ? (
                <img
                  src="https://cdn-icons-png.flaticon.com/128/5299/5299035.png"
                  alt=""
                />
              ) : (
                <img
                  src="https://cdn-icons-png.flaticon.com/128/1828/1828665.png"
                  alt=""
                />
              )}
            </div>
          </div>
          <div className={styles.input}>
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.input}>
            <input
              type="password"
              placeholder="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <div>
            Already have an account? <Link to="/login">Log in</Link>
          </div>
          <div className={styles.input}>
            <button disabled={nameLoading} onClick={handleForm}>
              Sign up
            </button>
          </div>
          <div className={styles.loader}>{isLoading && <Loader />} </div>
        </form>
      </div>
    </div>
  )
}

export default Register
