<template>
  <div class="edit-note">
    <h1 class="edit-note__title">
      <template v-if="isNewNote">Создания новой заметки</template>
      <template v-else>Изменение заметки {{ note.title }}</template>
    </h1>
    <div class="edit-note__form">
      <div class="edit-note__form-item">
        <Input
          label="Название заметки"
          v-model="localNote.title"
          @input="onChangeNoteTitle"
        />
      </div>
    </div>
    <div v-for="todo of localNote.todoList" :key="todo.id">
      <div v-if="isNil(prevTodosState[todo.id])" class="edit-note__todo-item">
        <div class="checkbox" @click="toggleTodoCheckedState(todo.id)">
          <div v-if="todo.checked"></div>
        </div>
        <div class="edit-note__todo-item-label">
          <span
            class="strike"
            :class="{
              strike_active: todo.checked,
            }"
          >
            {{ todo.title }}
          </span>
        </div>
        <img
          :src="require('@/assets/img/edit.svg')"
          alt="edit"
          @click="editTodoTitle(todo.id)"
        />
        <img
          :src="require('@/assets/img/trash.svg')"
          alt="trash"
          @click="removeTodoTitle(todo.id)"
        />
      </div>
      <div v-else class="edit-note__todo-item edit-note__todo-item_edit">
        <input
          autofocus
          :ref="`${todoRefName}${todo.id}`"
          v-model="prevTodosState[todo.id]"
          @keyup.enter="confirmNewTodoTitle(todo.id)"
          @keyup.esc="closeEditTodoTitle(todo.id)"
        />
        <img
          :src="require('@/assets/img/check.svg')"
          alt="check"
          @click="confirmNewTodoTitle(todo.id)"
        />
        <img
          :src="require('@/assets/img/close.svg')"
          alt="close"
          @click="closeEditTodoTitle(todo.id)"
        />
      </div>
    </div>
    <div class="edit-note__btns">
      <btn @click="addNewTodo">Добавить новый todo</btn>
      <btn v-if="isNewNote" @click="$router.push('/')">Перейти на главную</btn>
      <btn @click="saveNote">Cохранить изменения</btn>
      <template v-if="!isNewNote">
        <btn @click="showEditModal = true">Отменить редактирование</btn>
        <btn @click="showRemoveModal = true">Удалить</btn>
        <btn @click="goToPrevHistoryIdx">Отменить внесенное изменение</btn>
        <btn @click="goToNextHistoryIdx">Повторить отмененное изменение</btn>
      </template>
    </div>
    <Modal v-if="warnText" class="edit-note__warn-modal">
      <h2 class="edit-note__warn-modal-title">
        {{ warnText }}
      </h2>
      <div class="edit-note__warn-modal-btn">
        <btn @click="warnText = ''">OK</btn>
      </div>
    </Modal>
    <ConfirmModal
      v-if="showRemoveModal"
      @onConfirm="removeNote"
      @onCancel="showRemoveModal = false"
      >{{ constants.REMOVE_TEXT_MODAL }}
    </ConfirmModal>
    <ConfirmModal
      v-if="showEditModal"
      @onConfirm="goToMainPage"
      @onCancel="showEditModal = false"
      >Вы действительно хотите отменить изменение?
    </ConfirmModal>
  </div>
</template>

<script>
import { isNil, debounce } from "lodash";
import Input from "@/components/input.vue";
import ConfirmModal from "@/components/confirm-modal.vue";
import constants from "@/lib/constants.js";

const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};
const delayBeforeGoToHistory = 100;

export default {
  components: {
    Input,
    ConfirmModal,
  },
  data() {
    return {
      constants,
      showRemoveModal: false,
      showEditModal: false,
      warnText: "",
      todoRefName: "todo-input_",
      localeNotesVersionHistoryIdx: 0,
      prevTodosState: {},
      noteVersionHistory: [],
      localNote: {
        id: Date.now(),
        title: "",
        todoList: [],
      },
    };
  },
  computed: {
    noteList() {
      return this.$store.state.note.noteList;
    },
    noteId() {
      return this.$route.params.id;
    },
    isNewNote() {
      return this.noteId === "new";
    },
    todoList() {
      return this.localNote.todoList;
    },
    note() {
      return this.noteList.find((note) => note.id === +this.noteId);
    },
  },
  mounted() {
    if (this.isNewNote) {
      this.addNewTodo();
      return;
    }
    const note = this.note;
    if (!note) {
      this.goToMainPage();
    }
    this.localNote = deepClone(note);
    this.pushToPrevLocalNotes();
  },
  methods: {
    isNil,
    onChangeNoteTitle() {
      this.pushToPrevLocalNotes();
    },
    pushToPrevLocalNotes() {
      const localNote = deepClone(this.localNote);
      if (!this.noteVersionHistory.length) {
        this.noteVersionHistory.push(localNote);
        return;
      }
      // если изменение произошли после отмены
      // внесенных изменений, то необ-мо удалить
      // все последующие изменение начиная со этого индекса
      // например: [0, 1, 2, 3, 4], если изменение произошли с второго индекса,
      // то необ-мо привесту к такому виду: [0,1 ]
      const diff =
        this.noteVersionHistory.length - 1 - this.localeNotesVersionHistoryIdx;
      if (diff) {
        this.noteVersionHistory.splice(-diff);
      }

      const isEqual =
        JSON.stringify(localNote) ===
        JSON.stringify(this.noteVersionHistory.at(-1));
      if (!isEqual) {
        this.noteVersionHistory.push({
          ...localNote,
          time: new Date(),
        });
        this.localeNotesVersionHistoryIdx =
          this.localeNotesVersionHistoryIdx + 1;
      }
    },
    goToPrevHistoryIdx: debounce(function () {
      if (!this.localeNotesVersionHistoryIdx) return;
      const idx = this.localeNotesVersionHistoryIdx - 1;
      this.localeNotesVersionHistoryIdx = idx;
      this.localNote = deepClone(this.noteVersionHistory[idx]);
    }, delayBeforeGoToHistory),
    goToNextHistoryIdx: debounce(function () {
      if (
        this.localeNotesVersionHistoryIdx >=
        this.noteVersionHistory.length - 1
      )
        return;
      const idx = this.localeNotesVersionHistoryIdx + 1;
      this.localeNotesVersionHistoryIdx = idx;
      this.localNote = deepClone(this.noteVersionHistory[idx]);
    }, delayBeforeGoToHistory),
    editTodoTitle(todoId) {
      const todoList = this.todoList;
      const idx = todoList.findIndex((todo) => todo.id === todoId);
      this.$set(this.prevTodosState, todoId, todoList[idx].title);
      this.$nextTick(() => {
        this.$refs[`${this.todoRefName}${todoId}`][0].focus();
      });
    },
    canChangeTodoTitle(todoId) {
      const newTitle = this.prevTodosState[todoId];
      if (!newTitle) {
        this.warnText = "Todo не может быть пустым";
      }
      return !!newTitle;
    },
    canRevertTodoTitle(todoId) {
      const todo = this.todoList.find((todo) => todo.id === todoId);
      if (!todo || !todo.title) {
        this.warnText = "Todo не может быть пустым";
      }
      return !!todo?.title;
    },
    confirmNewTodoTitle(todoId) {
      const newTitle = this.prevTodosState[todoId];
      if (!this.canChangeTodoTitle(todoId)) return;
      const todoList = this.todoList;
      const idx = todoList.findIndex((todo) => todo.id === todoId);
      const updatedTodo = {
        ...todoList[idx],
        title: newTitle,
      };
      this.$set(this.todoList, idx, updatedTodo);
      this.closeEditTodoTitle(todoId);
      this.pushToPrevLocalNotes();
    },
    closeEditTodoTitle(todoId) {
      if (!this.canRevertTodoTitle(todoId)) return;
      this.$set(this.prevTodosState, todoId, null);
    },
    removeTodoTitle(todoId) {
      const todoList = this.todoList;
      const idx = todoList.findIndex((todo) => todo.id === todoId);
      this.todoList.splice(idx, 1);
      this.pushToPrevLocalNotes();
    },
    addNewTodo() {
      const id = Date.now();
      this.todoList.push({
        id,
        title: "",
        checked: false,
      });
      this.editTodoTitle(id);
    },
    toggleTodoCheckedState(todoId) {
      const todoList = this.todoList;
      const idx = todoList.findIndex((todo) => todo.id === todoId);
      const updatedTodo = {
        ...todoList[idx],
        checked: !todoList[idx].checked,
      };
      this.$set(this.todoList, idx, updatedTodo);
      this.pushToPrevLocalNotes();
    },
    validateNote() {
      const note = this.localNote;
      const todoList = note.todoList;
      if (!note.title) {
        this.warnText = "Название заметки не может быть пустым!";
        return false;
      }
      if (!Array.isFilled(todoList)) {
        this.warnText = "Заметка должна содержать хотя бы один todo!";
        return false;
      }

      if (todoList.some((todo) => !todo.title)) {
        this.warnText = "Название todo не может быть пустым!";
        return false;
      }
      return true;
    },
    saveNote() {
      if (!this.validateNote()) return;
      if (this.isNewNote) {
        this.$store.dispatch("note/addToNoteList", this.localNote);
      } else {
        this.$store.dispatch("note/editNoteItem", this.localNote);
      }
      this.goToMainPage();
    },
    removeNote() {
      this.$store.dispatch("note/removeFromNoteList", this.localNote.id);
      this.goToMainPage();
    },

    goToMainPage() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped lang="scss">
$icon-margin-right: 10px;

.edit-note {
  width: 90%;
  max-width: 400px;
  &__title {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
  }
  &__form {
    margin-bottom: 20px;
    &-item {
      margin-bottom: 10px;
    }
  }
  &__todo-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-size: 18px;
    & > *:not(:last-child) {
      margin-right: $icon-margin-right;
    }
    &-label {
      flex-grow: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    & > .checkbox {
      flex-shrink: 0;
    }
    & > img {
      cursor: pointer;
    }
    &_edit {
      & > input {
        flex-grow: 1;
        padding: 3px;
        margin-left: 25px;
        border: 1px solid #222;
        border-radius: 5px;
      }
    }
  }
  &__btns {
    margin-top: 20px;
    & > *:not(:last-child) {
      margin-bottom: 10px;
    }
  }
  &__warn-modal {
    &-title {
      font-size: 20px;
      font-weight: 500;
    }
    &-btn {
      margin-top: 10px;
    }
  }
}
.checkbox {
  width: 20px;
  height: 20px;
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  & > div {
    width: 70%;
    height: 70%;
    background-color: #000;
  }
}

.strike {
  --thickness: 0.1em;
  --strike: 0;

  background: linear-gradient(90deg, transparent, currentColor 0) no-repeat left
    center / calc(var(--strike) * 100%) var(--thickness);

  transition: background-size 0.3s ease;
  &_active {
    --strike: 1; /* "1" means "true" (show the strike line) */
    background-position-x: left;
  }
}
</style>
