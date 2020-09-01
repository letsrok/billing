import React, {useCallback, useContext, useEffect, useState} from "react";
import M from "materialize-css";
import {useHttp} from "../../hooks/http.hook";
import {useMessage} from "../../hooks/message.hook";
import {AuthContext} from "../../context/AuthContext";
import InputMask from "react-input-mask";

export const ModalEditSite = ({id, fetchProduct}) => {
  const {request, loading} = useHttp()
  const message = useMessage()
  const {token} = useContext(AuthContext)

  const initialDomainForm = {
    name: '',
    dateStart: '',
    count: '12',
    price: '300',
  }

  const [form, setForm] = useState(initialDomainForm)

  const getProductHandler = useCallback(async () => {
    try {
      const data = await request(`/api/products/get-product/${id}`, "GET", null, {
        Authorization: `Bearer ${token}`
      })
      data.dateStart = new Date(data.dateStart).toLocaleDateString()
      data.dateEnd = new Date(data.dateEnd).toLocaleDateString()
      setForm(data)
      setTimeout(() => {window.M.updateTextFields()}, 0)
    }
    catch{}
  }, [id, token, request])

  useEffect(() => {

    if(id) getProductHandler()

  },[getProductHandler, id])


  useEffect(() => {
    const options = {
      onOpenStart: () => {
        window.M.updateTextFields()
      }
    }
    const elem = window.document.querySelector('#edit-site')
    M.Modal.init(elem, options)
  }, [])


  const changeFormHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }


  const saveFormHandler = useCallback(async () => {
    try{
      const data = await request(`/api/products/update${id}`, 'PUT', {...form}, {
        Authorization: `Bearer ${token}`
      })
      if(data) {
        message('услуга сохранена')
        fetchProduct()
        window.M.updateTextFields()
      }
    }
    catch{
      message('Некорректные данные')
      window.M.updateTextFields()
    }
  }, [form, id, request, message, fetchProduct, token])


  return (
    <div
      id="edit-site"
      className="modal "
    >
      { !loading &&
      <div className="modal-content">
        <div className="input-field input-field_m1 col m12 no-float ">
          <input
            id="name"
            type="text"
            name="name"
            className="black-input"
            value={form.name}
            onChange={changeFormHandler}
          />
          <label htmlFor="name">Название</label>
        </div>
        <div className="input-field input-field_m1 col m12 no-float ">
          <InputMask
            mask="99.99.9999"
            value={form.dateStart}
            onChange={changeFormHandler}
          >
            <input
              id="dateStart"
              type="text"
              name="dateStart"
              className="black-input"
            />
          </InputMask>

          <label htmlFor="dateStart">Начало</label>
        </div>
        <div className="input-field input-field_m1 col m12 no-float ">
          <InputMask
            mask="99.99.9999"
            value={form.dateEnd}
            onChange={changeFormHandler}
          >
            <input
              id="dateEnd"
              type="text"
              name="dateEnd"
              className="black-input"
            />
          </InputMask>

          <label htmlFor="dateStart">Конец</label>
        </div>
        <div className="input-field input-field_m1 col m12 no-float ">
          <input
            id="count"
            type="number"
            name="count"
            className="black-input"
            value={form.count}
            onChange={changeFormHandler}
          />
          <label htmlFor="count">Срок</label>
        </div>
        <div className="input-field input-field_m1 col m12 no-float ">
          <input
            id="price"
            type="number"
            name="price"
            className="black-input"
            value={form.price}
            onChange={changeFormHandler}
          />
          <label htmlFor="price">Цена</label>
        </div>
      </div>
      }
      <div className="modal-footer">
        <a
          className="btn green darken-3 black-text waves-effect"
          href="#!"
          onClick={saveFormHandler}
        >
          Сохранить
        </a>
      </div>
    </div>
  )
}
