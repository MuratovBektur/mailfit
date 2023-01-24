<template>
  <div class="note-list">
    <h1 class="note-list__title">Список заметок</h1>
    <div class="note-list__list" v-if="Array.isFilled(noteList)">
      <div v-for="note of noteList" :key="note.id">
        <NoteItem :note="note"></NoteItem>
      </div>
    </div>
    <div class="note-list__empty-list" v-else>
      <h2 class="note-list__empty-list-title">Список заметок пуст</h2>
    </div>
    <div class="note-list__add-note">
      <btn @click="$router.push('/edit/new')">Добавить заметку</btn>
    </div>
  </div>
</template>

<script>
import NoteItem from "@/components/note-item.vue";
export default {
  components: {
    NoteItem,
  },
  data() {
    return {
      isValidatingForm: false,
      errorMsg: "",
      form: {
        email: "",
        password: "",
      },
    };
  },
  computed: {
    noteList() {
      return this.$store.state.note.noteList;
    },
  },
};
</script>

<style lang="scss" scoped>
.note-list {
  width: 80%;
  margin: 0 auto;
  &__title {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
  }
  &__list {
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, 200px);
    grid-gap: 20px;
    justify-content: space-evenly;
    padding: 10px;
  }
  &__empty-list {
    margin-top: 20px;
    color: blue;
    text-align: center;
    &-title {
      font-weight: bold;
    }
  }
  &__add-note {
    margin-top: 50px;
    & > * {
      width: 50%;
    }
  }
}
</style>
