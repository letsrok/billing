import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData'

export const useAuth = () => {
  const [token, setToken] = useState(null)
  const [ready, setReady] = useState(false)
  const [userId, setUserId] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [userMail, setUserMail] = useState(null)

  const login = useCallback((jwtToken, id, role, mail) => {
    setToken(jwtToken)
    setUserId(id)
    setUserRole(role)
    setUserMail(mail)

    localStorage.setItem(storageName, JSON.stringify({
      userId: id, userRole:role, token: jwtToken, userMail: mail
    }))

  }, [])


  const logout = useCallback(() => {
    setToken(null)
    setUserId(null)
    setUserRole(null)
    setUserMail(null)
    localStorage.removeItem(storageName)
  }, [])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName))

    if (data && data.token) {
      login(data.token, data.userId, data.userRole, data.userMail)
    }
    setReady(true)
  }, [login])


  return { login, logout, token, userId, userRole, userMail, ready }
}
