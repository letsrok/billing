import React, {useState, useEffect, useCallback, useContext} from 'react'
import {AuthContext} from '../../context/AuthContext'
import {useMessage} from "../../hooks/message.hook"
import {useHttp} from "../../hooks/http.hook";
import {ClientView} from "../../components/admin/ClientView";
import {Loader} from "../../components/Loader";
import {ModalDeleteClient} from "../../components/admin/ModalDeleteClient";

export const ClientsListPage = () => {

  const {token} = useContext(AuthContext)
  const {loading, request} = useHttp()
  const message = useMessage()

  const [clients, setClients] = useState([])
  const [idDelete, setIdDelete] = useState(0)

  const fetchClients = useCallback(async () => {
    try{
      const data = await request('/api/clients/all', 'GET', null, {
        Authorization: `Bearer ${token}`
      })

      if(data) {
        setClients(data)
        message('Клиенты загружены')
      }
    }
    catch{}
  }, [request, token, message])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const getDeleteId = useCallback((id) => {
    setIdDelete(id)
  }, [])

  const hasClientDelete = useCallback(() => {
    fetchClients()
  }, [fetchClients])

  if(loading) {
    return <Loader/>
  }

  return (
    <div className='row clients-list'>
      {!clients.length &&
        <div>Нет клиентов</div>
      }
      {clients.length > 0 &&
        <div>
          <table className="striped">
            <thead>
              <tr>
                <th>Клиент</th>
                <th>Домены</th>
                <th>Размещение</th>
                <th>Остаток дней</th>
                <th>Последний визит</th>
                <th>Управление</th>
              </tr>
            </thead>
            <tbody>
              { clients.map((item, index) => {
                return <ClientView
                  user={item}
                  key={index}
                  index={index}
                  sendId={getDeleteId}
                >

                </ClientView>
              })}
            </tbody>
          </table>
          <ModalDeleteClient id={idDelete} deleteCallback={hasClientDelete}>

          </ModalDeleteClient>
        </div>

      }
    </div>
  )
}
