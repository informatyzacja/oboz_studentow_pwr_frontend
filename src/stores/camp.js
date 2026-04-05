import { defineStore } from 'pinia'
import { getActiveCampId, setActiveCampId } from '@/functions/login.js'
import { apiRequest } from '@/stores/functions.js'
import router from '@/router/index.js'

const DEFAULT_THEME = {
    themeLight: '#58A8FF',
    themeDark: '#123B69',
    themeText: '#8DBFEA',
    loginButtonColor: '#D7ECFF',
    loginButtonBg: '#2A5D9C33',
}

function setCssVar(name, value) {
    document.documentElement.style.setProperty(name, value)
}

function normalizeCampLogoUrl(logoPath) {
    if (!logoPath || typeof logoPath !== 'string') {
        return null
    }
    if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
        return logoPath
    }
    const base = import.meta.env.VITE_API_URL || window.location.origin
    try {
        if (logoPath.startsWith('/')) {
            return new URL(logoPath, base).toString()
        }
        if (logoPath.startsWith('media/')) {
            return new URL(`/${logoPath}`, base).toString()
        }
        return new URL(logoPath, base).toString()
    } catch (e) {
        return logoPath
    }
}

function getFeatureFlags(settings) {
    if (!settings) {
        return {}
    }
    return {
        workshops: settings.feature_workshops !== false,
        schedule: settings.feature_schedule !== false,
        tinder: settings.feature_tinder !== false,
        bereal: settings.feature_bereal !== false,
        bingo: settings.feature_bingo !== false,
        points: settings.feature_points !== false,
    }
}

export const useCampStore = defineStore('camp', {
    state: () => ({
        activeCampId: null,
        camps: [],
        campSettings: null,
        campLogoUrl: null,
        featureFlags: {},
        loading: false,
        error: null,
    }),
    getters: {
        isSettingsReady: (state) => !!state.campSettings,
    },
    actions: {
        resetLoginTheme() {
            setCssVar('--theme-light', DEFAULT_THEME.themeLight)
            setCssVar('--theme-text', DEFAULT_THEME.themeText)
            setCssVar('--login-button-color', DEFAULT_THEME.loginButtonColor)
            setCssVar('--login-button-bg', DEFAULT_THEME.loginButtonBg)
        },
        resetAppThemeToDefaults() {
            setCssVar('--theme-light', DEFAULT_THEME.themeLight)
            setCssVar('--theme-dark', DEFAULT_THEME.themeDark)
            setCssVar('--theme-text', DEFAULT_THEME.themeText)
        },
        applyCampTheme(settings) {
            if (!settings) {
                this.resetAppThemeToDefaults()
                return
            }
            setCssVar('--theme-light', settings.primary_color || DEFAULT_THEME.themeLight)
            setCssVar('--theme-dark', settings.secondary_color || DEFAULT_THEME.themeDark)
        },
        updateCampSettingsState(settings) {
            this.campSettings = settings
            this.campLogoUrl = normalizeCampLogoUrl(settings?.logo)
            this.featureFlags = getFeatureFlags(settings)
            this.applyCampTheme(settings)
        },
        isFeatureEnabled(featureName) {
            if (!featureName) {
                return true
            }
            if (!(featureName in this.featureFlags)) {
                return true
            }
            return this.featureFlags[featureName]
        },
        async fetchCampSettings(campId) {
            if (!campId) {
                this.campSettings = null
                this.campLogoUrl = null
                this.featureFlags = {}
                this.resetAppThemeToDefaults()
                return null
            }
            const settings = await apiRequest(`../api2/camps/${campId}/settings/`)
            this.updateCampSettingsState(settings)
            return settings
        },
        async ensureActiveCampSettings() {
            if (!this.activeCampId) {
                return
            }
            if (!this.campSettings) {
                await this.fetchCampSettings(this.activeCampId)
            }
        },
        async loadPersistedCampId() {
            const campId = await getActiveCampId()
            if (campId) {
                this.activeCampId = String(campId)
            }
        },
        async fetchAndSetCamp() {
            this.loading = true
            this.error = null
            try {
                const persistedCampId = this.activeCampId || await getActiveCampId()
                if (persistedCampId) {
                    this.activeCampId = String(persistedCampId)
                }
                const data = await apiRequest('../api2/camps/my/')
                if (!data || !Array.isArray(data) || data.length === 0) {
                    this.camps = []
                    this.activeCampId = null
                    this.campSettings = null
                    this.campLogoUrl = null
                    this.featureFlags = {}
                    await setActiveCampId(null)
                    this.resetAppThemeToDefaults()
                    return
                }
                this.camps = data
                const active = data.find((c) => String(c.id) === String(persistedCampId)) || data.find((c) => c.is_active) || data[data.length - 1]
                this.activeCampId = String(active.id)
                await setActiveCampId(active.id)
                if (active.settings) {
                    this.updateCampSettingsState(active.settings)
                }
                await this.fetchCampSettings(active.id)
            } catch (e) {
                this.error = e
            } finally {
                this.loading = false
            }
        },
        async switchCamp(campId) {
            this.activeCampId = String(campId)
            await setActiveCampId(campId)
            try {
                const active = this.camps.find((camp) => String(camp.id) === String(campId))
                if (active?.settings) {
                    this.updateCampSettingsState(active.settings)
                }
                await this.fetchCampSettings(campId)
            } catch (e) {
                this.error = e
            }
            router.replace('/')
        },
    },
})
