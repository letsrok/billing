import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/AuthContext";
import {useMessage} from "../../hooks/message.hook";

export const SettingsPage = () => {
  const {loading, request, error, clearError} = useHttp()
  const auth = useContext(AuthContext)
  const message = useMessage()
  const [form, setForm] = useState({
    sber: '',
    mail: '',
    serial: '',
    basicCount: '',
    basicPrice: '',
    basicDomainPrice: '',
    basicSitePrice: '',
    basicCatalogPrice: ''
  })
  const [isHasSettings, setIsHasSettings] = useState(false);

  const tryFetchSettings = useCallback(async () => {
    try{
      const data = await request('/api/settings/get', 'GET')

      if(data) {
        let {sber, mail, serial, basicCount, basicPrice, basicDomainPrice, basicSitePrice, basicCatalogPrice} = data.settings

        serial = serial > 999 ? serial : '0'+serial

        setForm({...form, sber, mail, serial, basicCount, basicPrice, basicDomainPrice, basicSitePrice, basicCatalogPrice})

        setIsHasSettings(true)
        window.M.updateTextFields()
      }
    }
    catch {
      setIsHasSettings(false)
    }
  }, [request, setIsHasSettings, form])

  useEffect( () => {
    tryFetchSettings()
  }, [tryFetchSettings])

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  useEffect(() => {
    window.M.updateTextFields()
  }, [])

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const createHandler = async () => {
    try {
      const data = await request('/api/settings/create', 'POST', {...form}, {
        Authorization: `Bearer ${auth.token}`
      })
      if(data) {
        message('Настройки созданы')
        setForm({...form, ...data})
        setIsHasSettings(true)
      }
    } catch {}
  }

  const updateHandler = async () => {
    try{
      const data = await request('/api/settings/update', 'PUT', {...form}, {
        Authorization: `Bearer ${auth.token}`
      })
      if(data) {
        message('Настройки сохранены')
      }
    }
    catch{}
  }

  return (
    <div className="row">
      <div className="col s12 l6  offset-l3">
        <div className="card grey lighten-5">
          <div className="card-content">
            <span className="card-title center-align">Настройки</span>
            <div>

              <div className="input-field">
                <input
                  id="sber"
                  type="number"
                  name="sber"
                  className="black-input"
                  value={form.sber}
                  onChange={changeHandler}
                />
                <label htmlFor="sber">Номер карты сбербанка</label>
              </div>

              <div className="input-field">
                <input
                  id="mail"
                  type="email"
                  name="mail"
                  className="black-input validate"
                  value={form.mail}
                  onChange={changeHandler}
                />
                <label htmlFor="mail">E-mail для уведомлений клиентов</label>
                <span className="helper-text" data-error="Некорректный E-mail"></span>
              </div>

              <div className="input-field">
                <input
                  id="serial"
                  type="number"
                  name="serial"
                  className="black-input"
                  value={form.serial}
                  onChange={changeHandler}
                />
                <label htmlFor="serial">Текущий номер счета к генерации</label>
              </div>

              <div className="input-field">
                <input
                  id="basicPrice"
                  type="number"
                  name="basicPrice"
                  className="black-input"
                  value={form.basicPrice}
                  onChange={changeHandler}
                />
                <label htmlFor="basicPrice">Базовая стоимость размещения, руб.</label>
              </div>

              <div className="input-field">
                <input
                  id="basicCount"
                  type="number"
                  name="basicCount"
                  className="black-input"
                  value={form.basicCount}
                  onChange={changeHandler}
                />
                <label htmlFor="basicCount">Базовый срок размещения мес. </label>
              </div>

              <div className="input-field">
                <input
                  id="basicDomainPrice"
                  type="number"
                  name="basicDomainPrice"
                  className="black-input"
                  value={form.basicDomainPrice}
                  onChange={changeHandler}
                />
                <label htmlFor="basicCount">Базовый стоимость продления домена за ГОД </label>
              </div>

              <div className="input-field">
                <input
                  id="basicSitePrice"
                  type="number"
                  name="basicSitePrice"
                  className="black-input"
                  value={form.basicSitePrice}
                  onChange={changeHandler}
                />
                <label htmlFor="basicCount">Базовый стоимость размещения сайта за МЕСЯЦ </label>
              </div>

              <div className="input-field">
                <input
                  id="basicCatalogPrice"
                  type="number"
                  name="basicCatalogPrice"
                  className="black-input"
                  value={form.basicCatalogPrice}
                  onChange={changeHandler}
                />
                <label htmlFor="basicCount">Базовый стоимость размещения Каталога за МЕСЯЦ </label>
              </div>

            </div>
          </div>
          <div className="card-action">
            {isHasSettings &&
            <button
              className="btn green accent-6 waves-effect waves-light"
              disabled={loading }
              onClick={updateHandler}
            >
              Сохранить
            </button>}
            {!isHasSettings &&
            <button
              className="btn green accent-6 waves-effect waves-light"
              disabled={loading}
              onClick={createHandler}
            >
              Создать
            </button>}

          </div>
        </div>
      </div>
    </div>
  )
}
