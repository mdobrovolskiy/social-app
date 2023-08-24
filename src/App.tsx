import './App.css'
import { lazy, Suspense } from 'react'

import { Routes, Route } from 'react-router-dom'

import NavBar from './components/NavBar/NavBar'
import Loader from './components/Loader/Loader'

const Home = lazy(() => import('./pages/Home/Home'))
const StoriesPage = lazy(() => import('./pages/StoriesPage/StoriesPage'))
const Messages = lazy(() => import('./pages/Messages/Messages'))
const ProfilePage = lazy(() => import('./pages/ProfilePage/ProfilePage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage/RegisterPage'))
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'))

function App() {
  return (
    <div className="App dark">
      <Suspense fallback={<Loader />}>
        <NavBar />

        <Routes>
          <Route
            path="/login"
            element={
              <Suspense fallback={<Loader />}>
                <LoginPage />
              </Suspense>
            }
          />
          <Route
            path="/register"
            element={
              <Suspense fallback={<Loader />}>
                <RegisterPage />
              </Suspense>
            }
          />
          <Route path="/" element={<Home />} />
          <Route
            path="/messages"
            element={
              <Suspense fallback={<Loader />}>
                <Messages />
              </Suspense>
            }
          />
          <Route
            path="/stories"
            element={
              <Suspense fallback={<Loader />}>
                <StoriesPage />
              </Suspense>
            }
          />
          <Route
            path="/stories/:story"
            element={
              <Suspense fallback={<Loader />}>
                <StoriesPage />
              </Suspense>
            }
          />
          <Route
            path="/messages/:user"
            element={
              <Suspense fallback={<Loader />}>
                <Messages />
              </Suspense>
            }
          />
          <Route
            path="/:username"
            element={
              <Suspense fallback={<Loader />}>
                <ProfilePage />
              </Suspense>
            }
          />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
