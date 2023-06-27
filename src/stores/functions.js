import { API_URL, AUTH_HEADER } from '../config.js'

export function loadData(item) {
  fetch(API_URL + item.url, { headers: AUTH_HEADER })
    .then((data) => {
      if (data.ok) {
        return data.json()
      }
      throw new Error('Błąd wczytywania')
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

export function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}
