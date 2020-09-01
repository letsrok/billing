import React, {useCallback, useContext, useEffect, useState} from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import {AuthContext} from '../../context/AuthContext'
import {useAuth} from "../../hooks/auth.hook";
import {Loader} from "../Loader";
import {useHttp} from "../../hooks/http.hook";
import {useMessage} from "../../hooks/message.hook";
import {diffDate} from "../../helpers/dateFormat";
import {ModalPaymentChoose} from "./ModalPyamentChoose";
import {ModalSber} from "./ModalSber";
import {ModalGenerateOrder} from "./ModalGenerateOrder";
import logo from "../../images/logo.png";

export const Navbar = () => {
  const history = useHistory()
  const auth = useContext(AuthContext)
  const {ready} = useAuth()
  const {token} = useContext(AuthContext)
  const {request, error, clearError, loading} = useHttp()
  const message = useMessage()

  const [user, setUser] = useState({})
  const [products, setProducts] = useState([])
  const [settings, setSettings] = useState({})
  const [expProducts, setExpProducts] = useState([])

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  const logoutHandler = event => {
    event.preventDefault()
    auth.logout()
    history.push('/')
  }

  const fetchInfo = useCallback(async () => {
    try {
      const data = await request(`/api/clients/pay`, 'GET', null, {
        Authorization: `Bearer ${token}`
      })

      if (data) {
        setUser(data.user)
        setProducts(data.products)
        setSettings(data.settings)
      }
    }
    catch {}
  }, [token, request])

  useEffect(() => {
    fetchInfo()
  }, [fetchInfo])

  useEffect(() => {
    if(products.length) {
      products.forEach(product => {
        const daysToEnd = product.type === 'domain'
          ? diffDate(product.dateStart)
          : diffDate(product.dateEnd, 'site')

        if(daysToEnd <= 30 ) {
          setExpProducts((expProducts) => [...expProducts, product])
        }
      })
    }
  }, [products])


  if (!ready) {
    return <Loader />
  }

  return (
    <header className="header container">
      <div className="header__logo">
        <a href="/">
          <img src={logo} alt=""/>
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

        {expProducts.length > 0 &&
        <div className="header__pay">
          <button
            className="btn green waves-effect waves-light modal-trigger"
            disabled={loading}
            data-target='payment-choose'
          >
            Продлить размещение
          </button>
        </div>
        }
      </div>
      <ModalPaymentChoose
        user={user}
        products={expProducts}
        settings={settings}
      >
      </ModalPaymentChoose>
      <ModalSber settings={settings} />
      <ModalGenerateOrder
        settings={settings}
        user={user}
        products={expProducts}
      />

    </header>
  )
}
