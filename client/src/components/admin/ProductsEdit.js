import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useMessage} from "../../hooks/message.hook";
import {Loader} from "../Loader";
import {useHttp} from '../../hooks/http.hook'
import {AuthContext} from '../../context/AuthContext'
import {AddDomainForm} from './AddDomainForm'
import {AddSiteForm} from './AddSiteForm'
import {ClientProductView} from "./ClientProductView";
import {ModalDeleteProduct} from "./ModalDeleteProduct";
import {ModalEditProduct} from "./ModalEditDomain";
import {ModalEditSite} from "./ModalEditSite";

export const ProductsEdit = ({products, id, getProducts}) => {

  const {token} = useContext(AuthContext)
  const {loading, request, error, clearError} = useHttp()
  const message = useMessage()

  const [productId, setProductId] = useState(0)
  const [domainId, setDomainId] = useState(0)
  const [siteId, setSiteId] = useState(0)

  const [settings, setSettings] = useState({
    count: 9,
    price: 300
  })

  const [isShowDomainForm, setIsShowDomainForm] = useState(false)
  const [isShowSiteForm, setIsShowSiteForm] = useState(false)

  const showDomainForm = useCallback( () => {
      setIsShowDomainForm(true)
      setIsShowSiteForm(false)
      setTimeout(() => {
        window.M.updateTextFields()
      }, 0)
    },
    [] )

  const showSiteForm = useCallback( () => {
      setIsShowDomainForm(false)
      setIsShowSiteForm(true)
      setTimeout(() => {
        window.M.updateTextFields()
      }, 0)
    },
    [] )

  const getProductId = (id) => {
    setProductId(id)
  }

  const getDomainId = (id) => {
    setDomainId(id)
  }

  const getSiteId = (id) => {
    setSiteId(id)
  }

  useEffect(() => {
    window.M.updateTextFields()
  }, [])

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  const fetchSettings = useCallback(async() => {
    try{
      const data = await request('/api/settings/get', 'GET')

      if(data) {
        const {basicCount, basicPrice} = data.settings
        setSettings({
          count: basicCount,
          price: basicPrice
        })
      }
    }
    catch {}
  }, [request])

  useEffect( () => {
    fetchSettings()
  }, [fetchSettings])

  // save Domain
  const saveDomainHandler = async (formValue) => {
    try{
      const data = await request('/api/products/add', "POST", {...formValue}, {
        Authorization: `Bearer ${token}`
      })
      if(data) {
        message('Услуга добавлена')
        setIsShowDomainForm(false)
        getProducts()
      }
    }
    catch{}
  }

  // save Site
  const saveSiteHandler = async (formValue) => {
    try{
      const data = await request('/api/products/add', "POST", {...formValue}, {
        Authorization: `Bearer ${token}`
      })
      if(data) {
        message('Услуга добавлена')
        setIsShowSiteForm(false)
        getProducts()
      }
    }
    catch{}
  }

  return (
    <div className="edit-products col s12">
      {loading &&
        <Loader/>
      }
      {products &&
        <div className="edit-products__list">
          {products.map((item, index) => {
            return <ClientProductView
              item={item}
              index={index}
              key={index}
              sendId={getProductId}
              sendDomainId={getDomainId}
              sendSiteId={getSiteId}
            />
          })
          }
        </div>
      }
      {!products &&
      <div className="edit-products__list">
        Нет продуктов
      </div>
      }
      {isShowDomainForm && <AddDomainForm sendForm = {saveDomainHandler} userId = {id} />}
      {isShowSiteForm && <AddSiteForm sendForm = {saveSiteHandler} userId = {id} settings={settings}/>}
      <button
        className="btn blue accent-3 black-text waves-effect edit-products__btn"
        onClick={showSiteForm}
        disabled={loading}
      >
        Добавить размещение
      </button>
      <button
        className="btn blue accent-3 black-text waves-effect edit-products__btn"
        onClick={showDomainForm}
        disabled={loading}
      >
        Добавить домен
      </button>
      <ModalDeleteProduct
        id={productId}
        fetchProduct={getProducts}
      />
      <ModalEditProduct
        id={domainId}
        fetchProduct={getProducts}
      />
      <ModalEditSite
        id={siteId}
        fetchProduct={getProducts}
      />

    </div>
  )
}
