<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import moment from 'moment'
import { WS_API_URL } from '../config'

import sendIcon from '../assets/icons8-paper_plane.png'

import groupIcon from '../assets/grupa.svg'
</script>


<template>
<div>
    <div class="statusBar"></div>
    <TopBar :title="apiDataStore.profile.ready ? ('Czat domku nr ' + apiDataStore.profile.data[0].house.name + ' (beta)') : 'Czat domku (beta)'" back-link="/profil" class="top-bar">
        <RouterLink v-if="apiDataStore.myHouseMembers.data" to="/moj-domek/info">
            <img class="topRightButton" :src="groupIcon"/>
        </RouterLink>
    </TopBar>
    <main class="padding-main">
        <div v-if="apiDataStore.profile.ready && apiDataStore.chat.ready && !loading" >
            <div class="chat">
                <div v-for="(message, index) in apiDataStore.chat.data" class="messageRow" :key="index"  :class="{messageFromMe: message.fromMe}">
                    <div style="width: 100%">

                        <p class="datetime" v-if="index==0 || Date.parse(message.date) - Date.parse(apiDataStore.chat.data[index-1].date) > 8 * 60 * 1000 || !moment(message.date).isSame(moment(apiDataStore.chat.data[index-1].date), 'day')">
                            {{ moment(message.date).isSame(moment(), 'day') ? moment(message.date).format('HH:mm') : moment(message.date).format('DD.MM.YYYY  HH:mm') }}
                        </p>

                        <p class="messageUser" v-if="index==0 || apiDataStore.chat.data[index-1].user_id != message.user_id">{{ !message.fromMe ? message.username : '' }}</p>

                        <div class="message" :class="{messageEmoji: message.message.length===2 && /\p{Extended_Pictographic}/u.test(message.message)}">
                            {{ message.message }}
                        </div>

                    </div>
                </div>
                <div v-if="apiDataStore.chat.data.length === 0" style="text-align: center; color: rgba(255, 255, 255, 0.546); margin-top: 20px;">
                    Witaj w czacie domku nr {{ apiDataStore.profile.data[0].house.name }}! 🏠<br>Bądź pierwszy/a i napisz coś! 🏹
                </div>
            </div>

            <div class="textBox">
                <input type="text" v-on:keyup.enter="sendMessage"  v-model="currentMessage" placeholder="Aa"/>

                <button class="textBoxButton" v-if="currentMessage.trim()===''" @click="currentMessage='🏹'; sendMessage()">🏹</button>

                <button class="textBoxButton" v-else @click="sendMessage"><img :src="sendIcon" class="sendIcon"/></button>
            </div>
        </div>
        <LoadingIndicator v-else /> 
    </main>
</div>
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
        scrollToEnd: true
    }
  },
  computed: {
    ...mapStores(useApiDataStore)
  },
  watch: {
    currentMessage() {
        window.scrollTo(0,document.body.scrollHeight);
    }
  },
  mounted() {
    this.scrollToEnd = true

    this.apiDataStore.chat.fetchData()
    this.timer = setInterval(() => {
        this.apiDataStore.chat.fetchData()
    }, 1000 * 60) // fetch data every minute
    if (!this.apiDataStore.profile.data) {
        this.apiDataStore.profile.fetchData()
    }
    

    this.reconnect = true
    this.connect()

    this.apiDataStore.myHouseMembers.fetchData()


    // debug
    // this.loading = false
    

  },
  unmounted() {
    this.scrollToEnd = true
    clearInterval(this.timer)
    this.reconnect = false
    this.chatSocket.onclose = function () {}; // disable onclose handler first
    this.chatSocket.onerror = function () {}; // disable onerror handler first
    this.chatSocket.close()
  },
  updated() {
    if (this.scrollToEnd) {
        this.scrollToEnd = false
        console.log('scroll')
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
        }, 10)
    }
  },
  methods: {

    connect() {
        this.chatSocket = new WebSocket(WS_API_URL + 'chat/');

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

        this.chatSocket.onerror = function(err) {
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
        this.apiDataStore.chat.data.push({
            message: data.message,
            username: data.username,
            user_id: data.user_id,
            date: data.date,
            fromMe: data.user_id === this.apiDataStore.profile.data[0].id
        })
        if (scrollToEnd) {
            setTimeout(() => {
                window.scrollTo(0,document.body.scrollHeight);
            }, 100)
        }
    },

    sendMessage() {
        if (this.currentMessage.trim() === '') return
        const message = this.currentMessage.trim()
        this.currentMessage = ''
        
        window.scrollTo(0, document.body.scrollHeight);

        this.chatSocket.send(JSON.stringify({ message: message }));
    }

  }
}
</script>


<style scoped>

.statusBar {
    width: 100%;
    background-color: var(--bg);
    height: 70px;
    position: fixed;
    top: -65px;
    left: 0;
    right: 0;
}
.top-bar {
    position: fixed; 
    background-color: var(--bg);
    width: 100%;
    left: 0;
}


.chat {
    display: flex;
    flex-direction: column;
    padding: 100px 0;
}

.message {
    padding: 10px 20px;
    margin: 2px;
    margin-right: 35px;
    background-color: rgba(255, 255, 255, 0.081);
    border-radius: 20px 20px 20px 5px;
    width: auto;
    display: inline-block;
}
.messageFromMe .message {
    background-color: var(--orange);
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

.datetime ~ .messageUser {
    margin-top: 0;
}


.textBox {
    width: 100%;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 80px;
    z-index: 100;

    margin: 5px 0;

    display: flex;
    background-color: var(--bg-lighter);
}
.textBox input {
    width: calc(100% - 50px - 10px - 10px);
    margin: 5px;
    margin-bottom: 2px;
    margin-left: 8px;
    min-height: 30px;

    padding: 10px 15px 10px 15px;
    border-radius: 20px;
    border: 1px solid var(--text-gray);
    font-size: 15px;
    font-family: 'Sui Generis';
    border: none;
    outline: none;
    color: white;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    background-color: var(--bg-light);

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
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: brightness(0) saturate(100%) invert(62%) sepia(45%) saturate(1866%) hue-rotate(342deg) brightness(90%) contrast(91%);
}

.datetime {
    text-align: center;
    color: rgba(255, 255, 255, 0.546);
    margin-top: 5px;
}



.topRightButton {
  box-sizing: content-box;
  text-align: right;
  margin-top: 10px;
  margin-left: 20px;
  width: 40px;
  height: 40px;
    filter: brightness(0) saturate(100%) invert(62%) sepia(45%) saturate(1866%) hue-rotate(342deg) brightness(90%) contrast(91%);
}


</style>