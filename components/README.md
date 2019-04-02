# Components

Generally, each file in this directory corresponds to one unique component. In some cases there are special files and we try to keep an updated list available:

* Those starting with underscore, such as `_Global.vue` are _mixins_, and their functionality is included within every component that specifies them as a mixin.
* `Snap.vue` is a shared component with specific implementations `SnapCard.vue` and `SnapPage.vue` — they have common functionality but each variant has unique properties or behaviors.
* `Card.vue` is an _extendable_ component. It doesn't do much on its own but again provide common functionality to other components which consider themselves cards. It includes the common subcomponents and contains a few methods and styles common to all cards.
* `KeyMessages` got renamed to **Highlights** on the surface, but all the underlying code in both Contentful and Vue is `KeyMessages`

## Authoring RTL CSS

If a Vue component/page is not already using Sass, enable it by specifying `<style lang="scss">` within the style tag. Then you have the Sass parent selector `&` available to override physical properties or values with RTL adjustments:

```scss
.my-selector {
  margin-left: 1rem;

  // Reverse the physical styles here.
  [dir="rtl"] & {
    margin-left: 0;
    margin-right: 1rem;
  }
}
```
