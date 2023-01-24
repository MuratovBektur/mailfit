import VueRouter from "vue-router";

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Login",
      component: () => import("@/pages/index.vue"),
    },
    {
      path: "/edit/:id",
      name: "Edit",
      component: () => import("@/pages/edit-note.vue"),
    },
  ],
});

export default router;
