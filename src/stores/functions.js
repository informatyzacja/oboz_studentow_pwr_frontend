import { API_URL, auth } from '../config.js'

export function loadData(item) {
  fetch(API_URL + item.url)
    .then((data) => {
      if (data.ok) {
        return data.json()
      }
      throw new Error('Request failed!')
    })
    .then((data) => {
      item.loading = false
      item.data = data
      item.error = null
    })
    .catch((error) => {
      item.loading = false
      item.error = error
      console.error('There was an error!', error)
    })
    .finally(() => {
      item.loading = false
    })
}

export function ready(item) {
  return !item.loading && item.data
}
