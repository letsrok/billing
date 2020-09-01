import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {useRoutes} from './routes'
import {useAuth} from './hooks/auth.hook'
import {AuthContext} from './context/AuthContext'
import {Navbar} from './components/client/Navbar'
import {AdminNavbar} from "./components/admin/AdminNavbar";
import {Loader} from './components/Loader'
import 'materialize-css'

function App() {
  const {token, login, logout, userId, userRole, userMail, ready} = useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated, userRole)

  if (!ready) {
    return <Loader />
  }

  return (
    <AuthContext.Provider value={{
      token, login, logout, userId, userRole, userMail, isAuthenticated
    }}>
      <Router>
        { isAuthenticated && userRole ==='admin' && <AdminNavbar /> }
        { isAuthenticated && userRole ==='client' && <Navbar /> }
        <div className="container">
          {routes}
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
