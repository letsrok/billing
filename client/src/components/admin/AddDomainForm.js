import React, {useState, useCallback, useEffect} from "react";
import InputMask from "react-input-mask";
import {useHttp} from "../../hooks/http.hook";


export const AddDomainForm = ({userId, sendForm}) => {

  const {loading} = useHttp()

  const [domainForm, setDomainForm] = useState({})

  useEffect(() => {
    const initialDomainForm = {
      type: 'domain',
      name: '',
      dateStart: '',
      count: '12',
      price: '300',
      userId: userId
    }

    const selInitialValue = () => {
      setDomainForm(initialDomainForm)
    }
    selInitialValue()
  }, [userId])



  const changeDomainHandler = (event) => {
    setDomainForm({ ...domainForm, [event.target.name]: event.target.value })
  }

  const sendHandler = useCallback(() => {
    sendForm(domainForm)
  }, [domainForm, sendForm])

  return (
    <div className="add-domain card grey lighten-4">
      <div className="input-field input-field_m1 col m3 s6 ">
        <input
          id="name"
          type="text"
          name="name"
          className="black-input"
          value={domainForm.name}
          onChange={changeDomainHandler}
        />
        <label htmlFor="name">Название</label>
      </div>
      <div className="input-field input-field_m1 col m3 s6 ">
        <InputMask
          mask="99.99.9999"
          value={domainForm.dateStart}
          onChange={changeDomainHandler}
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
      <div className="input-field input-field_m1 col m3 s6 ">
        <input
          id="count"
          type="number"
          name="count"
          className="black-input"
          value={domainForm.count}
          onChange={changeDomainHandler}
        />
        <label htmlFor="count">Срок</label>
      </div>
      <div className="input-field input-field_m1 col m3 s6 ">
        <input
          id="price"
          type="number"
          name="price"
          className="black-input"
          value={domainForm.price}
          onChange={changeDomainHandler}
        />
        <label htmlFor="price">Цена</label>
      </div>
      <button
        className="btn green darken-3 black-text waves-effect"
        onClick={sendHandler}
        disabled={loading}
      >
        Сохранить
      </button>
    </div>
  )
}
