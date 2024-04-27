
import { Preferences } from '@capacitor/preferences';
import router from '@/router/index.js';

const VITE_API_URL = import.meta.env.VITE_API_URL

export async function loginGetToken(email, password) {
    const response = await fetch(`${VITE_API_URL}token/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    const data = await response.json()
    if (data.access && data.refresh) {
        await Preferences.set({ key: 'access_token', value: data.access })
        await Preferences.set({ key: 'refresh_token', value: data.refresh })
        return true
    }
    return false
}

let refreshPromise = null;

async function refreshTokenRequest() {
    console.log('refreshing token')
    const refresh_token = await Preferences.get({ key: 'refresh_token' })
    if (!refresh_token.value) return false
    const response = await fetch(`${VITE_API_URL}token/refresh/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh: refresh_token.value })
    })
    const data = await response.json()
    if (data.access) {
        await Preferences.set({ key: 'access_token', value: data.access })
        return true
    }
    return false
}

export async function refreshToken() {
    if (refreshPromise) return refreshPromise
    refreshPromise = refreshTokenRequest()
    refreshPromise.then(() => {
        refreshPromise = null
    }).catch(() => {
        refreshPromise = null
    })
    return refreshPromise
}

export async function getAccessToken() {
    const access_token = await Preferences.get({ key: 'access_token' })
    if (access_token.value) return access_token.value
    return false;
}

export async function getAuthorizationHeader() {
    const access_token = await getAccessToken()
    if (access_token) return { 'Authorization': `Bearer ${access_token}` }
    router.replace({ name: 'register' })
    return false
}

export async function veryifyToken() {
    const access_token = await getAccessToken()
    if (!access_token) return false
    const response = await fetch(`${VITE_API_URL}token/verify/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: access_token })
    })
    if (response.ok) return true
    return refreshToken()
}


export async function logout() {
    await Preferences.remove({ key: 'access_token' })
    await Preferences.remove({ key: 'refresh_token' })
}