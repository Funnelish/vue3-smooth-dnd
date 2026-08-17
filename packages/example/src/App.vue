<template>
  <div class="app-shell">
    <button
      type="button"
      class="nav-button"
      :class="{ open: isNavOpen }"
      @click="toggleNav"
      aria-label="Toggle examples navigation"
    >
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </button>

    <div
      v-if="isNavOpen"
      class="sidebar-backdrop"
      @click="closeNav"
    ></div>

    <aside class="sidebar" :class="{ open: isNavOpen, closed: !isNavOpen }">
      <div class="sidebar__header">
        <p class="sidebar__eyebrow">Examples</p>
        <h2>vue3-smooth-dnd</h2>
      </div>

      <div class="divider"></div>

      <nav class="sidebar__content">
        <section v-for="section in pages" :key="section.title" class="menu-section">
          <h3>{{ section.title }}</h3>
          <RouterLink
            v-for="page in section.pages"
            :key="page.name"
            class="menu-link"
            :to="{ name: page.name }"
            @click="handleNavigation"
          >
            {{ page.title }}
          </RouterLink>
        </section>
      </nav>
    </aside>

    <div class="content">
      <header class="header">
        <div>
          <p class="header__eyebrow">Demo Browser</p>
          <h1 class="header__title">{{ currentTitle }}</h1>
        </div>
        <button
          v-if="sourceUrl"
          type="button"
          class="source-code"
          @click="openCode"
        >
          View Source
        </button>
      </header>

      <main class="demo">
        <TransformPlayground>
          <router-view></router-view>
        </TransformPlayground>
      </main>
    </div>
  </div>
</template>

<script>
import TransformPlayground from "./components/TransformPlayground.vue";
import navigation from "./router/navigation";

export default {
  name: "App",
  components: {
    TransformPlayground,
  },
  data() {
    return {
      pages: navigation,
      isNavOpen: typeof window !== "undefined" ? window.innerWidth > 960 : true,
    };
  },
  computed: {
    currentTitle() {
      return this.$route.meta.title || "Examples";
    },
    sourceUrl() {
      if (!this.$route.name || this.$route.name === "404") {
        return null;
      }

      return `https://github.com/gilnd/vue3-smooth-dnd/blob/main/packages/example/src/pages/${this.$route.name}.vue`;
    },
  },
  methods: {
    toggleNav() {
      this.isNavOpen = !this.isNavOpen;
    },
    closeNav() {
      this.isNavOpen = false;
    },
    handleNavigation() {
      if (typeof window !== "undefined" && window.innerWidth <= 960) {
        this.closeNav();
      }
    },
    openCode() {
      if (this.sourceUrl) {
        window.open(this.sourceUrl, "_blank");
      }
    },
  },
};
</script>
