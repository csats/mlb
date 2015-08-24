
import bigText from './bigtext';

export default {
  greet: function() {
    console.log(bigText);
  },

  /**
   * Someday this will be fancier.
   */
  log: function(...args) {
    console.log(...args);
  },
};
