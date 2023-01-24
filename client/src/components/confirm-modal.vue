<template>
  <Modal class="confirm-modal">
    <div>
      <h2 class="confirm-modal__title">
        <slot />
      </h2>
      <div class="confirm-modal__btns">
        <btn @click="$emit('onCancel')">Нет</btn>
        <btn @click="$emit('onConfirm')">Да</btn>
      </div>
    </div>
  </Modal>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
.confirm-modal {
  &__title {
    font-weight: bold;
    font-size: 20px;
  }
  &__btns {
    margin-top: 30px;
    & > *:first-child {
      margin-bottom: 10px;
    }
  }
}
</style>
