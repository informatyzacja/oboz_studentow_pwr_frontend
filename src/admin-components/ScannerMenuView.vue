<script setup>
import ItemBox from '../components/ItemBox.vue';
import TopBar from '../components/navigation/TopBar.vue';

import arrow from '../assets/arrow.svg'
import mealIcon from '../assets/icons8-cutlery.png'
import userIcon from '../assets/icons8-male_user.png'
import pointsIcon from '../assets/icons8-scoreboard.png'
</script>

<template>
    <div class="padding">
        <TopBar title="Skaner"/>
        <RouterLink to="/skaner/posilki">
            <ItemBox bigText="Walidacja posiłków" :leftIcon="mealIcon" :rightIcon="arrow"/>
        </RouterLink>
        <ItemBox bigText="Dodaj punkty" :leftIcon="pointsIcon" :rightIcon="arrow"/>
        <ItemBox bigText="Informacje o uczestniku" :leftIcon="userIcon" :rightIcon="arrow"/>
    </div>
</template>