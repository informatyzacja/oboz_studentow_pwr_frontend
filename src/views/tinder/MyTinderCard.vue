<script setup>
defineProps({
    item: Object,
    editable: {
        type: Boolean,
        default: false,
    }
});

import LoadingIndicator from '@/components/LoadingIndicator.vue';
import { IonButton, IonIcon } from '@ionic/vue';
import { createOutline, imageOutline } from 'ionicons/icons';

import { useApiDataStore } from '@/stores/api.js'
import { mapStores } from 'pinia'

</script>

<template>
    <div class="tinder-card">
        <div class="tinder-card__content">
            <div class="tinder-card__image">
                <LoadingIndicator v-if="item.photo && !isLoaded" inline />
                <img :src="item.photo" alt="tinder" @load="loaded" v-show="isLoaded" v-if="item.photo" />


                <div v-if="editable">
                    <div class="edit-button edit-photo">
                        <IonButton @click="addPhoto" fill="clear">
                            <ion-icon slot="icon-only" :icon="imageOutline"></ion-icon>
                        </IonButton>
                    </div>
                </div>
            </div>
            <div class="tinder-card__info">
                <h2>
                    {{ item.name }}

                    <IonButton @click="editDescription" fill="clear" size="small" class="edit-description"
                        v-if="editable">
                        <ion-icon slot="icon-only" :icon="createOutline"></ion-icon>
                    </IonButton>
                </h2>
                <p>{{ description }}</p>
            </div>
        </div>
    </div>

</template>


<script>
export default {
    data() {
        return {
            isLoaded: false,
        }
    },
    computed: {
        ...mapStores(useApiDataStore),
        description() {
            // max X characters
            if (!this.item.description) return '';
            const X = 80;
            if (this.item.description.length > X) {
                return this.item.description.substring(0, X) + '...';
            }
            return this.item.description;
        },
        descriptionIsLonger() {
            return this.item.description && this.item.description.length > 80;
        }
    },
    methods: {
        loaded() {
            this.isLoaded = true;
        },
        notLoaded() {
            this.isLoaded = false;
        },
        addPhoto() {
            this.$emit('addPhoto');
        },
        editDescription() {
            this.$emit('editDescription');
        },
    },
    expose: ['notLoaded'],
}
</script>

<style scoped>
ion-icon {
    color: white;
}

.edit-button {
    position: absolute;
    z-index: 5;
    background: radial-gradient(circle, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 65%);
}

.edit-photo {
    top: 5px;
    right: 0;
}

.tinder-card {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    /* height: 500px; */
    /* padding: 0 20px; */
}

.tinder-card__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.165);
    border-radius: 10px;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
    /* padding: 20px; */
    position: relative;
    overflow: hidden;
}

.tinder-card__image {
    position: absolute;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}

.tinder-card__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
}

.tinder-card__info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: left;
    padding: 0 1rem;
    padding-bottom: .8rem;
    padding-top: 3rem;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.9) 10%, rgba(0, 0, 0, 0) 100%);
}

.tinder-card__info h2 {
    font-size: 24px;
    margin-bottom: 5px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0;
    margin-right: -10px;

    color: white;
}

.tinder-card__info p {
    font-size: 16px;
    color: var(--text-light);
}
</style>