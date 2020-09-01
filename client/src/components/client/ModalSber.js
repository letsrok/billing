import React, {useEffect, useState} from "react";
import M from "materialize-css";

export const ModalSber = ({settings}) => {

  const [cart, setCart] = useState(0)

  useEffect(() => {
    if(settings.sber) {
      let sber = settings.sber
      sber = sber.toString().replace(/(.{4})/g, '$1 ')
      setCart(sber)
    }
  }, [settings])

  useEffect(() => {
    const elem = window.document.querySelector('#modal-sber')
    M.Modal.init(elem)
  }, [])



  return (
    <div
      id="modal-sber"
      className="modal"
    >

      <div className="modal-content">
        <div className="modal-sber">
          <div className="modal-sber__title">Ваша заявка на продление принята.</div>
          <p>Номер карты сбербанка:
            <span> {cart} </span>
            (Илья Александрович).
          </p>
          <br/>
          <p>
            После совершения платежа напишите нам письмо с уведомлением
            <a href="mailto:zakaz@bss70.ru"> zakaz@bss70.ru </a>
            или позвоните. Так же можно дописать в примечании перевода название проекта, например: "bss70.ru".
          </p>
        </div>
      </div>

    </div>
  )
}





