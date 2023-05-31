<script setup> 
defineProps({
    bigText: {
        type: String,
        required: true
    },
    smallText: {
        type: String,
        required: false
    },
    leftBigText: {
        type: String,
        required: false
    },
    bgColor: {
        type: String,
        required: false,
        default: 'var(--bg-light)'
    },
    leftIcon: {
        type: String,
        required: false,
    },
    rightIcon: {
        type: String,
        required: false,
    },
    small: {
        type: Boolean,
        required: false,
        default: false
    }

});

</script>

<template>
    <div class="item" :style="{ backgroundColor: bgColor }" :class="{ small: small }">

        <div class="itemLeft">
            <div v-if="leftIcon" class="leftIcon">
                <img :src="leftIcon"/>
            </div>
            <h6>{{ leftBigText }}</h6>
            <div class="text">
                <h5>{{ bigText }}</h5>
                <p v-if="smallText">{{ smallText }}</p>
            </div>
        </div>
        <div v-if="rightIcon" class="rightIcon">
            <img :src="rightIcon"/>
        </div>
    </div>
</template>


<style scoped>


.item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    padding: 10px 15px;
    border-radius: 20px;
    margin-bottom: 10px;

    min-height: 60px;
}

.itemLeft {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    gap: 10px;
}

h5 {
    margin: 0;
    padding: 1px;
    font-size: 17px;
    line-height: 17px;
}

h6 {
    margin: 0;
    padding: 1px;
    font-size: 12px;
    line-height: 13px;
    color: var(--text-gray);
}

p {
    margin: 0;
    padding: 1px;
    font-size: 11px;
    line-height: 11px;
    color: var(--text-gray);
}

.rightIcon {
    max-height: 30px;
    max-width: 30px;
    display: flex;
    margin-left: 10px
}

.leftIcon {
    width: 40px;
    height: 40px;
}

.leftIcon img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.small {
    min-height: 45px;
    padding: 5px 15px;
}
.small .leftIcon {
    width: 32px;
    height: 32px;
}

</style>