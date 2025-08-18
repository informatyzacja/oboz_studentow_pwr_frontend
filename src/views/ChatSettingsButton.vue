<script setup>
import OverlayView from '@/components/OverlayView.vue';
import { IonToggle, IonActionSheet, IonButton, toastController, IonNavLink } from '@ionic/vue';
import { apiRequest } from '@/stores/functions.js'
import BeerRealLogo from '@/assets/bEERreal1.png'

import { useApiDataStore } from '@/stores/api.js'
import { mapStores } from 'pinia'
</script>

<template>
    <div>
        <p class="infoButton" @click="showChatSettings">Opcje</p>

        <OverlayView ref="chatSettingsOverlay">
            <div class="padding" v-if="chat">
                <h2>Czat</h2>

                <div v-if="chat.users.length == 2 && chatingUserId">
                    <h3>Linki</h3>
                    <IonNavLink :router-link="`/bereal/profil/${chatingUserId}`" class="infoButton">
                        <img :src="BeerRealLogo" alt="BeerReal Logo" class="app-icon-logo" />
                    </IonNavLink>
                </div>

                <h3>Opcje</h3>
                <ion-toggle v-model="chat.notifications_blocked" @ionChange="notificationsToggled($event)"
                    :disabled="chat.house_chat" color="success">Wycisz
                    powiadomienia</ion-toggle>

                <ion-button id="open-action-sheet" :disabled="chat.house_chat" color="danger">Zablokuj</ion-button>
                <ion-action-sheet trigger="open-action-sheet" class="my-custom-class"
                    header="Czy jesteś pewien/pewna, że chcesz zablokwować ten czat?"
                    sub-header="Czat zniknie z historii. Tej operacji nie da się cofnąć." :buttons="actionSheetButtons"
                    @didDismiss="didDismiss"></ion-action-sheet>


                <ion-button @click="$refs.chatSettingsOverlay.hide()" :disabled="chat.house_chat">Gotowe</ion-button>

            </div>
        </OverlayView>
    </div>
</template>

<script>
export default {
    props: {
        chat: Object
    },
    computed: {
        ...mapStores(useApiDataStore),
        chatingUserId() {
            if (!this.apiDataStore.profile.data[0]?.id) return
            return this.chat.users.find(user_id => user_id !== this.apiDataStore.profile.data[0]?.id) || null;
        }
    },
    data() {
        return {
            actionSheetButtons: [
                {
                    text: 'Zablokuj',
                    role: 'destructive',
                    data: {
                        action: 'block',
                    },
                },
                {
                    text: 'Anuluj',
                    role: 'cancel',
                    data: {
                        action: 'cancel',
                    },
                },
            ],
        }
    },
    methods: {
        showChatSettings() {
            this.$refs.chatSettingsOverlay.show();
        },
        didDismiss(event) {
            if (event.detail.data.action === 'block') {
                this.blockChat();
            }
        },
        async blockChat() {
            try {

                const body = { enabled: false }
                const data = await apiRequest('../api2/block_chat/' + this.chat.id + '/',
                    'PUT',
                    body
                )
                if (data.status === 'success') {
                    toastController.create({
                        message: 'Czat zablokowany',
                        duration: 1500,
                        position: 'top',
                        color: 'success'
                    }).then(toast =>
                        toast.present()
                    );
                    this.apiDataStore.chats.fetchData()
                    this.$router.push('/czaty')
                    return data
                }
                throw new Error('Failed to block chat')

            } catch (error) {
                console.error('Error while blocking chat:', error);

                toastController.create({
                    message: 'Nie udało się zablokować czatu',
                    duration: 1500,
                    position: 'top',
                    color: 'danger'
                }).then(toast =>
                    toast.present()
                );
            }
        },
        notificationsToggled(event) {
            apiRequest('../api2/block_chat_notifications/' + this.chat.id + '/',
                'PUT',
                { block: event.detail.checked }
            ).then(data => {
                if (data.status === 'success') {
                    toastController.create({
                        message: 'Powiadomienia ' + (event.detail.checked ? 'wyciszone' : 'włączone'),
                        duration: 1500,
                        position: 'top',
                        color: 'success'
                    }).then(toast =>
                        toast.present()
                    );
                    this.apiDataStore.chats.fetchData()
                    return data
                }
                throw new Error('Failed to block chat notifications')
            }).catch(error => {
                console.error('Error while blocking chat notifications:', error);

                toastController.create({
                    message: 'Nie udało się zmienić ustawienia wyciszeń powiadomień',
                    duration: 1500,
                    position: 'top',
                    color: 'danger'
                }).then(toast =>
                    toast.present()
                );
            })
        }
    }
}
</script>

<style scoped>
.infoButton {
    color: var(--text-dark);
}

.padding {
    padding: 1.5rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: center;
}

.description {
    font-size: 0.8rem;
    color: var(--text-light);
}

ion-button {
    color: white;
}
ion-toggle {
    --track-background: #ddd;
}
.app-icon-logo {
    --size: 60px;
    width: var(--size);
    height: var(--size);
    object-fit: contain;
    background-color: white;
    border-radius: 50%;
}
</style>