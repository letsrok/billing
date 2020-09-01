import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from '../../hooks/http.hook'
import {AuthContext} from '../../context/AuthContext'
import {useParams} from 'react-router-dom'
import {useMessage} from "../../hooks/message.hook";
import {ProductsEdit} from "../../components/admin/ProductsEdit"
import {ModalChangePass} from "../../components/admin/ModalChangePass";
import {ModalDeleteClient} from "../../components/admin/ModalDeleteClient";
import {formatDate, getDateEnd} from "../../helpers/dateFormat";

export const EditUserPage = () => {
  const {token} = useContext(AuthContext)
  const {loading, request, error, clearError} = useHttp()
  const message = useMessage()
  const userId = useParams().id
  const [dateLimit, setDateLimit] = useState(0)

  const [form, setForm] = useState({
    name: '',
    email: '',
    contract: '',
    lastVisit: '',
    notes: '',
    lastMailSend: ''
  })

  const [products, setProducts] = useState([])

  useEffect(() => {
    window.M.updateTextFields()
    window.M.textareaAutoResize(window.document.querySelector('.form__textarea'))
  }, [])

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  const checkProducts = useCallback(() => {
    let res = getDateEnd(products)
    setDateLimit(res)

  }, [products])

  useEffect(() => {
    checkProducts()
  }, [checkProducts])

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const fetchUser = useCallback(async () => {
    try{
      const user = await request(`/api/clients/get-client-for-admin/${userId}`, "GET", null, {
        Authorization: `Bearer ${token}`
      })

      const {name, email, contract, lastVisit, notes, lastMailSend} = user
      setForm({...form, name, email, contract, lastVisit, notes, lastMailSend})
      window.M.updateTextFields()
      window.M.textareaAutoResize(window.document.querySelector('.form__textarea'))
    }
    catch{}
  }, [request, token, userId, setForm, form])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const getProducts = useCallback(async() => {
    try {
      const data = await request(`/api/products/get-products/${userId}`, "GET", null, {
        Authorization: `Bearer ${token}`
      })
      setProducts(data)
    }
    catch{}
  }, [request,token,  userId, setProducts])

  useEffect(() => {
    getProducts()
  }, [getProducts])



const saveUser = useCallback(async() => {
  try{
    const data = await request(`/api/auth/update${userId}`, 'PUT', {...form},
      {
        Authorization: `Bearer ${token}`
      })
    if(data) {
      message('Клиент сохранен')
      window.M.updateTextFields()
      window.M.textareaAutoResize(window.document.querySelector('.form__textarea'))
    }
  }
  catch{}
}, [token, request, userId, message, form])


  return (
    <div className="row client-edit">
      <h3 className="center">Редактирование клиента</h3>

        <div className="client-edit__box row card grey lighten-5">

          <div className="input-field input-field_m1 col m4 s6 ">
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

          <div className="input-field input-field_m1 col m4 s6">
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

          <div className="input-field input-field_m1 col m4 s6">
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

          <div className="input-field input-field_m1 col m12">
            <textarea
              id="notes"
              type="text"
              name="notes"
              className="black-input materialize-textarea form__textarea"
              value={form.notes}
              onChange={changeHandler}
            />
            <label htmlFor="notes">Заметки</label>
          </div>
        </div>
        <div className="client-edit__box client-edit__products row">
          <ProductsEdit id={userId} products={products} getProducts={getProducts}/>
        </div>

        <div className="client-edit__footer">
          <div className="client-edit__info">
            <p>Последнее уведомление клиенту: {formatDate(form.lastMailSend)}</p>
            <p>Последний визит клиента: {formatDate(form.lastVisit)}</p>
            <p>Размещение истечет через: {dateLimit}</p>
          </div>
        </div>
        <div className="client-edit__nav">
          <button
            className="btn green accent-6 black-text waves-effect edit-products__btn"
            onClick={saveUser}
            disabled={loading}
          >
          Сохранить
          </button>
          <a
            className=" btn waves-effect waves-light blue modal-trigger"
            href="#!"
            data-target='change-pass'
          >
            Изменить пароль
          </a>
          <a
            className=" btn waves-effect waves-light red modal-trigger"
            href="#!"
            data-target='delete-client'
          >
            Удалить клиента
          </a>
        </div>
      <ModalChangePass id={userId}/>
      <ModalDeleteClient id={userId}/>


    </div>
  )
}
