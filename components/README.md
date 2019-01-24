# Components

Generally, each file in this directory corresponds to one unique component. In some cases there are special files and we try to keep an updated list available:

* Those starting with underscore, such as `_Global.vue` are _mixins_, and their functionality is included within every component.
* `Snap.vue` is a shared component with specific implementations `SnapCard.vue` and `SnapPage.vue` — they have common functionality but each variant has unique properties or behaviors.
* `Card.vue` is an _extendable_ component. It doesn't do much on its own but again provide common functionality to other components which consider themselves cards. It includes the common subcomponents and contains a few methods and styles common to all cards.
