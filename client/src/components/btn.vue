<template>
  <button class="btn" @click="$emit('click')">
    <slot />
  </button>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
.btn {
  display: block;
  width: 100%;
  margin: auto;
  background-color: #222222;
  color: #fff;
  cursor: pointer;
  border-radius: 10px;
  padding: 5px 20px;
}
</style>
