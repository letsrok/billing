import React from "react";
import {diffDate} from "../../helpers/dateFormat";

export const ClientProductView = ({item, index, sendId, sendDomainId, sendSiteId}) => {

  const dateStart = new Date(item.dateStart).toLocaleDateString()
  const dateEnd = new Date(item.dateEnd).toLocaleDateString()

  const pushId = () => {
    sendId(item._id)
  }

  const pushDomainId = () => {
    sendDomainId(item._id)
  }

  const pushSiteId = () => {
    sendSiteId(item._id)
  }

  let style = item.type === 'domain'
    ? 'product-card card blue-grey lighten-4'
    : 'product-card card blue-grey lighten-2'

  let countEnd = 0

  if(item.type === 'domain') {
    countEnd = diffDate(dateStart)
  }
  else {
    countEnd = diffDate(dateEnd, 'site')
  }

  if (countEnd <=  30) style = style.replace('blue-grey', 'red')

  if(item.type === 'domain') {
    return (
      <div>
        <div className={style}>
          <div className="product-card__title">{`Домен #${index + 1}`}</div>
          <div className="product-card__box">
            <div className="product-card__cart w25">
              <div className="product-card__cart-title">Домен клиента</div>
              <div className="product-card__cart-val">{item.name}</div>
            </div>
            <div className="product-card__cart w25">
              <div className="product-card__cart-title">Зарегистрирован / продлен</div>
              <div className="product-card__cart-val">{dateStart}</div>
            </div>

            <div className="product-card__cart w25">
              <div className="product-card__cart-title">Срок</div>
              <div className="product-card__cart-val">{item.count}</div>
            </div>
            <div className="product-card__cart w25">
              <div className="product-card__cart-title">Цена</div>
              <div className="product-card__cart-val">{item.price}</div>
            </div>
          </div>
          <div className="product-card__control">
            <a
              className="btn-floating btn-small waves-effect waves-light  green accent-4 modal-trigger"
              onClick={pushDomainId}
              href="#modal2"
              data-target='edit-product'
            >
              <i className="material-icons">edit</i>
            </a>
            <a
              className="btn-floating btn-small waves-effect waves-light red modal-trigger"
              href="#modal1"
              data-target='delete-product'
              onClick={pushId}
             >
              <i className="material-icons">delete</i>
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className={style}>
        <div className="product-card__title">{`Размещение #${index + 1}`}</div>
        <div className="product-card__box">
          <div className="product-card__cart w25">
            <div className="product-card__cart-title">Сайт клиента</div>
            <div className="product-card__cart-val">{item.name}</div>
          </div>
          <div className="product-card__cart w20">
            <div className="product-card__cart-title">Начало</div>
            <div className="product-card__cart-val">{dateStart}</div>
          </div>
          <div className="product-card__cart w20">
            <div className="product-card__cart-title">Конец</div>
            <div className="product-card__cart-val">{dateEnd}</div>
          </div>
          <div className="product-card__cart w20">
            <div className="product-card__cart-title">Срок</div>
            <div className="product-card__cart-val">{item.count}</div>
          </div>
          <div className="product-card__cart w20">
            <div className="product-card__cart-title">Цена</div>
            <div className="product-card__cart-val">{item.price}</div>
          </div>
        </div>
        <div className="product-card__control">
          <a
            className="btn-floating btn-small waves-effect waves-light  green accent-4 modal-trigger"
            onClick={pushSiteId}
            href="#modal2"
            data-target='edit-site'
          >
            <i className="material-icons">edit</i>
          </a>
          <a
            className="btn-floating btn-small waves-effect waves-light red modal-trigger"
            href="#!"
            data-target='delete-product'
            onClick={pushId}
          >
            <i className="material-icons">delete</i>
          </a>
        </div>
      </div>
    </div>
  )

}
