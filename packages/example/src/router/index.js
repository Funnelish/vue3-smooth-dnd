import { createRouter, createWebHashHistory } from "vue-router";
import navigation from "./navigation";
import NotFound from "../pages/NotFound.vue";

const pageModules = import.meta.glob("../pages/*.vue");

const routes = navigation.reduce((allRoutes, section) => {
  section.pages.forEach((page) => {
    const component = pageModules[`../pages/${page.name}.vue`];

    allRoutes.push({
      name: page.name,
      path: `/${page.name}`,
      component,
      meta: {
        title: page.title,
      },
    });
  });

  return allRoutes;
}, []);

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/cards",
    },
    ...routes,
    {
      path: "/:pathMatch(.*)*",
      name: "404",
      component: NotFound,
      meta: {
        title: "Not Found",
      },
    },
  ],
});

export default router;
