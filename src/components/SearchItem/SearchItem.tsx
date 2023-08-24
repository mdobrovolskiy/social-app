import styles from './SearchItem.module.sass'
import Avatar from '../Avatar/Avatar'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../../hooks'
import { changeNavBarSize } from '../../redux/slices/navBarSlice'
interface ISearchItem {
  setSearchOpened: React.Dispatch<React.SetStateAction<boolean>>
  setIsMobileNavOpen: React.Dispatch<React.SetStateAction<boolean>>
  avatar: string
  name: string
}
const SearchItem = ({
  name,
  avatar,
  setSearchOpened,
  setIsMobileNavOpen,
}: ISearchItem) => {
  const dispatch = useAppDispatch()
  const closeWhenRedirect = () => {
    setIsMobileNavOpen(false)
    setSearchOpened(false)
    dispatch(changeNavBarSize(false))
  }
  return (
    <div className={styles.main}>
      <Link onClick={closeWhenRedirect} to={`${name}`}>
        <div className={styles.avatar}>
          <Avatar img={avatar} />
        </div>
      </Link>
      <Link onClick={closeWhenRedirect} to={`${name}`}>
        <div className={styles.name}>{name}</div>
      </Link>
    </div>
  )
}

export default SearchItem
