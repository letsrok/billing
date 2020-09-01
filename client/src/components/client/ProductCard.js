import React, {useState, useEffect, useCallback} from "react";
import {diffDate, formatDate, formatDomainDate} from "../../helpers/dateFormat";
import {declOfNum} from "../../helpers/dateDeclination";
import M from "materialize-css";
import {useHttp} from "../../hooks/http.hook";

export const ProductCard = ({product, sendProduct}) => {
  const {loading} = useHttp()
  const [dateEnd, setDateEnd] = useState('')
  const [styleDaysLimit, setStyleDaysLimit] = useState('green-text')


  useEffect(() => {
    let days = 0

    if(product.type === 'domain') {
     days = diffDate(product.dateStart).toFixed(0)
    }
    else {
      days = diffDate(product.dateEnd, 'site').toFixed(0)
    }

    if(days < 1) {
      setDateEnd(`0 дней `)
      setStyleDaysLimit('red-text')
    }
    else {
      setStyleDaysLimit('green-text')
      const dateEndFormat = declOfNum(days)
      setDateEnd(`${dateEndFormat}`)
    }
  }, [product])
  useEffect(() => {
    const elems = window.document.querySelectorAll('.tooltipped')
    M.Tooltip.init(elems);
  }, [])

  const pushProduct = useCallback(() => {
    let productName = product.type === 'domain'
      ? `Регистрация домена ${product.name}`
      : `Размещение сайта ${product.name}`
    sendProduct(productName)
  }, [product, sendProduct])

  return (
    <div className='client-product '>
      <div className="client-product__top">
        <div className="client-product__title">
          <span>{product.name}</span>
        </div>
        <button
          className="client-product__cancel btn transparent tooltipped waves-effect waves-light modal-trigger"
          data-position="bottom"
          data-tooltip="Будет отправлено сообщение администратору"
          disabled={loading}
          href="#modal1"
          data-target='refuse'
          onClick={pushProduct}
        >
          Отказаться от услуги
        </button>
      </div>
      <div className="client-product__body">
        <div className="client-product__limit">
          <p>
            <span className={styleDaysLimit}>{dateEnd}</span>
            <span> до истечении срока {product.type === 'domain' ? 'регистрации домена ' : 'размещения сайта '}</span>
            <span className='blue-text'>{product.name}</span>
          </p>
        </div>
        <div className="client-product__info">
          <span>
            {
              product.type === 'domain'
              ? `дата окончания регистрации домена`
              : `размещение`
            }
          </span>
          <span className='strong'> {product.name}</span>
          <span>
            {
              product.type === 'domain'
              ? ` - ${formatDomainDate(product.dateStart)}`
              : ` с ${formatDate(product.dateStart)} по ${formatDate(product.dateEnd)}`
            }
          </span>
        </div>
      </div>

    </div>
  )
}
