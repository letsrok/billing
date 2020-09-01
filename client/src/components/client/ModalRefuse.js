import React, {useContext, useEffect} from "react";
import {useHttp} from "../../hooks/http.hook";
import {useMessage} from "../../hooks/message.hook";
import {AuthContext} from "../../context/AuthContext";
import M from "materialize-css";

export const ModalRefuse = ({name, product}) => {
  const {request, loading} = useHttp()
  const message = useMessage()
  const {token} = useContext(AuthContext)

  useEffect(() => {
    const elem = window.document.querySelector('#refuse')
    M.Modal.init(elem)
  }, [])

  const refuseHandler = async() => {
    console.log(name, product)
    try{
      const data = await request('/api/mails/refuse', 'POST', {name, product},
        {Authorization: `Bearer ${token}`}
      )
      if(data.message === 'OK') {
        message('Сообщение отправлено')
      }
    }
    catch{
      message('Не удалось отправить сообщение')
    }
  }


  return (
    <div
      id="refuse"
      className="modal "
    >
      <div className="modal-content">
        <p>Вы уверены что хотите отказаться от услуги "{product}" ?</p>
      </div>
      <div className="modal-footer">
        <a href="#!" className="modal-close waves-effect waves-green btn-flat">Отмена</a>
        <a
          href="#!"
          className="modal-close waves-effect waves-green btn-flat red"
          onClick={refuseHandler}
          disabled={loading}
        >
          Отказатсья
        </a>
      </div>
    </div>
  )
}
