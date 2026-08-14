<script>
import NavBar from './components/NavBar.vue';
import TransformPlayground from './components/TransformPlayground.vue';

export default {
  name: "App",
  components: { NavBar, TransformPlayground },
  beforeMount() {
    this.$store.dispatch("initTheme");
  },
};
</script>

<template>
  <div class="bg-gray-300 dark:bg-gray-900 h-screen flex flex-col">
    <NavBar ></NavBar>
    <main class="flex-grow overflow-auto p-4">
      <TransformPlayground>
        <router-view></router-view>
      </TransformPlayground>
    </main>
  </div>
</template>
