<template>
  <div id="app">
    <div>
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style lang="scss">
@import "assets/css/reset.css";

#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  padding: 20px 0;
  display: flex;
  justify-content: center;
  background-color: skyblue;
  & > div {
    min-width: 320px;
    max-width: 1200px;
    width: 90vw;
    border: 1px solid grey;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border-radius: 20px;
    padding: 20px;
  }
}
</style>
