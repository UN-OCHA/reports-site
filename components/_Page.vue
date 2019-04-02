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
