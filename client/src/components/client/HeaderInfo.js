import React from 'react'

export const HeaderInfo = ({email}) => {

  return (
    <div className="card header-info grey lighten-4">
      <p>Вы получите уведомления на {email} за 14, 7 и 3 дней до истечения срока размещения.</p>
      <p>По истечении срока работа сайта будет автоматически остановлена, поэтому своевременно оформляйте продление.</p>
      <p>По всем вопросам обращаться на <a href="mailto:zakaz@bss70.ru">zakaz@bss70.ru</a> или звонить по телефону 8 (3822) 32-81-73</p>
    </div>
  )
}