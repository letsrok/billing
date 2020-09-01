import {useHttp} from "../../hooks/http.hook";
import {useMessage} from "../../hooks/message.hook";
import React, {useState, useContext, useEffect} from "react";
import {AuthContext} from "../../context/AuthContext";

import M from "materialize-css";

export const ModalChangePass = ({id}) => {
  const {request, loading} = useHttp()
  const message = useMessage()
  const {token} = useContext(AuthContext)

  const [password, setPassword] = useState('')
  const [isPassSend, setIsPassSend] = useState(false)

  useEffect(() => {
    const elem = window.document.querySelector('#change-pass')
    M.Modal.init(elem)
  }, [])



  const genPassword = () => {
    let password = Math.random().toString(36).slice(-10);

    setPassword(password)

    setTimeout(function () {
      window.M.updateTextFields()
    }, 0)
  }

  const changePassHandler = async() => {
    const data = await request(`/api/auth/change-pass${id}`, 'PUT', {password}, {
      Authorization: `Bearer ${token}`
    })

    if (data) {
      message('пароль изменен')
      setIsPassSend(true)
      const tooltip = window.document.querySelector('.tooltipped')
      M.Tooltip.init(tooltip)
    }
  }

  const sendDataToMail = async() => {
    try{
      const data = await request('/api/mails/change-pass', 'POST', {password, id},
        {Authorization: `Bearer ${token}`}
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
    <div
      id="change-pass"
      className="modal "
    >
      <div className="modal-content">
        <div className="input-field col m12 no-float">
          <input
            id="password"
            type="text"
            name="password"
            className="black-input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <label htmlFor="password">Пароль</label>
          <button
            className="btn-floating blue waves-effect waves-light"
            onClick={genPassword}
          >
            <i className="material-icons">edit</i>
          </button>
          {isPassSend &&
            <button
              className="btn-floating blue waves-effect waves-light ml-20 a-tooltip tooltipped"
              onClick={sendDataToMail}
              data-position="right"
              data-tooltip="Отправить доступы"
              disabled={loading}
            >
              <i className="material-icons">send</i>
            </button>
          }
        </div>
      </div>
      <div className="modal-footer">
        <a
          href="#!"
          className="waves-effect waves-green btn-flat green"
          onClick={changePassHandler}
          disabled={loading}
        >
          Сохранить
        </a>
      </div>
    </div>
  )
}
