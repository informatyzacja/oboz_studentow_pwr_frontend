<script setup>
import { IonIcon } from '@ionic/vue';
import { home, person, people } from 'ionicons/icons';
import moment from 'moment';
defineProps(['chat']);
import noRemindersIcon from '@/assets/icons8-no-reminders-96.png';
</script>

<template>
    <div class="chat-element">
        <div class="chat-element__avatar">
            <ion-icon v-if="chat.house_chat" :src="home" />
            <img class="avatar" :src="chat.avatar" alt="avatar" v-else-if="chat.avatar" />
            <ion-icon v-else-if="chat.users.length <= 2" :src="person" />
            <ion-icon v-else :src="people" />
        </div>
        <div class="chat-element__content">
            <div class="chat-element__header">
                <h4>{{ chat.name }}</h4>
                <p>{{ last_message_date }}</p>
            </div>
            <div class="chat-element__message">
                <p v-if="chat && chat.last_message">{{ chat.last_message.fromMe ? 'Ty:' :
                    (chat.last_message.username ? chat.last_message.username + ':' : '') }} {{
                        chat.last_message.message ? chat.last_message.message.substring(0, 250) : ''
                    }}{{ chat.last_message.message && chat.last_message.message.length > 250 ? '...' : '' }}
                </p>
                <img v-if="chat.notifications_blocked" :src="noRemindersIcon" class="no-reminders" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        last_message_date() {
            if (!this.chat.last_message || !this.chat.last_message.date || !this.chat.last_message.chat) {
                return '';
            }
            if (moment(this.chat.last_message.date).isSame(new Date(), "day"))
                return moment(this.chat.last_message.date).format('HH:mm');
            return moment(this.chat.last_message.date).format('dddd HH:mm');
        }
    }
}
</script>

<style scoped>
.chat-element {
    display: flex;
    align-items: center;
    padding: 1rem;
    margin: 1rem;
    border-radius: 10px;
    background-color: var(--bg-lighter);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.chat-element__avatar {
    margin-right: 1rem;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.chat-element__avatar img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
}

.chat-element__avatar ion-icon {
    font-size: 30px;
    color: white
}

.chat-element__content {
    flex: 1;
}

.chat-element__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chat-element__header h4 {
    margin: 0;
    font-size: 1rem;
}

.chat-element__header p {
    margin: 0;
    font-size: 0.8rem;
    color: var(--text-gray);
}

.chat-element__message {
    font-size: 0.9rem;
    color: var(--text-gray);
    display: flex;
    justify-content: space-between;
    align-content: start;
}

.avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.no-reminders {
    width: 20px;
    height: 20px;
    margin-left: .4rem;
}
</style>