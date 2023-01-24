const NOTE_LIST = "note-list";
const noteList = getNodeListFromLocalStorage();

function getNodeListFromLocalStorage() {
  try {
    const list = window.localStorage.getItem(NOTE_LIST);
    if (!list) return [];
    const result = JSON.parse(list);
    return Array.isArray(result) ? result : [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

const state = {
  noteList,
};
const actions = {
  addToNoteList({ commit }, noteList) {
    commit("ADD_TO_NOTE_LIST", noteList);
  },
  editNoteItem({ commit }, note) {
    commit("EDIT_NOTE_ITEM", note);
  },
  removeFromNoteList({ commit }, id) {
    commit("REMOVE_FROM_NOTE_LIST", id);
  },
};
const mutations = {
  ADD_TO_NOTE_LIST(state, noteList) {
    state.noteList.push(noteList);
    window.localStorage.setItem(NOTE_LIST, JSON.stringify(state.noteList));
  },
  EDIT_NOTE_ITEM(state, note) {
    const idx = state.noteList.findIndex((n) => n.id === note.id);
    state.noteList[idx] = note;
    window.localStorage.setItem(NOTE_LIST, JSON.stringify(state.noteList));
  },
  REMOVE_FROM_NOTE_LIST(state, id) {
    state.noteList = state.noteList.filter((note) => note.id !== id);
    window.localStorage.setItem(NOTE_LIST, JSON.stringify(state.noteList));
  },
};
export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
