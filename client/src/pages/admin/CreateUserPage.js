import React, {useContext, useEffect, useState} from 'react'
import {NavLink} from "react-router-dom";
import {useHttp} from '../../hooks/http.hook'
import {AuthContext} from '../../context/AuthContext'
import {useMessage} from "../../hooks/message.hook";

export const CreateUserPage = () => {

  const auth = useContext(AuthContext)
  const {loading, request, error, clearError} = useHttp()
  const message = useMessage()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    contract: ''
  })

  const [isCreated, setIsCreated] = useState(false)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    window.M.updateTextFields()
  }, [])

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])


  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }


  const genPassword = () => {
    let password = Math.random().toString(36).slice(-10);

    setForm({...form, password})

    setTimeout(function () {
      window.M.updateTextFields()
    }, 0)
  }

  const createHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', {...form}, {
        Authorization: `Bearer ${auth.token}`
      })
      if(data) {
        setIsCreated(true)
        setUserId(data.user._id)
      }
    } catch (e) {}
  }

  const sendDataToMail = async() => {
    try{
      const data = await request('/api/mails/created', 'POST', {
        email: form.email,
        pass: form.password
      },
        {Authorization: `Bearer ${auth.token}`}
        )
      if(data.message === 'OK') {
        message('Доступы отправлены')
      }
    }
    catch{
      message('Не удалось отправить данные')
    }
  }


  return (
    <div className="row client-create">
      {!isCreated &&
      <div className="client-create__form row">
        <h3 className="center">Создать клиента</h3>
        <div className="col s12">
          <div className="client-create__box">

            <div className="input-field col m3 s6">
              <input
                id="name"
                type="text"
                name="name"
                className="black-input"
                value={form.name}
                onChange={changeHandler}
              />
              <label htmlFor="name">Клиент</label>
            </div>

            <div className="input-field col m3 s6">
              <input
                id="email"
                type="text"
                name="email"
                className="black-input"
                value={form.email}
                onChange={changeHandler}
              />
              <label htmlFor="email">E-mail</label>
            </div>

            <div className="input-field col m3 s6">
              <input
                id="password"
                type="text"
                name="password"
                className="black-input"
                value={form.password}
                onChange={changeHandler}
              />
              <label htmlFor="password">Пароль</label>
            </div>
            <div className="col m3 s6 ">
              <button
                className="btn-floating blue waves-effect waves-light"
                onClick={genPassword}
              >
                <i className="material-icons">edit</i>
              </button>
            </div>

          </div>
          <div className="client-create__box">
            <div className="input-field col m3 s6 left">
              <input
                id="contract"
                type="text"
                name="contract"
                className="black-input"
                value={form.contract}
                onChange={changeHandler}
              />
              <label htmlFor="contract">Номер договора (если имеется)</label>
            </div>
            <div className="input-field col m3 s6 center">
              <button
                className="btn green accent-6 waves-effect waves-light"
                disabled={loading}
                onClick={createHandler}
              >
                Сохранить
              </button>
            </div>

          </div>
        </div>
      </div>
      }

      {isCreated &&
        <div className="client-create__done row">
          <div className="client-create__box">
            <h4 className="center col l12">Клиент создан</h4>
            <div className="col s6 center">
              <button
                className="btn-large blue lighten-1 black-text waves-effect"
                onClick={sendDataToMail}
                disabled={loading}
              >
                Отправить доступы
              </button>
            </div>
            <div className="col s6 center">
              <NavLink
                className="btn-large teal lighten-2 black-text waves-effect"
                to={`/edit/${userId}`}
                disabled={loading}
              >
                перейти к редактированию
              </NavLink>
            </div>
          </div>
        </div>
      }

    </div>
  )
}
