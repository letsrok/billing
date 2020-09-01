import React, {useCallback, useEffect, useState} from "react";
import M from "materialize-css";

export const ModalPaymentChoose = ({products}) => {

  const [paymentType, setPaymentType] = useState('')
  const [totalSum, setTotalSum] = useState(0)

  useEffect(() => {
    const elem = window.document.querySelector('#payment-choose')
    M.Modal.init(elem)
  }, [])

  const handleOptionChange = (event) => {
    setPaymentType(event.target.value)
  }

  const checkTotalSum = useCallback(() => {
    let sum = products.reduce((total, item) => {
      return total + item.price
    }, 0)

    setTotalSum(sum)
  }, [products])

  useEffect(() => {
    checkTotalSum()
  }, [products, checkTotalSum])

  return (
    <div
      id="payment-choose"
      className="modal modal_w500"
    >

      <div className="modal-content">
        <div className="payment-choose__products">
          {products.map((item, index) => {
            return (
              <div className="payment-choose__product" key={index}>
                <div className="payment-choose__product-title">
                  <span>{item.type === 'domain'? `Продление домена ` : `Размещение сайта `}</span>
                  <span className="green-text">{item.name}</span>

                </div>
                <div className="payment-choose__product-info">
                  <span>{item.type === 'domain'? `1 год `: `12 месяцев `}</span>
                  <span> - {item.price} руб.</span>
                </div>
              </div>
            )
          })}
        </div>
        <div className="payment-choose__types">
          <div className="payment-choose__types-title">Предпочитаемый способ оплаты:</div>
          <div className="payment-choose__types-radio">
            <label>
              <input
                name="payment-types"
                type="radio"
                value="sber"
               // checked
                onClick={handleOptionChange}
              />
              <span>
                <img src="images/sber.png" alt=""/>
              </span>
            </label>
            <label>
              <input
                name="payment-types"
                type="radio"
                value="bill"
                onClick={handleOptionChange}
              />
              <span>
                <img src="images/bill.png" alt=""/>
              </span>
            </label>
          </div>
        </div>
        <div className="payment-choose__total">
          К оплате: {totalSum} рублей.
        </div>
      </div>
        <div className="payment-choose__nav">
          {paymentType === 'sber' &&
            <button
              className='btn blue waves-effect waves-light modal-trigger modal-close'
              data-target='modal-sber'
            >
              Получить реквизиты
            </button>
          }
          {paymentType === 'bill' &&
          <button
            className='btn blue waves-effect waves-light modal-trigger modal-close'
            data-target='generate-order'
          >
            Создать заявку
          </button>
          }
        </div>
    </div>
  )
}
