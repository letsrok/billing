import React, {useContext, useEffect} from "react";
import M from "materialize-css";
import {useHttp} from "../../hooks/http.hook";
import {useMessage} from "../../hooks/message.hook";
import {AuthContext} from "../../context/AuthContext";

export const ModalDeleteProduct = ({id, fetchProduct}) => {
  const {request} = useHttp()
  const message = useMessage()
  const {token} = useContext(AuthContext)

  useEffect(() => {
    const elem = window.document.querySelector('#delete-product')
    M.Modal.init(elem)
  }, [])

  const deleteProductHandler = async() => {
    const data = await request(`/api/products/delete/${id}`, 'DELETE', null, {
      Authorization: `Bearer ${token}`
    })

    if (data) {
      message('продукт удален')
      fetchProduct()
    }
  }

  return (
    <div
      id="delete-product"
      className="modal "
    >
      <div className="modal-content">
        <p>Вы уверены что хотите удалить продукт?</p>
      </div>
      <div className="modal-footer">
        <a href="#!" className="modal-close waves-effect waves-green btn-flat">Отмена</a>
        <a
          href="#!"
          className="modal-close waves-effect waves-green btn-flat red"
          onClick={deleteProductHandler}
        >
          Удалить
        </a>
      </div>
    </div>
  )
}

