<script setup>
defineProps(['points', 'date', 'validated', 'points_type', 'description', 'group_name','added_by']);
import moment from 'moment'
</script>

<template>
    <div class="box">
        <div class="header">
            <div class="header1">
                <div class="points">{{ points }} pkt</div>
                <p class="date">{{ moment(date).format("HH:mm dddd DD.MM") }}</p>
            </div>
            <div class="validation" :class="{'validation-successful': validated}">{{ validated ? 'Zatwierdzone' : "Nie zatwierdzone" }}</div>
        </div>
        <div class="points-type">{{ points_type }}</div>
        <div class="description">{{ description }}</div>
        <div class="footer">
            <p class="group-name">Grupa: {{ group_name }}</p>
            <p class="added-by">Dodał/a: {{ added_by }}</p>
        </div>
    </div>
</template>

<style scoped>
.box {
    background-color: var(--bg-light);
    border-radius: 20px;
    margin-bottom: 14px;
    padding: 12px 20px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
}

.header1 {
    display: flex;
    align-items: center;
    gap: 8px;
}

.validation {
    background-color: var(--red);
    border-radius: 20px;
    padding: 1px 8px;
    font-size: 12px;
}

.validation-successful {
    background-color: green;
}

.date {
    color: var(--text-gray)
}

.points {
    border-radius: 20px;
    background: #DE7539;
    padding: 3px 10px;
}

.footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: var(--text-gray)
}

.points-type {
    font-size: 15px;
}

.description {
    font-size: 12px;
}

</style>