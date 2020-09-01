import React, {useContext, useEffect} from "react";
import {useHistory} from 'react-router-dom'
import {useHttp} from "../../hooks/http.hook";
import {useMessage} from "../../hooks/message.hook";
import {AuthContext} from "../../context/AuthContext";
import M from "materialize-css";

export const ModalDeleteClient = ({id, deleteCallback}) => {
  const {request} = useHttp()
  const message = useMessage()
  const {token} = useContext(AuthContext)
  const history = useHistory()

  useEffect(() => {
    const elem = window.document.querySelector('#delete-client')
    M.Modal.init(elem)
  }, [])

  const deleteClientHandler = async() => {
    const data = await request(`/api/clients/delete/${id}`, 'DELETE', null, {
      Authorization: `Bearer ${token}`
    })

    if (data) {
      message('клиент удален')
      if(deleteCallback) {
        deleteCallback()
      }
      else {
        history.push('/')
      }
    }
  }

  return (
    <div
      id="delete-client"
      className="modal "
    >
      <div className="modal-content">
        <p>Вы уверены что хотите удалить Клиента?</p>
      </div>
      <div className="modal-footer">
        <a href="#!" className="modal-close waves-effect waves-green btn-flat">Отмена</a>
        <a
          href="#!"
          className="modal-close waves-effect waves-green btn-flat red"
          onClick={deleteClientHandler}
        >
          Удалить
        </a>
      </div>
    </div>
  )
}
