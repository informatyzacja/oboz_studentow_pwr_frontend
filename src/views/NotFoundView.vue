<template>
  <div class="padding-main">
    <div class="center">
      <h1>Podana strona nie została znaleziona</h1>
      <RouterLink :to="$router.options.history.state.back || '/'">
        <button class="button">&larr; Wróć</button>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.center {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

h1 {
  font-size: 40px;
  font-family: 'Sui Generis';
  margin-bottom: 20px;
  text-align: center;
  background: var(--radial-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.button {
  border-radius: 20px;
  border: none;
  color: black;
  padding: 20px 35px;
  font-size: 17px;
  line-height: 16px;
  cursor: pointer;
  font-family: 'Sui Generis';

  display: flex;
  justify-content: center;

  margin-bottom: 12px;

  background: var(--radial-gradient);
}
</style>
