import react, { useState, memo, useEffect, useRef } from 'react'
import styles from './NavBar.module.sass'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { useNavigate } from 'react-router-dom'
import { changeNavBarSize } from '../../redux/slices/navBarSlice'
import { data } from './data'
import NavBarItem from '../NavBarItem/NavBarItem'
import { useLocation } from 'react-router-dom'
import Search from '../Search/Search'

const NavBar = memo(() => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [media, setMedia] = useState<'mobile' | 'desktop' | null>(null)
  const [navStyle, setNavStyle] = useState({ display: 'none' })
  const [searchOpened, setSearchOpened] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const smallNavBar = useAppSelector((state) => state.navBarSlice.smallNavBar)
  const isAuthed = useAppSelector((state) => state.authSlice.isAuthed)
  const dispatch = useAppDispatch()
  useEffect(() => {
    const mediaWatcher = window.matchMedia('(max-width: 1100px)')
    if (mediaWatcher.matches) {
      setMedia('mobile')
    } else {
      setMedia('desktop')
    }

    function updateIsNarrowScreen(e: any) {
      if (mediaWatcher.matches) {
        setMedia('mobile')
      } else {
        setMedia('desktop')
      }
    }
    mediaWatcher.addEventListener('change', updateIsNarrowScreen)

    return function cleanup() {
      mediaWatcher.removeEventListener('change', updateIsNarrowScreen)
    }
  }, [])

  useEffect(() => {
    if (searchOpened) {
      if (!smallNavBar) {
        dispatch(changeNavBarSize(true))
      }
    }
  }, [searchOpened, smallNavBar])
  const handleNavBar = () => {
    if (media === 'desktop') {
      setNavStyle({ display: 'block' })
    } else if (media === 'mobile' && isMobileNavOpen) {
      setNavStyle({ display: 'block' })
    } else {
      setNavStyle({ display: 'none' })
    }
  }
  useEffect(() => {
    handleNavBar()
  }, [media, isMobileNavOpen])
  if (!isAuthed) {
    return <></>
  }
  if (
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname.includes('messages') ||
    location.pathname.includes('stories')
  ) {
    return <></>
  }
  return (
    <>
      <div className={styles.burger}>
        {media === 'mobile' && !isMobileNavOpen && (
          <div onClick={() => setIsMobileNavOpen(true)} className={styles.wrap}>
            <div className={styles.item}></div>
            <div className={styles.item}></div>
            <div className={styles.item}></div>
          </div>
        )}
        {media === 'mobile' && isMobileNavOpen && !searchOpened && (
          <div
            onClick={() => setIsMobileNavOpen(false)}
            className={styles.close}
          >
            <div className={styles.closeItemLeft}></div>
            <div className={styles.closeItemRight}></div>
          </div>
        )}
        <div className={styles.logo}>
          <h1>
            <i>Instagram</i>
          </h1>
        </div>
      </div>
      <div style={navStyle} className={styles.father}>
        {searchOpened && (
          <Search
            setIsMobileNavOpen={setIsMobileNavOpen}
            setSearchOpened={setSearchOpened}
          />
        )}
        <div className={styles.wrapper}>
          <div className={`${styles.main} ${smallNavBar ? styles.small : ''}`}>
            {media === 'desktop' ? (
              <div
                onClick={() => navigate('/')}
                className={`${styles.logo} ${
                  smallNavBar ? styles.smalllogo : ''
                }`}
              >
                <img
                  className={styles.logoImg}
                  src="https://www.edigitalagency.com.au/wp-content/uploads/new-Instagram-logo-white-glyph.png"
                  alt="logo"
                />
              </div>
            ) : (
              <div className={styles.filler}></div>
            )}
            <div>
              {data.map((item) => (
                <NavBarItem
                  setIsMobileNavOpen={setIsMobileNavOpen}
                  key={item.name}
                  item={item}
                  setSearchOpened={setSearchOpened}
                />
              ))}
              {media === 'mobile' && (
                <NavBarItem
                  setIsMobileNavOpen={setIsMobileNavOpen}
                  setSearchOpened={setSearchOpened}
                  key="extra"
                  item={{
                    name: 'Recommendations',
                    img: 'https://cdn-icons-png.flaticon.com/128/5949/5949137.png',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
})

export default NavBar
