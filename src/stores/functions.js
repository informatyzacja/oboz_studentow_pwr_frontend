const VITE_API_URL = import.meta.env.VITE_API_URL
import { getAuthorizationHeader, refreshToken } from '@/functions/login.js'
import { toastController } from '@ionic/vue';

import { logout } from '@/functions/login.js';

import router from '@/router/index.js';

export async function apiRequest(url, method = 'GET', data = null, retry = false) {
  const headers = await getAuthorizationHeader()
  const options = {
    method: method,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    }
  }
  if (data && method !== 'GET' && method !== 'HEAD') {
    options.body = JSON.stringify(data)
  }
  return fetch(VITE_API_URL + url, options)

    .catch((error) => {
      toastController.create({
        message: 'Błąd połączenia z serwerem. Sprawdź połaczenie z internetem.',
        duration: 1500,
        position: 'top',
        color: 'danger'
      })
        .then(toast =>
          toast.present()
        );
      throw error
    })

    .then((responseData) => {

      if (responseData.status === 401) {
        if (!retry) {
          return responseData.json()
            .then((responseJson) => {
              if (responseJson.code === 'token_not_valid') {
                // console.log('Token not valid')
                return refreshToken()
                  .then(() => {
                    // console.log('Token refreshed')
                    return apiRequest(url, method, data, retry = true);
                  })
                  .catch((response2) => {
                    console.log('Token refresh failed', response2)
                    console.log(response2.status)
                    console.error('Logging out')
                    router.replace({ name: 'login' })
                    throw new Error('Token refresh failed')
                  })
              } else {
                console.error('Logging out')
                logout();
                router.replace({ name: 'login' })
                return
              }
            })
        } else {
          logout();
        }
      }

      if (responseData.ok) {
        if (responseData.status === 204) {
          return
        }
        return responseData.json()
      }

      responseData.json()
        .then((data) => {
          toastController.create({
            message: 'Błąd: ' + data.error,
            duration: 1500,
            position: 'top',
            color: 'danger'
          })
            .then(toast =>
              toast.present()
            );
        })
        .catch(() => {
          toastController.create({
            message: 'Błąd serwera: ' + responseData.status + '. Spróbuj ponownie później.',
            duration: 1500,
            position: 'top',
            color: 'danger'
          })
            .then(toast =>
              toast.present()
            );
        })

      throw responseData

    })
}

export async function loadData(item) {
  return apiRequest(item.url)
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
  return item.data
}

export function getCookie(name) {
  let cookieValue = null
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}
