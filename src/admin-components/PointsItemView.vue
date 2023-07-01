<script setup>
defineProps(['points', 'date', 'validated', 'points_type', 'description', 'group_name','added_by',
'validationDate', 'validatedBy']);
import moment from 'moment'
</script>

<template>
    <div class="box">
        <div class="header">
            <div class="header1">
                <div class="points"><span class="points-span">{{ points }}</span> pkt</div>
                <p class="date">{{ moment(date).format("HH:mm ddd. DD.MM") }}</p>
            </div>
            <div class="validation" :class="{'validation-successful': validated}">
                <p>{{ validated ? 'Zatwierdzone' : "Nie zatwierdzone" }}</p>
                <p>{{ validationDate ? moment(validationDate).format("HH:mm ddd. DD.MM") : "" }}</p>
                <p>{{ validatedBy }}</p>
            </div>
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
    padding: 2px 10px;
    font-size: 12px;
    text-align: center;
    
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
    padding: 2px 12px;
    font-size: 12px
}
.points-span {
    font-size: 20px;
    line-height: 24px;
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