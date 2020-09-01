import React, {useCallback, useContext, useEffect, useState} from "react";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/AuthContext";
import M from "materialize-css";
import {Loader} from "../Loader";

export const ModalGenerateOrder = ({products, user, settings}) => {
  const {request, loading} = useHttp()
  const {token} = useContext(AuthContext)

  const [file, setFile] = useState('')
  const [sendTrigger, setSendTrigger] = useState(false)




  const getFile = useCallback(async() => {
    setSendTrigger(true)

    try{
      const data = await request('/api/file/generate', 'POST', {
        name: user.name,
        order: user.contract,
        serial: settings.serial,
        products
      }, {
        Authorization: `Bearer ${token}`
      })

      if(data) {
        setFile(data.file)
      }
    }
    catch{}
  }, [request, token, products, user, settings])

  useEffect(() => {
    const elem = window.document.querySelector('#generate-order')
    M.Modal.init(elem)
  }, [])

  return (
    <div
      id="generate-order"
      className="modal modal_w500"
    >

      <div className="modal-content">
        {!sendTrigger &&
        <button
          className='waves-effect waves-light btn blue accent-2 center-btn'
          onClick={getFile}
        > <i className="material-icons right">autorenew </i> Сгенерировать отчет
        </button>
        }
        {loading && <Loader></Loader>}
        {!loading && file.length > 0 &&
          <a
            className="btn green center-btn waves-effect waves-light"
            href={`docs/${file}.pdf`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <i className="material-icons right">cloud_download </i>
            Получить счет
          </a>
        }
      </div>

    </div>
  )
}

