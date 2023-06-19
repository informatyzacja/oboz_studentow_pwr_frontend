<script setup>
import ItemBox from '../components/ItemBox.vue';
import TopBar from '../components/navigation/TopBar.vue';
</script>

<template>
    <div class="padding">
        <TopBar title="Skaner"/>
        <RouterLink to="/skaner/posilki">
            <ItemBox bigText="Walidacja posiłków"/>
        </RouterLink>
        <ItemBox bigText="Dodaj punkty"/>
        <ItemBox bigText="Informacje o uczestniku"/>
    </div>
</template>