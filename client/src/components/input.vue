<template>
  <div class="input__container">
    <div v-if="label" class="input__label">{{ label }}:</div>
    <input
      class="input__input"
      :value="value"
      @input="handleInput"
      :type="type"
    />
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    value: String,
    type: {
      type: String,
      default: "text",
    },
  },
  methods: {
    handleInput(e) {
      this.$emit("input", e.target.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.input {
  &__container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  &__label {
    font-weight: 500;
    margin-bottom: 10px;
    font-size: 20px;
  }
  &__input {
    text-indent: 10px;
    outline: none;
    border: 1px solid #666;
    border-radius: 5px;
    min-height: 27px;
    display: block;
    width: 100%;
  }
}
</style>
