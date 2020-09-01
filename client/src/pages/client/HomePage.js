import React, {useState, useCallback, useEffect, useContext} from 'react'
import {useMessage} from "../../hooks/message.hook";
import {Loader} from '../../components/Loader'
import {useHttp} from '../../hooks/http.hook'
import {AuthContext} from '../../context/AuthContext'
import {HeaderInfo} from "../../components/client/HeaderInfo";
import {ProductCard} from "../../components/client/ProductCard";
import {ModalRefuse} from "../../components/client/ModalRefuse";

export const HomePage = () => {
  const {token} = useContext(AuthContext)
  const {loading, request, error, clearError} = useHttp()
  const message = useMessage()

  const [user, setUser] = useState({})
  const [products, setProducts] = useState([])
  const[productToDelete, setProductToDelete] = useState('')

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  const fetchUser = useCallback(async () => {
    try{
      const data = await request('/api/clients/info', 'GET', null, {
        Authorization: `Bearer ${token}`
      })

      if(data) {
        setUser(data)
        if(data.products) {
          setProducts(data.products)
        }
      }
    }
    catch{}
  }, [request, token])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const getProductToDelete = useCallback((product) => {
    setProductToDelete(product)
  }, [])

  if(loading) {
    return <Loader/>
  }

  return (
    <div className='row'>
      <HeaderInfo email={user.email}></HeaderInfo>
      <div className="client-products">

      {
        products.map((item, index) => {
          return <ProductCard
            product={item}
            key={index}
            sendProduct={getProductToDelete}
          >

          </ProductCard>
        })
      }

      </div>
      <ModalRefuse
        name={user.email}
        product={productToDelete}
      >
      </ModalRefuse>
    </div>
  )
}
