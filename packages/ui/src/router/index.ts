import { createRouter, createWebHistory } from 'vue-router';
import Language from '../views/project/language.vue';
import Template from '../views/project/template.vue';
import type { Pinia } from 'pinia';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      children: [
        {
          path: 'project/template',
          name: 'template',
          component: Template,
        },
        {
          path: 'project/:language',
          name: 'language',
          component: Language,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});
export default (pinia: Pinia) => {
  return router;
};
