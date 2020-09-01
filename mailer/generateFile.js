const sumLetters = require('../helpers/numbersToWords')
const convertDate = require('../helpers/datesFormat')

function editTemplate (html, data) {

  let order = data.serial
  let date = convertDate(new Date().toLocaleDateString())
  order = order > 999 ? order : '0'+order
  order = `Счет № S-${order} от ${date}`
  html = html.replace(/__order__/g, `${order}`)

  html = html.replace(/__name__/g, `${data.name}`)

  let productsTable = data.products

  productsTable = productsTable.map((product, index) => {
    let nm = index + 1
    let price = product.price.toFixed(2)
    let dateStart = convertDate(new Date(product.dateStart).toLocaleDateString())


    if(product.type == 'site') {
      let dateEnd = convertDate(new Date(product.dateEnd).toLocaleDateString())

      return `
        <tr>
          <td>${nm}</td>
          <td>Размещение сайта ${product.name} согласно договору ${data.order}. Период с ${dateStart} по ${dateEnd}.</td>
          <td>шт.</td>
          <td>1.00</td>
          <td>${price}</td>
          <td>${price}</td>
        </tr>
      `
    }

    else {
      return `
        <tr>
          <td>${nm}</td>
          <td>Продление доменного имени ${product.name} сроком на Один год согласно договору ${data.order}.</td>
          <td>шт.</td>
          <td>1.00</td>
          <td>${price}</td>
          <td>${price}</td>
        </tr>
      `
    }
  })
  productsTable = productsTable.join('')

  html = html.replace(/__productsTable__/g, `${productsTable}`)

  let totalSumm =  data.products.reduce((total, item) => {
    return total + item.price
  }, 0)
  let totalSummFormat = totalSumm.toFixed(2)
  html = html.replace(/__totalSummFormat__/g, `${totalSummFormat}`)
  html = html.replace(/__totalSumm__/g, `${totalSumm}`)
  html = html.replace(/__productsLength__/g, `${data.products.length}`)

  let totalSummLetter = sumLetters(totalSumm)
  html = html.replace(/__totalSummLetter__/g, `${totalSummLetter}`)

  return html
}




module.exports = editTemplate
