<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import moment from 'moment'

import { apiSocket } from '@/stores/functions.js'

import sendIcon from '../assets/icons8-paper_plane.png'

import { IonPage, IonContent } from '@ionic/vue';
</script>


<template>


    <ion-page>
        <ion-content :fullscreen="false" ref="content">
            <div>
                <TopBar :title="apiDataStore.chats.ready && chat.name || 'Czat ?'" autoBackLink class="top-bar"
                    :image="apiDataStore.chats.ready && chat.avatar" />
                <main class="padding-main">
                    <div v-if="apiDataStore.profile.ready && apiDataStore.chat.ready && !loading">
                        <div class="chat">
                            <div v-for="(message, index) in apiDataStore.chat.messagesForChatWithId(chat_id)"
                                class="messageRow" :key="index" :class="{ messageFromMe: message.fromMe }">
                                <div style="width: 100%">

                                    <p class="datetime"
                                        v-if="index == 0 || Date.parse(message.date) - Date.parse(apiDataStore.chat.data[index - 1].date) > 8 * 60 * 1000 || !moment(message.date).isSame(moment(apiDataStore.chat.data[index - 1].date), 'day')">
                                        {{ moment(message.date).isSame(moment(), 'day') ?
                                            moment(message.date).format('HH:mm') :
                                            moment(message.date).format('DD.MM.YYYY HH:mm') }}
                                    </p>

                                    <p class="messageUser"
                                        v-if="index == 0 || apiDataStore.chat.data[index - 1].user_id != message.user_id">
                                        {{
                                            !message.fromMe ? message.username : '' }}</p>

                                    <div class="message"
                                        :class="{ messageEmoji: message.message.length === 2 && /\p{Extended_Pictographic}/u.test(message.message) }">
                                        {{ message.message }}
                                    </div>

                                </div>
                            </div>
                            <div v-if="apiDataStore.chat.messagesForChatWithId(chat_id).length === 0"
                                style="text-align: center; color: rgba(255, 255, 255, 0.546); margin-top: 20px;">
                                Witaj w czacie!<br>Bądź
                                pierwszy/a i
                                napisz coś!
                            </div>
                        </div>

                        <div class="textBox">
                            <input type="text" v-on:keyup.enter="sendMessage" v-model="currentMessage" placeholder="Aa"
                                maxlength="500" />

                            <button class="textBoxButton" v-if="currentMessage.trim() === ''"
                                @click="currentMessage = '👍'; sendMessage()">👍</button>

                            <button class="textBoxButton sendIcon" v-else @click="sendMessage"><img
                                    :src="sendIcon" /></button>

                        </div>
                    </div>
                    <LoadingIndicator v-else />
                </main>
            </div>
        </ion-content>
    </ion-page>
</template>



<script>
export default {
    data() {
        return {
            currentMessage: '',
            chatSocket: null,
            loading: true,
            reconnect: true,
            timer: null,
            scrollToEnd: true,
            chat_id: parseInt(this.$route.params.id)
        }
    },
    computed: {
        ...mapStores(useApiDataStore),
        chat() {
            return this.apiDataStore.chats.withId(this.chat_id)
        }
    },
    watch: {
        currentMessage() {
            this.$refs.content.$el.scrollToBottom(500);
        }
    },
    mounted() {

        this.apiDataStore.chat.fetchData()
        this.apiDataStore.chats.fetchData()
        this.timer = setInterval(() => {
            this.apiDataStore.chat.fetchData()
        }, 1000 * 60 * 5) // fetch data every 5 minutes
        if (!this.apiDataStore.profile.data) {
            this.apiDataStore.profile.fetchData()
        }


        this.reconnect = true
        this.connect()


        // debug
        // this.loading = false

    },
    ionViewWillEnter() {
        this.scrollToEnd = true
        this.$refs.content.$el.scrollToBottom(0);
    },
    unmounted() {
        clearInterval(this.timer)
        this.reconnect = false
        this.chatSocket.onclose = function () { }; // disable onclose handler first
        this.chatSocket.onerror = function () { }; // disable onerror handler first
        this.chatSocket.close()
    },
    updated() {
        if (this.scrollToEnd) {
            this.scrollToEnd = false
            setTimeout(() => {
                this.$refs.content.$el.scrollToBottom(0);
            }, 10)
        }
    },
    methods: {
        async connect() {
            this.chatSocket = await apiSocket('chat/');

            this.chatSocket.onopen = function () {
                this.loading = false
                console.log("The connection was setup successfully !");
            }.bind(this);

            this.chatSocket.onclose = function () {
                this.loading = true;
                setTimeout(() => {
                    if (this.reconnect) {
                        this.connect()
                    }
                }, 1000) // retry connection after 1 second
                console.log("Connecion closed");
            }.bind(this);

            this.chatSocket.onerror = function (err) {
                console.error('Socket encountered error: ', err.message, 'Closing socket');
                this.close();
            };

            this.chatSocket.onmessage = function (e) {
                const data = JSON.parse(e.data);
                this.receiveMessage(data)
            }.bind(this);
        },

        receiveMessage(data) {
            const scrollToEnd = Math.abs(window.scrollY + window.innerHeight - document.body.scrollHeight) <= 10

            if (data.user_id === this.apiDataStore.profile.data[0].id) return // don't show own messages

            this.apiDataStore.chat.data.push({
                message: data.message,
                username: data.username,
                user_id: data.user_id,
                date: data.date,
                fromMe: false,
                chat: data.chat
            })
            this.apiDataStore.chats.data.find(chat => chat.id === data.chat).last_message = {
                message: data.message,
                username: data.username,
                user_id: data.user_id,
                date: data.date,
                fromMe: false,
                chat: data.chat
            }
            if (scrollToEnd) {
                setTimeout(() => {
                    this.$refs.content.$el.scrollToBottom(100);
                }, 1)
            }
        },

        sendMessage() {
            if (this.currentMessage.trim() === '') return
            const message = this.currentMessage.trim()
            this.currentMessage = ''

            this.apiDataStore.chat.data.push({
                message: message,
                user_id: this.apiDataStore.profile.data[0].id,
                date: moment().format('YYYY-MM-DDTHH:mm:ss'),
                fromMe: true,
                chat: this.chat_id
            })
            this.apiDataStore.chats.data.find(chat => chat.id === this.chat_id).last_message = {
                message: message,
                user_id: this.apiDataStore.profile.data[0].id,
                date: moment().format('YYYY-MM-DDTHH:mm:ss'),
                fromMe: true,
                chat: this.chat_id
            }

            this.$refs.content.$el.scrollToBottom(50);

            this.chatSocket.send(JSON.stringify({ message: message, 'chat': this.chat_id }));
        }

    }
}
</script>


<style scoped>
.top-bar {
    position: fixed;
    width: 100%;
    left: 0;
    top: calc(5px + var(--ion-safe-area-top));
}


.chat {
    display: flex;
    flex-direction: column;
    margin: 35px 0;
    margin-bottom: 40px;
}

.message {
    padding: 10px 20px;
    margin: 2px;
    margin-right: 35px;
    background-color: rgba(61, 86, 142, 0.379);
    border-radius: 20px 20px 20px 5px;
    width: auto;
    display: inline-block;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}

.messageFromMe .message {
    background-color: var(--theme-dark);
    border-radius: 20px 20px 5px 20px;
    margin: 2px;
    margin-left: 35px;
    float: right;
}

.message.messageEmoji {
    background-color: transparent;
    font-size: 35px;
    padding: 2px;
}

.messageRow {
    display: flex;
}

/* .messageRow.messageFromMe {
    flex-direction: row-reverse;
} */

.messageUser {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.546);
    padding-left: 15px;
    margin-top: 20px;
}

.datetime~.messageUser {
    margin-top: 0;
}


.textBox {
    width: 100%;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(61, 87, 142, 0.149);
}

.textBox input {
    width: calc(100% - 50px - 10px - 10px);
    margin: 5px;
    margin-bottom: 5px;
    margin-left: 8px;
    min-height: 30px;

    padding: 10px 15px 10px 15px;
    border-radius: 20px;
    border: 1px solid var(--text-gray);
    font-size: 15px;

    border: none;
    outline: none;
    color: white;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    caret-color: white;

    background-color: var(--bg-light);

}

.textBox input::placeholder {
    color: rgba(255, 255, 255, 0.546);
}

.textBoxButton {
    /* border-radius: 20px; */
    border: none;
    color: white;
    /* padding: 20px 35px; */
    padding: 0;

    font-size: 23px;
    line-height: 23px;
    cursor: pointer;

    width: 50px;
    height: 30px;
    margin: 10px;
    margin-left: 0;

    display: inline-block;

    background-color: transparent;

}

.sendIcon {
    /* width: 100%; */
    /* height: 100%; */
    object-fit: contain;
    overflow: hidden;
}

.sendIcon img {
    height: 100%;
    filter: drop-shadow(0px 100px 0 var(--theme-dark));
    transform: translateY(-100px);
}



.datetime {
    text-align: center;
    color: rgba(255, 255, 255, 0.546);
    margin-top: 5px;
}
</style>