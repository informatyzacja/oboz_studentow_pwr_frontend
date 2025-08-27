<script setup>
import { ref, computed, watch, onBeforeUnmount, onMounted, toRefs } from 'vue'
import { IonNavLink } from '@ionic/vue'
import ItemBox from '../../../components/ItemBox.vue'
import CameraIcon from '../../../assets/icons8-camera-100.png';
import { useRouter } from 'vue-router'
import { IonButton } from '@ionic/vue'


// Use toRefs to keep reactivity when destructuring props
const rawProps = defineProps({
    bereal_status: {
        type: Object,
        default: () => ({})
    },
    show_only_if_live: {
        type: Boolean,
        default: false
    }
})
const { bereal_status, show_only_if_live } = toRefs(rawProps)
const router = useRouter()

const secondsLeft = ref(0);
let timerId = null;

function getDeadline() {
    const d = bereal_status.value?.deadline
    return d ? new Date(d) : null
}

const isEventActive = computed(() => !!(bereal_status.value?.is_active && secondsLeft.value > 0))

function updateSeconds() {
    const deadline = getDeadline()
    if (!deadline) {
        secondsLeft.value = 0
        return
    }
    const diff = Math.floor((deadline.getTime() - Date.now()) / 1000)
    secondsLeft.value = diff > 0 ? diff : 0
}

function startTimer() {
    stopTimer()
    updateSeconds()
    timerId = setInterval(() => {
        updateSeconds()
        if (secondsLeft.value === 0) stopTimer()
    }, 1000)
}

function stopTimer() {
    if (timerId) {
        clearInterval(timerId)
        timerId = null
    }
}

function startCamera() {
    // usuń blokadę po publikacji – pozwól wejść do kamery
    localStorage.removeItem('bereal_post_published')
    router.push('/bereal/camera')
}

onMounted(() => {
    if (getDeadline()) startTimer(); else stopTimer()
})

// Watch for deadline changes to restart / stop timer
watch(() => bereal_status.value?.deadline, (newDeadline, oldDeadline) => {
    if (newDeadline !== oldDeadline) {
        if (newDeadline) startTimer(); else stopTimer()
    }
})

// Watch for is_active changes; if event becomes active and we have a deadline ensure timer runs
watch(() => bereal_status.value?.is_active, (isActive) => {
    if (isActive && getDeadline()) {
        if (!timerId) startTimer();
    } else if (!isActive) {
        // If event ends, we still might allow late posting. Keep secondsLeft at 0 if past deadline.
        updateSeconds();
    }
})

onBeforeUnmount(stopTimer);



</script>

<template>
    <div class="bereal_top_functions" v-if="!show_only_if_live || isEventActive">
        <ItemBox
            v-if="!bereal_status.was_today"
            :big-text="'Dziś jeszcze nie było BeerReala'" small />
        <ItemBox
            v-if="!bereal_status.can_post && bereal_status.was_today"
            :big-text="'Przesłałeś/aś już dzisiaj BeerReala'" small />
        <ItemBox
            v-else-if="bereal_status.is_active && isEventActive"
            :big-text="'It\'s time to BeerReal! Zrób zdjecie ' + secondsLeft + 's...'" small />
        <ItemBox
            v-else-if="!bereal_status.is_active || !isEventActive && bereal_status.was_today"
            :big-text="'Dzisiejszy BeerReal był o ' + new Date(bereal_status.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ale nadal możesz przesłać zdjęcie.'"
            small />

        <IonButton v-if="bereal_status.can_post" @click="startCamera" fill="clear" class="camera-link">
            <ItemBox big-text="Zrób zdjęcie" :leftIcon="CameraIcon" small leftIconWhite noRoundIcon />
        </IonButton>
    </div>
</template>

<style scoped>
.bereal-photo {
    margin: 10px;
}

.bereal_top_functions {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 10px;
}
</style>