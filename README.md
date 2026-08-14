<h1 align="center"> @funnelish/vue3-smooth-dnd </h1>

<p align="center">
  Vue 3 Wrapper of smooth-dnd library.
  <br/>
  <a href="https://gilnd.github.io/vue3-smooth-dnd" target="__blank"><b>Live demo</b></a>
</p>

> **Funnelish fork of [`vue3-smooth-dnd`](https://github.com/gilnd/vue3-smooth-dnd).**
> Pairs with [`@funnelish/smooth-dnd`](https://github.com/Funnelish/smooth-dnd), which adds
> CSS `transform` / `scale` support for dragging inside a zoomed editor canvas. Published to
> GitHub Packages on a fresh `1.x` line — **not** interchangeable with public
> `vue3-smooth-dnd@0.0.x`.
>
> **Install** — requires a GitHub token with `read:packages` (the same one used for
> `@funnelish/ui-lib`) and an `.npmrc` mapping the scope:
>
> ```
> @funnelish:registry=https://npm.pkg.github.com
> //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
> ```
>
> ```shell
> pnpm add @funnelish/vue3-smooth-dnd
> ```
>
> The base library is declared as an npm alias
> (`"smooth-dnd": "npm:@funnelish/smooth-dnd@^1.0.0"`), so the wrapper's own
> `import { smoothDnD } from 'smooth-dnd'` keeps resolving and the diff against
> upstream stays minimal.
>
> **Releasing** — `main` is the integration branch. Bump `version` in
> `packages/lib/package.json`, then open a PR from `main` into `PROD`; merging it
> builds, attests, and publishes. See `.github/workflows/release-package.yml`.

> NOTE: This is a Vue 3 wrapper over [smooth-dnd](https://github.com/kutlugsahin/smooth-dnd) library. It's a fork of the already done [vue2 wrapper](https://github.com/kutlugsahin/vue-smooth-dnd) done by the original author of the library.

All the [documentation](https://github.com/kutlugsahin/vue-smooth-dnd/blob/master/README.md) for the Vue 2 version works with this [package](https://www.npmjs.com/package/vue3-smooth-dnd) version too!
    
## Install

```bash
yarn add vue3-smooth-dnd
```

## Usage
    
```jsx
<template>
  <div>
    <span>Studio Ghibli Tier List</span>
    <Container orientation="vertical" @drop="onDrop">            
      <Draggable v-for="(item, i) in items" :key="item.id">
        <div>
           {{i + 1}} -> {{item.data}}
        </div>
      </Draggable>
    </Container>
  </div>
</template>

<script>
import { Container, Draggable } from "vue3-smooth-dnd";
export default {
  name: "app",
  components: { Container, Draggable },
  data() {
    return {
      items: [
        { id: 1, data: "Princess Mononoke" },
        { id: 2, data: "Spirited Away" },
        { id: 3, data: "My Neighbor Totoro" },
        { id: 4, data: "Howl's Moving Castle" }
      ]
    };
  },
  methods: {  
    onDrop(dropResult){
      this.items = this.applyDrag(this.items, dropResult);
    },
    applyDrag(arr, dragResult){
      const { removedIndex, addedIndex, payload } = dragResult;

      if (removedIndex === null && addedIndex === null) return arr;
      const result = [...arr];
      let itemToAdd = payload;
      
      if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0];
      }
      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd);
      }
      return result;
    }
  }
}
</script>
```
