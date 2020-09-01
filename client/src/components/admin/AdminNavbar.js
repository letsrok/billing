import React, {useContext} from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import {AuthContext} from '../../context/AuthContext'
import {useAuth} from "../../hooks/auth.hook";
import {Loader} from "../Loader";
import logo from '../../images/logo.png'

export const AdminNavbar = () => {
  const history = useHistory()
  const auth = useContext(AuthContext)
  const {ready} = useAuth()

  const logoutHandler = event => {
    event.preventDefault()
    auth.logout()
    history.push('/')
  }


  if (!ready) {
    return <Loader />
  }

  return (
    <header className="header container">
      <div className="header__logo">
        <a href="/">
          <img src={logo} alt="Стартовая страница"/>
        </a>
      </div>
      <div className="header__slogan">
        размещение ваших сайтов
      </div>
      <div className="header__nav">
        <div className="header__info">
          <p>
            <NavLink to='/'>{auth.userMail}</NavLink>
          </p>
          <p>
            <a className="header__logout" href="/" onClick={logoutHandler}>Выйти</a>
          </p>
        </div>
        <div className="header__links">
          <NavLink
            className='btn blue darken-3 waves-effect waves-light'
            to='/settings'>
            настройки
          </NavLink>
          <NavLink
            className='btn green darken-3 waves-effect waves-light'
            to='/create'>
            создать пользователя
          </NavLink>
        </div>
      </div>
    </header>
  )
}
