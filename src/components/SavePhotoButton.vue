<script setup>
import { Media } from "@capacitor-community/media";
import { IonSpinner } from '@ionic/vue';
import { toastController } from '@ionic/vue'
defineProps({
    path: {
        type: String,
        required: true
    },
    text: {
        type: String,
        default: "Zapisz w galerii"
    }
});
</script>
<template>
    <a class="button" @click="save">
        <span v-if="!loading">{{ text }}</span>
        <ion-spinner v-else name="dots" />
    </a>
</template>

<script>
export default {
    data() {
        return {
            loading: false
        }
    },
    methods: {
        async save() {
            if (this.loading) return;
            if (!this.path) return;
            this.loading = true;
            try {
                await Media.savePhoto({
                    path: this.path
                });
            } catch (error) {
                // Handle error here
            } finally {
                this.loading = false;
                toastController.create({
                    message: 'Zdjęcia zostały zapisane!',
                    duration: 2000,
                    color: 'success',
                    position: 'top'
                }).then(toast => toast.present());
            }
        }
    }
}
</script>