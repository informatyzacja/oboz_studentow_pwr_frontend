<script setup>

import { IonPage, IonContent } from '@ionic/vue';
import Tinder from '@/components/vue-tinder/Tinder.vue'
import { apiRequest } from '@/stores/functions'
import MyTinderCard from './MyTinderCard.vue'
import TopBar from '@/components/navigation/TopBar.vue'
</script>

<!-- <img slot="like" src="@/assets/tinder/icons8-like-90.png" />
<img slot="nope" src="@/assets/tinder/icons8-reject-90.png" />
<img slot="super" src="@/assets/tinder/icons8-in-love-90.png" /> -->
<template>
    <ion-page>
        <ion-content :fullscreen="true">
            <main>
                <TopBar title="Tinder" />

                <h2 v-if="noMoreProfiles">Koniec profilów.<br>Sprawdź później, czy dołączył ktoś nowy.</h2>

                <Tinder ref="tinder" key-name="id" :queue="queue" :max="3" :offset-y="10" allow-down @submit="onSubmit">
                    <template v-slot="scope">
                        <!-- <div class="pic" :style="{
                        'background-image': `url(https://cn.bing.com//th?id=OHR.${scope.data.id}_UHD.jpg&pid=hp&w=720&h=1280&rs=1&c=4&r=0)`
                    }"></div> -->
                        <MyTinderCard :item="scope.data" />
                    </template>
                    <!-- 
                        <img class="down-pointer" slot="down" src="~img/down-txt.png" />
                        <img class="rewind-pointer" slot="rewind" src="~img/rewind-txt.png" /> -->

                    <template #like>
                        <img class="like-pointer" src="@/assets/tinder/icons8-like-90.png" />
                    </template>
                    <template #nope>
                        <img class="nope-pointer" src="@/assets/tinder/icons8-reject-90.png" />
                    </template>
                    <template #super>
                        <img class="super-pointer" src="@/assets/tinder/icons8-in-love-90.png" />
                    </template>

                </Tinder>
                <div class="btns">
                    <!-- <img src="~img/rewind.png" @click="decide('rewind')" /> -->
                    <img src="@/assets/tinder/icons8-reject-90.png" @click="decide('nope')" />
                    <img src="@/assets/tinder/icons8-in-love-90.png" @click="decide('super')" />
                    <img src="@/assets/tinder/icons8-like-90.png" @click="decide('like')" />
                    <!-- <img src="~img/help.png" @click="decide('help')" /> -->
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
        noMoreProfiles: false
    }),
    created() {
        this.mock();
    },
    methods: {
        async mock() {
            console.log('mock')

            const res = await apiRequest('../api2/tinder/load-profiles/');
            if (res.length === 0) {
                this.noMoreProfiles = true;
                return
            }
            this.queue.push(...res)

        },
        onSubmit({ item, type }) {
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
            apiRequest('../api2/tinder/action/', 'POST', {
                action: apiType,
                target: item.user
            }).then(res => {
                if (res.success) {
                    if (res.match) {
                        console.log('Matched!')
                    }
                }
            })

            if (this.queue.length < 3) {
                this.mock()
            }
            this.history.push(item)
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
                    this.$refs.tinder.rewind(
                        this.history.splice(-Math.ceil(Math.random() * 3))
                    )
                    // Add without API call
                    // this.queue.unshift(this.history.pop())
                    // this.queue.push(this.history.pop())
                    // Add at non-head position
                    // this.queue.splice(1, 0, this.history.pop())
                    // Rewind multiple at once and include non-head added items
                    // this.queue.unshift(this.history.pop())
                    // this.queue.unshift(...this.history)
                }
            } else if (choice === 'help') {
                //
            } else {
                this.$refs.tinder.decide(choice)
            }
        }
    }
}
</script>

<style>
html,
body {
    height: 100%;
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
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    top: 23px;
    margin: auto;
    /* width: calc(100% - 20px); */
    margin: 0 20px;
    /* height: calc(100% - 23px - 65px - 47px - 16px); */
    height: 500px;
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

.btns img {
    margin-right: 12px;
    box-shadow: 0 4px 9px rgba(0, 0, 0, 0.15);
    border-radius: 50%;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
}

.btns img:nth-child(2n + 1) {
    width: 53px;
}

.btns img:nth-child(2n) {
    width: 65px;
}

.btns img:nth-last-child(1) {
    margin-right: 0;
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