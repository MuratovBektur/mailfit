<template>
  <div class="note-item">
    <h2 class="note-item__title">
      {{ note.title }}
    </h2>
    <div class="note-item__todo-list" v-if="Array.isFilled(note.todoList)">
      <div
        class="note-item__todo"
        v-for="todo of note.todoList"
        :key="todo.id"
        :title="todo.title"
      >
        - {{ todo.title }}
      </div>
    </div>
    <btn class="note-item__btn" @click="$router.push(`/edit/${note.id}`)"
      >Изменить</btn
    >
    <btn class="note-item__btn" @click="showModal = true">Удалить</btn>
    <ConfirmModal
      v-if="showModal"
      @onConfirm="removeNote(note.id)"
      @onCancel="showModal = false"
    >
      {{ constants.REMOVE_TEXT_MODAL }}
    </ConfirmModal>
  </div>
</template>

<script>
import ConfirmModal from "./confirm-modal.vue";
import constants from "@/lib/constants.js";
export default {
  components: {
    ConfirmModal,
  },
  props: {
    note: Object,
  },
  data() {
    return {
      constants,
      showModal: false,
    };
  },

  methods: {
    removeNote(id) {
      this.$store.dispatch("note/removeFromNoteList", id);
      this.showModal = false;
    },
  },
};
</script>

<style scoped lang="scss">
.note-item {
  border: 2px solid grey;
  border-radius: 10px;
  padding: 15px 20px;

  &__title {
    text-align: center;
    font-weight: bold;
    margin-bottom: 10px;
  }

  &__todo {
    &-list {
      height: 120px;
      width: 75%;
      margin: auto;
    }
    display: list-item;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &__btn {
    display: block;
    width: 100%;
    margin: auto;
    background-color: #222222;
    color: #fff;
    cursor: pointer;
    border-radius: 10px;
    margin-top: 10px;
    padding: 5px 0;
  }
}
</style>
