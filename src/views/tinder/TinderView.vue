<script setup>

import { IonPage, IonContent, IonIcon, IonButton, toastController } from '@ionic/vue';
import Tinder from '@/components/vue-tinder/Tinder.vue'
import { apiRequest } from '@/stores/functions'
import CustomTinderCard from './CustomTinderCard.vue'
import TopBar from '@/components/navigation/TopBar.vue'
import { refresh, close, heart, star, help } from 'ionicons/icons'
import OverlayView from '../../components/OverlayView.vue';
import ProfileCircle from '@/components/navigation/ProfileCircle.vue'

import { useApiDataStore } from '@/stores/api.js'
import { mapStores } from 'pinia'
import LoadingIndicator from '../../components/LoadingIndicator.vue';
import ChatCardView from '@/views/ChatCardView.vue'

</script>

<template>
    <ion-page>
        <ion-content :fullscreen="false">
            <main>
                <TopBar title="Tinder" backLink="/home" />
                <ProfileCircle />

                <h2 v-if="noMoreProfiles && !queue.length">Koniec profilów.<br>Sprawdź później, czy dołączył ktoś nowy.
                </h2>

                <h2 v-if="info">{{ info }}</h2>

                <OverlayView ref="helpOverlay">
                    <div class="help-overlay">
                        <div class="help-content">
                            <h4>Jak działa tinder obozowy?</h4>
                            <div class="action-desc">
                                <ion-icon :icon="heart" color="success"></ion-icon>
                                <p><span class="action-desc-title">Like</span> - Przesuń w prawo, aby polubić</p>
                            </div>
                            <div class="action-desc">
                                <ion-icon :icon="close" color="danger"></ion-icon>
                                <p><span class="action-desc-title">Nope</span> - Przesuń w lewo, aby odrzucić</p>
                            </div>
                            <div class="action-desc">
                                <ion-icon :icon="star" color="primary"></ion-icon>
                                <div>
                                    <p><span class="action-desc-title">Super like</span> - przesuń w górę, aby mieć
                                        możliwość
                                        natychmiastowego czatowania nawet
                                        jeżeli nie masz matcha z
                                        drugą osobą.</p>
                                    <p class="subdesctiprion">UWAGA! Super like możesz użyć raz na cały obóz. Use it
                                        wisely.</p>
                                </div>
                            </div>
                        </div>
                        <div class="help-footer">
                            <ion-button @click="$refs.helpOverlay.hide()" shape="round">
                                Zacznij swajpować
                            </ion-button>
                        </div>
                    </div>
                </OverlayView>


                <OverlayView ref="matchOverlay">
                    <div class="help-overlay">
                        <div class="help-content">
                            <h4>Match!</h4>
                            <p>Gratulacje! Masz matcha z tą osobą. Możesz teraz zacząć rozmowę.</p>
                            <ChatCardView :chat="{ avatar: matchData.photo, name: matchData.name, users: [1, 1] }" />
                        </div>
                        <div class="help-footer">
                            <ion-button @click="openChat" shape="round">
                                Rozpocznij rozmowę
                            </ion-button>
                        </div>
                    </div>
                </OverlayView>

                <LoadingIndicator v-if="!queue.length && !noMoreProfiles && !info" />

                <Tinder ref="tinder" key-name="id" :queue="queue" :max="3" :offset-y="10" allow-down @submit="onSubmit">
                    <template v-slot="scope">
                        <CustomTinderCard :item="scope.data" />
                    </template>
                    <!-- 
                        <img class="down-pointer" slot="down" src="~img/down-txt.png" />
                        <img class="rewind-pointer" slot="rewind" src="~img/rewind-txt.png" /> -->
                    <template #rewind>
                        <ion-icon :icon="refresh" color="warning" class="rewind-icon"></ion-icon>
                    </template>

                    <template #like>
                        <ion-icon :icon="heart" color="success" class="like-pointer"></ion-icon>
                    </template>
                    <template #nope>
                        <ion-icon :icon="close" color="danger" class="nope-pointer"></ion-icon>
                    </template>
                    <template #super>
                        <ion-icon :icon="star" color="primary" class="super-pointer"
                            style="font-size: 50px;"></ion-icon>
                    </template>

                </Tinder>
                <div class="btns" v-if="!(noMoreProfiles && !queue.length)">
                    <ion-button @click="decide('rewind')" shape="round">
                        <ion-icon slot="icon-only" :icon="refresh" color="warning" class="rewind-icon"></ion-icon>
                    </ion-button>
                    <ion-button @click="decide('nope')" shape="round">
                        <ion-icon slot="icon-only" :icon="close" color="danger"></ion-icon>
                    </ion-button>
                    <ion-button @click="decide('super')" shape="round">
                        <ion-icon slot="icon-only" :icon="star" color="primary"></ion-icon>
                    </ion-button>
                    <ion-button @click="decide('like')" shape="round">
                        <ion-icon slot="icon-only" :icon="heart" color="success"></ion-icon>
                    </ion-button>
                    <ion-button @click="decide('help')" shape="round">
                        <ion-icon slot="icon-only" :icon="help" class="help-icon"></ion-icon>
                    </ion-button>
                </div>
            </main>
        </ion-content>
    </ion-page>
</template>

<script>
export default {
    data: () => ({
        queue: [],
        history: [],
        noMoreProfiles: false,
        matchData: {},
        info: ''
    }),
    computed: {
        ...mapStores(useApiDataStore),
    },
    async mounted() {
        if (!this.apiDataStore.profile.ready) {
            await this.apiDataStore.profile.fetchData()
        }
        if (!this.apiDataStore.profile.data[0].tinder_profile.user) {
            this.$router.push('/tinder/profil');
            return
        }
        if (this.$router.currentRoute.value.name === 'tinder-help') {
            this.$refs.helpOverlay.show()
        }
        this.mock();
    },
    methods: {
        async mock() {
            const res = await apiRequest('../api2/tinder/load-profiles/?skip_ids=' + this.queue.map(x => x.user).join(','));
            if (res.info) {
                this.info = res.info
                return
            }
            if (res.length === 0) {
                this.noMoreProfiles = true;
                return
            }
            this.queue.push(...res)

        },
        async openChat() {
            this.$refs.matchOverlay.hide()
            await this.apiDataStore.chats.fetchData()
            this.$router.push('/czat/' + this.matchData.chat_id)
        },
        onSubmit({ item, type }) {
            if (!item.user) {
                return
            }

            var apiType = '';
            if (type === 'like') {
                apiType = 'like';
            } else if (type === 'nope') {
                apiType = 'dislike';
            } else if (type === 'super') {
                apiType = 'superlike';
            } else {
                return
            }
            this.history.push(item)
            if (this.history.length > 3) {
                this.history.shift()
            }

            apiRequest('../api2/tinder/action/', 'POST', {
                action: apiType,
                target: item.user
            }).then(res => {
                if (res.success) {
                    if (res.match) {
                        this.matchData = { ...item, chat_id: res.chat_id }
                        this.$refs.matchOverlay.show()
                    }
                }
                if (this.queue.length < 3) {
                    this.mock()
                }
            }).catch(err => {
                this.decide('rewind')
            })

        },
        async decide(choice) {
            if (choice === 'rewind') {
                if (this.history.length) {
                    // Rewind one by one
                    // this.$refs.tinder.rewind([this.history.pop()])
                    // Rewind all at once
                    // this.$refs.tinder.rewind(this.history)
                    // this.history = []
                    // Rewind multiple randomly

                    // rewind 1
                    this.$refs.tinder.rewind(
                        this.history.splice(-1)
                    )

                    // Add without API call
                    // this.queue.unshift(this.history.pop())
                    // this.queue.push(this.history.pop())
                    // Add at non-head position
                    // this.queue.splice(1, 0, this.history.pop())
                    // Rewind multiple at once and include non-head added items
                    // this.queue.unshift(this.history.pop())
                    // this.queue.unshift(...this.history)
                } else {
                    toastController.create({
                        message: 'Nie ma więcej kart do cofnięcia',
                        duration: 2000,
                        color: 'warning',
                        position: 'top'
                    }).then(toast => toast.present())
                }
            } else if (choice === 'help') {
                this.$refs.helpOverlay.show()
            } else {
                this.$refs.tinder.decide(choice)
            }
        }
    }
}
</script>

<style scoped>
.help-overlay {
    background-color: var(--bg);
    border-radius: 10px;
    padding: 20px;
    margin: 0 20px;
    margin-top: 50px;
}

.help-content {
    margin-bottom: 20px;
}

.help-footer {
    display: flex;
    justify-content: center;
}


.action-desc {
    align-items: center;
    margin-bottom: 10px;
    gap: 10px;
    display: grid;
    grid-template-columns: 30px 1fr;
    font-size: .9rem;
}

.action-desc ion-icon {
    font-size: 30px;
}

.action-desc-title {
    font-weight: bold;
}

.subdesctiprion {
    font-size: 12px;
    color: var(--text-gray);
    font-weight: bold;
}

ion-content {
    --overflow: hidden
}

body {
    margin: 0;
    background-color: #20262e;
    overflow: hidden;
}

h2 {
    color: var(--text-gray);
    text-align: center;
    margin: 20px;
    margin-top: 40px;
}

.vue-tinder {
    /* position: absolute; */
    z-index: 1;
    left: 0;
    right: 0;
    top: 23px;
    margin: auto;
    /* width: calc(100% - 20px); */
    margin: 0 20px;
    /* height: calc(100% - 23px - 65px - 47px - 16px); */
    /* height: 500px; */
    /* width: 90%;
    height: 90%; */
}

.nope-pointer,
.like-pointer {
    position: absolute;
    z-index: 1;
    top: 20px;
    width: 64px;
    height: 64px;
}

.nope-pointer {
    right: 10px;
}

.like-pointer {
    left: 10px;
}

.super-pointer,
.down-pointer {
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    margin: auto;
    /* width: 112px; */
    height: 78px;
}

.super-pointer {
    bottom: 40px;
}

.down-pointer {
    top: 40px;
}

.rewind-pointer {
    position: absolute;
    z-index: 1;
    top: 20px;
    right: 10px;
    /* width: 112px; */
    height: 78px;
}

.pic {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
}

.btns {
    /* position: absolute; */
    /* left: 0;
    right: 0;
    bottom: 30px; */
    margin: auto;
    margin-top: 50px;
    height: 65px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 300px;
    max-width: 355px;
}

.btns ion-button {
    margin-right: 12px;
    box-shadow: 0 4px 9px rgba(0, 0, 0, 0.15);
    border-radius: 50%;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    --padding-start: 0;
    --padding-end: 0;
    aspect-ratio: 1;

    --background: rgba(0, 0, 0, 0.439);
    --background-activated: var(--bg-lighter)
}

.btns ion-button:nth-child(2n + 1) {
    width: 53px;
}

.btns ion-button:nth-child(2n) {
    width: 65px;
}

.btns ion-button:nth-child(2n) ion-icon {
    font-size: 35px;
}

.btns ion-button:nth-last-child(1) {
    margin-right: 0;
}

.help-icon {
    color: rgb(172, 63, 216)
}

.rewind-icon {
    -webkit-transform: scaleX(-1);
    transform: scaleX(-1);
}


/* .vue-tinder.right-end,
.vue-tinder.left-end {
  transform: translateZ(20px);
}
.vue-tinder.right-end .tinder-card:nth-child(1) {
  animation: rightEnd 0.2s ease-in-out;
}
.vue-tinder.left-end .tinder-card:nth-child(1) {
  animation: leftEnd 0.2s ease-in-out;
}
@keyframes leftEnd {
  50% {
    transform: rotateY(8deg);
  }
}
@keyframes rightEnd {
  50% {
    transform: rotateY(-8deg);
  }
} */
</style>