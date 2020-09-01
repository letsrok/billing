import React from 'react'

export const HeaderLogin = () => {
  return (
    <div className="header-login row">
      <div className="header-login__logo">
        <a href="http://bss70.ru" target="_blank" rel="noopener noreferrer">
          <img src="images/logo.png" alt=""/>
        </a>
      </div>
      <div className="header-login__cont">
        <div className="header-login__phone">
          <a href="tel:+73822328173">8 3822 32-81-73</a>
        </div>
        <div className="header-login__graf">
          <p>пн-пт: 10:00-20:00</p>
          <p>сб-вс:  <span>выходной</span></p>
        </div>
        <div className="header-login__info">
          мы отвечаем на звонки даже в выходные с 11:00 до 15:00
        </div>
      </div>
      <div className="header-login__mail">
        <a href="mailto:zakaz@bss70.ru">zakaz@bss70.ru</a>
      </div>
    </div>
  )
}
