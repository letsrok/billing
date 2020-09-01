export function diffDate (date, type = 'domain')  {

  let endDate = new Date(date.replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3"))

  if(type === 'domain') {
    endDate.setMonth(endDate.getMonth() + 12)
  }

  let currentDate = new Date()

  return Math.ceil(endDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24);

}

export function formatDomainDate(date) {
  let endDate = new Date(date.replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3"))
  endDate.setMonth(endDate.getMonth() + 12)
  return formatDate(endDate)
}

export function diffDateFormat(date) {

  if(date <= 0) return 'Срок истек'

  let currentDate = new Date()
  let res = currentDate.setDate(currentDate.getDate() + date)
  res = new Date(res).toLocaleDateString()

  return res
}

export function formatDate (value){
  if(value) {
    let date = new Date(value).toLocaleDateString();
    return date
  }
  return ''
}

export function getDateEnd (products) {
  let data = []
  if(products.length) {
    data = products.map(item => {
      if(item.type === 'domain') {
        return diffDate(item.dateStart)
      }
      else {
        return diffDate(item.dateEnd, 'site')
      }
    })
  }
  data = Math.min.apply(null, data)

  data = data < 0 ? 0 : data.toFixed(0)
  data = data === Infinity? '' : data
  return data
}
