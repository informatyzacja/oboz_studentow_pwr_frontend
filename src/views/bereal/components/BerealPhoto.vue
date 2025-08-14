<script setup>
import HeartIcon from '../../../assets/heart-icon.png';
import RedHeartIcon from '../../../assets/heart-icon-red.png';
import DotsIcon from '../../../assets/icons8-dots-90.png';
import { toastController, IonActionSheet } from '@ionic/vue';
import { apiRequest } from '@/stores/functions';
import { alertController } from '@ionic/vue';

defineProps({
    photo1: String,
    photo2: String,
    user_name: String,
    user_profile_photo: String,
    liked: Boolean,
    num_likes: Number,
    late: Boolean,
    id: Number,
    hide_options: Boolean
});
</script>

<template>
    <div :style="{ backgroundImage: `url(${mainPhoto})` }" class="bereal-photo">
        <div class="bereal-photo__overlay">
            <div class="bereal-photo__bottom_bar">
                <div class="bereal-photo__actions">
                    <div v-if="_num_likes >= 0" class="bereal-photo__like" @click="like_or_unlike">
                        <img v-if="_liked" :src="RedHeartIcon" class="heart-icon heart-icon-liked" />
                        <img v-else :src="HeartIcon" class="heart-icon" />
                        <span v-if="_num_likes > 0">{{ _num_likes }}</span>
                    </div>
                </div>
                <div class="bereal-photo__user-info">
                    <span class="user-name">{{ user_name }}</span>
                    <img :src="user_profile_photo" class="user-profile-photo" />
                </div>
            </div>
            <div class="bereal-photo__additional-photo" @click="swapPhotos"
                :style="{ backgroundImage: `url(${secondaryPhoto})` }">
            </div>
            <div v-if="late" class="bereal-photo__late">
                LATE
            </div>
            <div class="bereal-photo__options" v-if="!hide_options">
                <img :src="DotsIcon" :id="'open-action-sheet-' + id" />
                <ion-action-sheet :trigger="'open-action-sheet-' + id"
                    :buttons="actionSheetButtons"></ion-action-sheet>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            mainPhoto: this.$props.photo1 || '',
            secondaryPhoto: this.$props.photo2 || '',
            _liked: this.$props.liked || false,
            _num_likes: this.$props.num_likes || 0,
            actionSheetButtons: [
                {
                    text: 'Zgłoś post naruszający zasady',
                    role: 'destructive',
                    data: {
                        action: 'delete',
                    },
                    handler: () => {
                        this.report(this.id)
                    }
                },
                {
                    text: 'Anuluj',
                    role: 'cancel',
                    data: {
                        action: 'cancel',
                    },
                },
            ]
        }
    },
    mounted() {

    },
    methods: {
        swapPhotos() {
            const temp = this.mainPhoto;
            this.mainPhoto = this.secondaryPhoto;
            this.secondaryPhoto = temp;
        },
        like_or_unlike() {
            if (this._liked) {
                this.unlike();
            } else {
                this.like();
            }
        },
        like() {
            apiRequest(
                `../api2/bereal/like/${this.id}/`,
                'POST' 
            ).then(res => {
                if (res.success) {
                    this._liked = true;
                    this._num_likes++;
                }
            });
        },
        unlike() {
            apiRequest(
                `../api2/bereal/unlike/${this.id}/`,
                'DELETE'
            ).then(res => {
                if (res.success) {
                    this._liked = false;
                    this._num_likes--;
                }
            });
        },
        async report() {
            console.log(`Reported post with ID: ${this.id}`);
            // show alert asking for reason
            const alert = await alertController.create({
                header: 'Zgłoś post',
                inputs: [
                    {
                        name: 'reason',
                        type: 'text',
                        placeholder: 'Podaj powód zgłoszenia'
                    }
                ],
                buttons: [
                    {
                        text: 'Anuluj',
                        role: 'cancel'
                    },
                    {
                        text: 'Zgłoś',
                        handler: (data) => {
                            this.submitReport(data.reason);
                        }
                    }
                ]
            });
            await alert.present();
        },
        submitReport(reason) {
            apiRequest(
                `../api2/bereal/report/${this.id}/`,
                'POST',
                { reason: reason }
            ).then(res => {
                if (res.success) {
                    toastController.create({
                        message: 'Post został zgłoszony!',
                        duration: 2000,
                        color: 'success',
                        position: 'top'
                    }).then(toast => toast.present())
                }
            });
        }
    }
};
</script>

<style scoped>
.bereal-photo {
    border-radius: 30px;
    overflow: hidden;
    aspect-ratio: 16/9;
    background-size: cover;
    background-position: center;
    position: relative;
    background-color: black;
}
.bereal-photo__bottom_bar{
    width: 100%;
    height: 25%;
    display: flex;
    background: linear-gradient(to top, rgba(0, 0, 0, 1), transparent);
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    color: white;
    font-size: 1em;
    position: absolute;
    bottom: 0;
}
.bereal-photo__user-info {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-right: 5px;
}
.user-profile-photo {
    height: 90%;
    aspect-ratio: 1/1;
    border-radius: 50%;
    object-fit: cover;
    background-color: gray;
}
.bereal-photo__additional-photo {
    position: absolute;
    top: 10px;
    left: 10px;
    height: 40%;
    aspect-ratio: 16/9;
    border-radius: 20px;
    overflow: hidden;
    border: 2px solid white;
    background-size: cover;
    background-position: center;
}
.bereal-photo__actions {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 100%;
    margin-left: 10px;
}
.heart-icon {
    width: 25px;
    height: 25px;
    margin-right: 5px;
}
.heart-icon:not(.heart-icon-liked) {
    filter: invert(100%);
}
.bereal-photo__like {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 0.8em;
}
.bereal-photo__late {
    position: absolute;
    top: 20px;
    left: 20px;
    background: white;
    color: black;
    padding: .08em .4em;
    border-radius: .4em;
    opacity: 0.6;
    font-size: 0.8em;
}
.bereal-photo__options {
    position: absolute;
    top: 9px;
    right: 14px;
    cursor: pointer;
    width: 12px;
    filter: invert(100%);
}
</style>