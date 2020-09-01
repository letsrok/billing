import React, {useState, useEffect, useCallback} from "react";
import {formatDate, getDateEnd, diffDateFormat, diffDate} from "../../helpers/dateFormat";
import {NavLink} from "react-router-dom"

export const ClientView = ({user, index, sendId}) => {

  const [daysToEnd, setDaysToEnd] = useState('')
  const [domains, setDomains] = useState([])
  const [sites, setSites] = useState([])

  const getProducts = useCallback(() => {
    if(user.products.length > 0) {

      let days = getDateEnd(user.products)
      setDaysToEnd(days)

      user.products.forEach((product, index, products) => {

        if(product.type === 'domain') {
          let daysToEnd = diffDateFormat(diffDate(product.dateStart))
          let res = {
            name: product.name,
            days: daysToEnd
          }
          setDomains(domains => [...domains, res])
        }

        else {
          let daysToEnd = `${formatDate(product.dateStart)} - ${formatDate(product.dateEnd)}`
          let res = {
            name: product.name,
            days: daysToEnd
          }
          setSites(sites => [...sites, res])

          if(!products.some((el) => {return el.type === 'domain' && el.name === product.name})) {
            let res = {
              name: product.name,
              days: 'Домен у клиента'
            }
            setDomains(domains => [...domains, res])
          }

        }
      })
    }
  }, [user])

  useEffect(() => {
    getProducts()
  }, [getProducts])

  return (
    <tr>
      <td>
        {index+1}.
        {" "}
        <NavLink to={`/edit/${user._id}`}>
          { user.name}
        </NavLink>
      </td>
      <td>
        {domains &&
          <div>
            {domains.map((item, index) => {
              return (<p key={index}> {item.name} {'('}{item.days}{')'}</p>)
            })}
          </div>
        }
      </td>
      <td>
        {sites &&
        <div>
          {sites.map((item, index) => {
            return (<p key={index}> {item.name} {'('}{item.days}{')'}</p>)
          })}
        </div>
        }
      </td>
      <td>{daysToEnd}</td>
      <td>{formatDate(user.lastVisit)}</td>
      <td>
        <a
          className=" btn waves-effect waves-light red modal-trigger"
          href="#!"
          data-target='delete-client'
          onClick={() => sendId(user._id)}
        >
          <i className="material-icons">delete</i>
        </a>
      </td>
    </tr>
  )
}
