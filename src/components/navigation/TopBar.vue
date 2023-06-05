<script setup>
defineProps({
    title: {
        type: String
    },
    backLink: {
        type: String
    },
    absolute: {
        type: Boolean,
        default: false
    }
});
</script>

<template>
    <div class="header" :class="{header_absolute: absolute}">
        <RouterLink v-if="backLink" :to="backLink">
            <div class="arrow-circle" >
              <div class="arrow"></div>
            </div>
        </RouterLink>
        <h1>{{ title }}</h1>
    </div>
</template>

<style scoped>

.header {
    padding: 20px 20px 5px;
    display: flex;
    align-items: center;
}
.header_absolute {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 10px 10px 5px;
    z-index: 1;
}
h1 {
  background: var(--radial-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.arrow-circle {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.header_absolute .arrow-circle {
  background: radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.483) 0%, rgba(255, 255, 255, 0) 100%);
}
.arrow {
  border: solid black;
  border-width: 0 4px 4px 0;
  border-image: var(--radial-gradient) 1;
  display: inline-block;
  padding: 7px;
  margin-left: 4px;
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
}

.header_absolute .arrow {
  border-image: none;
  border-color: black;
}
</style>