<template>
  <div class="modal">
    <div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
.modal {
  position: fixed;
  z-index: 600;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  & > * {
    margin: 20px;
    padding: 20px 40px;
    background-color: #fff;
    min-width: 200px;
  }
}
</style>
