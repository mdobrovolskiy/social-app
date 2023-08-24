import styles from './NavBarItem.module.sass'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { changeNavBarSize } from '../../redux/slices/navBarSlice'
import { useNavigate } from 'react-router-dom'
import { handlePostOpened } from '../../redux/slices/createPostSlice'
import { changeCategory } from '../../redux/slices/categorySlice'
import { handleMobileRec } from '../../redux/slices/mobileRecSlice'
import { setAuth } from '../../redux/slices/authSlice'
import { setUser } from '../../redux/slices/userSlice'
import { getAuth, signOut } from 'firebase/auth'
import { useState } from 'react'
interface IName {
  name: string
  img: string
}
interface Iitem {
  item: IName
  setSearchOpened: any
  setIsMobileNavOpen: any
}

const NavBarItem: React.FC<Iitem> = ({
  item,
  setSearchOpened,
  setIsMobileNavOpen,
}) => {
  const [confirmOpened, setConfirmOpened] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const logOut = () => {
    const auth = getAuth()
    signOut(auth)
      .then(() => {
        dispatch(setAuth({ isAuthed: false, id: '' }))
        dispatch(setUser({}))
      })
      .catch((error) => {})
  }
  const smallNavBar = useAppSelector(
    (state: any) => state.navBarSlice.smallNavBar
  )
  const clientName = useAppSelector((state) => state.userSlice.userName)
  const handleSizeChange = (item: any) => {
    switch (item.name) {
      case 'Log out':
        const result = window.confirm('Confirm logout')
        if (result) {
          logOut()
        }
        break
      case 'Create':
        dispatch(handlePostOpened(true))
        setIsMobileNavOpen(false)
        break
      case 'Search':
        setSearchOpened((state: any) => !state)
        dispatch(changeNavBarSize(!smallNavBar))
        break
      case 'Recommendations': {
        dispatch(handleMobileRec(true))
        setIsMobileNavOpen(false)
        break
      }
      case 'Home':
        navigate('/')
        window.scrollTo(0, 0)
        setIsMobileNavOpen(false)
        break
      case 'Profile':
        navigate(`/${clientName}`)
        setIsMobileNavOpen(false)
        break
      case 'Messages':
        navigate('/messages')
        setIsMobileNavOpen(false)
        break
      case 'Explore':
        navigate('/')
        dispatch(changeCategory('explore'))
        setIsMobileNavOpen(false)
        window.scrollTo(0, 0)
        break
      default:
        break
    }
  }
  const closeModal = () => {}

  return (
    <div onClick={() => handleSizeChange(item)} className={styles.main}>
      <div className={styles.image}>
        <img src={item.img} alt="logo" />
      </div>
      {!smallNavBar && <div className={styles.text}>{item.name}</div>}
    </div>
  )
}

export default NavBarItem
