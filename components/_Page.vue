<script>
  export default {
    methods: {
      //
      // Align Column Heights
      //
      // Browsers that don't support CSS Grid need a little help aligning their
      // column heights. This function reads the height of both columns and sets
      // them to be equal.
      //
      alignColumnHeights() {
        if (
          typeof window.CSS !== 'undefined' &&
          typeof window.CSS.supports !== 'undefined' &&
          window.CSS.supports('display', 'grid')
        ) {
          // Browsers supporting CSS Grid will render properly without assistance.
        }
        else {
          // Calculate which column is tallest
          let col1 = this.$refs.column1;
          let col2 = this.$refs.column2;
          let col1Height = col1.getBoundingClientRect().height;
          let col2Height = col2.getBoundingClientRect().height;
          let tallestHeight = (col1Height > col2Height) ? col1Height : col2Height;

          // Both should be set to the height of the taller element;
          col1.style.height = col2.style.height = Math.ceil(tallestHeight) + 'px';
        }
      },
    },
  }
</script>

<style lang="scss">
//
// Import shared variables
//
@import '~/assets/Global.scss';

//
// Shared layout for Basic Page
//
// Since these are shared across multiple page components, we scope our classes
// manually instead of using the [scoped] attribute of the Vue component <style>
// tag.
//
// If you want to implement this layout, provide the following HTML structure in
// your Vue template inside the page:
//
// main.basic-page
//   .card--content[ref="column1"]
//   .card--sidebar[ref="column2"]
//
.basic-page.is--multicolumn {
  @media (min-width: 800px) {
    //
    // IE11 layout
    //
    .card {
      [dir="ltr"] & {
        float: left;
      }
      [dir="rtl"] & {
        float: right;
      }
    }

    .card--content {
      width: 40%;

      [dir="ltr"] & {
        margin-right: 1rem;
      }
      [dir="rtl"] & {
        margin-left: 1rem;
      }
    }
    .card--sidebar {
      width: calc(60% - 1rem);
    }

    //
    // CSS Grid layout
    //
    @supports (display: grid) {
      & {
        display: grid;
        grid-template-areas: "content sidebar";
        grid-template-columns: 2fr 3fr;
        grid-gap: 1rem;
      }

      .card {
        width: 100%;
        margin: 0;
      }

      .card--content {
        grid-area: content;
      }
      .card--sidebar {
        grid-area: sidebar;
      }
    }
  }
}

.basic-page {
  // Unfortunately, duping this style was easier than figuring out how to use
  // @extend between files on the day I added the secondary column. Sorry.
  h2,
  .card__title {
    display: block;
    margin-bottom: 1rem;
    color: #444;
    font-family: $roboto-condensed;
    font-weight: 700;
    font-size: 17px;
    text-transform: uppercase;
  }

  // Apply language-specific fonts to the top-level Heading but avoid card titles
  // as they currently are expected to contain English country names.
  > h2 {
    [lang="ar"] & {
      font-family: $kufi-bold;
      line-height: 1;
    }
    [lang="my"] & {
      font-family: $myanmar-condensed;
    }
  }
}
</style>
