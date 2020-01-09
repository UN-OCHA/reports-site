<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
  import CardActions from '~/components/CardActions';
  import CardHeader from '~/components/CardHeader';
  import CardFooter from '~/components/CardFooter';

  export default {
    components: {
      CardActions,
      CardHeader,
      CardFooter,
    },

    props: {
      forceExpanded: {
        type: Boolean,
        required: false,
        default: false,
      },
    },

    data() {
      return {
        cardMinGrowth: 150,
        cardMinHeight: 200,
        cardHeight: 'auto',
        isExpandable: false,
        isExpanded: false,
      };
    },

    computed: {
      // Allows us to smoothly transition between unknown min-max heights.
      // Returns 'auto' when no transition is necessary.
      getCardHeight() {
        if (this.forceExpanded || !this.isExpandable) {
          return 'auto'
        } else {
          return this.isExpanded ? this.cardHeight + 'px' : this.cardMinHeight + 'px';
        }
      },
    },

    methods: {
      computeCardHeight() {
        // Do some client-side manipulation of the Cards to expose a read-more
        // button on some entries. We calculate the height of the article as
        // rendered in browser then truncate when it exceeds a certain height.
        let card = this.$refs['card'];
        let cardImg = this.$refs['cardImg'];

        // First, check if the card $ref is there at all. Cards without the
        // required $refs should not encounter errors.
        if (typeof card === 'undefined') {
          return;
        }

        // Set the article's min-height to the constant, or if the image is
        // present, the height of the image + caption.
        this.cardMinHeight = (!!this.articleHasImage) ? Math.max(cardImg.clientHeight, this.cardMinHeight) : this.cardMinHeight;

        // If the expanded article text will be sufficiently longer than the
        // accompanying image or the minimum defined in data(), then we apply
        // the 'Read More' treatment.
        if (card.clientHeight > (this.cardMinHeight + this.cardMinGrowth)) {
          this.cardHeight = card.clientHeight;
          this.isExpandable = true;
        }
      },
    },

    mounted() {
      // When any Card mounts resulting from client-side navigation, we need to
      // wait for any potential images to load before trying to calculate the
      // truncated size.
      if (!this.forceExpanded) {
        setTimeout(this.computeCardHeight, 500);
      }
    },
  }
</script>

<style lang="scss">
//
// Import shared variables
//
@import '~/assets/Global.scss';

//
// Generic Card styles are in default.vue — inlined as critical CSS.
//
.card {
  @media screen {
    //
    // Read more: initial state
    //
    .is--expandable {
      position: relative;
      overflow: hidden;
      margin-bottom: 1em;
      --gradient-from: rgba(255, 255, 255, 0);
      --gradient-to: rgba(255, 255, 255, 1);

      // height is measure before truncating text and value is stored on component
      // meaning we can safely transition since `auto` is not set once JS runs.
      transition: height .666s ease-in-out;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 8em;
        background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0) 33%, rgba(255, 255, 255, 1) 100%);
        background-image: linear-gradient(to bottom, var(--gradient-from) 33%, var(--gradient-to) 100%);
        transition: opacity .666s ease-in-out;
        // Cluster bucket headings are pos:rel for their icons. Ensure that our
        // gradient is above any heading.
        z-index: 1;
      }
    }

    .btn--toggle-text {
      display: block;
      width: auto;
      border: none;
      padding: 0 1em 0 0;
      margin: 1rem 0 0 0;
      background: transparent url('/assets/icons/icon--down-arrow.svg') no-repeat 100% 55%;
      background-size: 12px auto;
      color: hsl(0, 0%, 50%);
      font-family: $roboto;
      font-size: 1em;
      line-height: 1;
      text-transform: uppercase;
      cursor: pointer;

      [dir="ltr"] & {
        float: left;
        clear: left;
      }
      [dir="rtl"] & {
        float: right;
        clear: right;
      }

      [lang="ar"] & {
        font-family: $kufi;
      }

      &:focus {
        outline: none;
      }

      &.is--expanded {
        background-image: url('/assets/icons/icon--up-arrow.svg');
      }
    }

    //
    // Read more: Expanded state
    //
    .is--expandable.is--expanded {
      &::before {
        content: none;
        opacity: 0;
      }
    }
  } // @media screen

  //
  // Print layout
  //
  // While capturing PNG or PDF we don't need interactive elements:
  //
  // * Ensure text content is totally visible
  // * Don't render read-more buttons.
  //
  @media print {
    .is--expandable {
      // Force full-height content.
      height: auto !important;

      // Remove white gradient that normally appears on expandable content.
      &::before {
        content: none;
        opacity: 0;
      }
    }

    // Do not show read-more button.
    .btn--toggle-text {
      display: none !important;
    }
  }

  //
  // Snap Service
  //
  // While capturing PNG or PDF we need non-interactive elements:
  //
  // * Ensure text content is totally visible
  // * Don't render read-more buttons.
  //
  .snap--png &,
  .snap--pdf & {
    .is--expandable {
      // Force full-height content.
      height: auto !important;

      // Remove white gradient that normally appears on expandable content.
      &::before {
        content: none;
        opacity: 0;
      }
    }

    // Do not show read-more button.
    .btn--toggle-text {
      display: none !important;
    }
  }
}

</style>
