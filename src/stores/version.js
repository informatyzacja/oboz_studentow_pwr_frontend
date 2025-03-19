import { defineStore } from 'pinia'
import { App } from '@capacitor/app';
import * as LiveUpdates from '@capacitor/live-updates';

export const useVersionStore = defineStore('version', {
    state: () => ({ version: '', isNewest: null, liveUpdateVersion: '' }),
    getters: {
        fullVersion() {
            if (!this.version && !this.liveUpdateVersion) return
            return 'v' + this.version + ' ' + (
                (this.isNewest === null || !this.liveUpdateVersion) ? '' :
                    (this.isNewest ? this.liveUpdateVersion : 'Nowa wersja dostępna! 🔄')
            )
        }
    },
    actions: {
        async refresh() {
            await App.getInfo()
                .then((appinfo) => {
                    this.version = appinfo.version + ' (' + appinfo.build + ')'
                })

            // await LiveUpdates.sync()
            //     .then((result) => {
            //         if (!result.snapshot) return
            //         this.liveUpdateVersion = result.snapshot.buildId
            //         this.isNewest = !result.activeApplicationPathChanged
            //     })
        },
    }
})
