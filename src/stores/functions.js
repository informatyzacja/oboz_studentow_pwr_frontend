const VITE_API_URL = import.meta.env.VITE_API_URL
import { getAuthorizationHeader, refreshToken, getAccessToken } from '@/functions/login.js'
import { toastController } from '@ionic/vue';
import { WS_API_URL } from '@/config'

import { logout } from '@/functions/login.js';

import router from '@/router/index.js';

export async function apiSocket(url) {
  const access_token = await getAccessToken()
  return new WebSocket(WS_API_URL + url + '?token=' + access_token)
}

export async function request(url, options) {
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

}

export async function apiRequest(url, method = 'GET', body = null, retry = false, data = null) {
  const headers = await getAuthorizationHeader()
  if (!headers) return
  const options = {
    method: method,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    }
  }
  if (body && method !== 'GET' && method !== 'HEAD') {
    options.body = JSON.stringify(body)
  }
  options.data = data;
  return request(url, options)
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
                    if (response2.status === 401) {
                      console.log('Token refresh failed', response2)
                      console.log(response2.status)
                      console.error('Logging out')
                      router.replace({ name: 'register' })
                      throw new Error('Token refresh failed')
                    }
                  })
              } else {
                console.error('Logging out')
                logout();
                router.replace({ name: 'register' })
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
      if (data.error) {
        item.error = data.error
      } else {
        item.data = data
        item.error = null
      }
    })
    .catch((error) => {
      item.error = "Bład połączenia z serwerem"
      console.error('There was an error!', error)
    })
    .finally(() => {
      item.loading = false
    })
}

export function ready(item) {
  return Boolean(item.data)
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
