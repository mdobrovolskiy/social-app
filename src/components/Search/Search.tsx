import { useEffect, useState } from 'react'
import styles from './Search.module.sass'
// import SearchItem from '../SearchItem/SearchItem'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useAppDispatch } from '../../hooks'
import { changeNavBarSize } from '../../redux/slices/navBarSlice'
import { db } from '../../firebase'
import SearchItem from '../SearchItem/SearchItem'
interface ISearch {
  setSearchOpened: React.Dispatch<React.SetStateAction<boolean>>
  setIsMobileNavOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const Search = ({ setSearchOpened, setIsMobileNavOpen }: ISearch) => {
  const [inputValue, setInputValue] = useState('')
  const [users, setUsers] = useState([])
  const dispatch = useAppDispatch()
  useEffect(() => {
    async function getUsers() {
      const q = query(
        collection(db, 'users'),
        where('userName', '>=', inputValue)
      )

      const querySnapshot = await getDocs(q)
      const result: any = []
      querySnapshot.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() })
      })
      setUsers(result)
    }
    if (inputValue.length > 0) {
      getUsers()
    }
  }, [inputValue])

  const handleInputValue = (e: any) => {
    setInputValue(e.target.value)
  }
  const closeSearch = () => {
    dispatch(changeNavBarSize(false))
    setSearchOpened(false)
  }
  return (
    <div className={styles.main}>
      <div className={styles.searchHeader}>
        <div onClick={closeSearch} className={styles.close}>
          <div className={styles.closeItemLeft}></div>
          <div className={styles.closeItemRight}></div>
        </div>
        <div className={styles.text}>Search</div>
        <div className={styles.inputs}>
          <input
            value={inputValue}
            onChange={(e) => handleInputValue(e)}
            type="text"
            placeholder="Search"
          />
        </div>
      </div>
      <div className={styles.wrapper}>
        {inputValue &&
          users.map((user: any, i: number) => (
            <SearchItem
              setIsMobileNavOpen={setIsMobileNavOpen}
              setSearchOpened={setSearchOpened}
              key={user.id}
              name={user.userName}
              avatar={user.avatar}
            />
          ))}
      </div>
    </div>
  )
}

export default Search
