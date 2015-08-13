
import bigText from './bigText';

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
