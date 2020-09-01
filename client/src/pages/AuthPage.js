import React, {useContext, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext'
import {HeaderLogin} from "../components/HeaderLogin";

export const AuthPage = () => {
  const history = useHistory()
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, request, error, clearError} = useHttp()
  const [form, setForm] = useState({
    email: '', password: ''
  })
  const [isHasAdmin, setIsHasAdmin] = useState(true);

  useEffect( () => {
    async function isAdmin() {
      const data = await request('/api/auth/has-admin', 'GET')
      setIsHasAdmin(data.isHasAdmin)
    }
    isAdmin();
  }, [request])

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  useEffect(() => {
    window.M.updateTextFields()
  }, [])

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register/admin', 'POST', {...form})
      message(data.message)
    } catch (e) {}
  }

  const inputKeyPress = (event) => {
    if(event.key === 'Enter') loginHandler()
  }

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', {...form})
      auth.login(data.token, data.userId, data.userRole, data.userMail)
      setTimeout(() => {
        window.location.reload(false)
      }, )
    } catch (e) {}
  }

  return (
    <>
      <HeaderLogin/>
      <div className="row">
        <div className="col m6  s12 offset-m3 ">
          <div className="card grey lighten-5">
            <div className="card-content">
              <span className="card-title center-align">Размещение сайтов</span>
              <div>

                <div className="input-field">
                  <input
                    placeholder="Введите email"
                    id="email"
                    type="text"
                    name="email"
                    className="black-input"
                    value={form.email}
                    onChange={changeHandler}
                    onKeyPress={inputKeyPress}
                  />
                  <label htmlFor="email">Email</label>
                </div>

                <div className="input-field">
                  <input
                    placeholder="Введите пароль"
                    id="password"
                    type="password"
                    name="password"
                    className="black-input"
                    value={form.password}
                    onChange={changeHandler}
                    onKeyPress={inputKeyPress}
                  />
                  <label htmlFor="email">Пароль</label>
                </div>

              </div>
            </div>
            <div className="card-action">
              <button
                className="btn-large green accent-6"
                style={{marginRight: 10}}
                disabled={loading}
                onClick={loginHandler}
              >
                Войти
              </button>
              {!isHasAdmin &&
              <button
                className="btn-large grey lighten-1 black-text"
                onClick={registerHandler}
                disabled={loading}
              >
                Регистрация
              </button>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
