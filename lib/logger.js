
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

  /**
   * Log something, then exit.
   */
  fatal: function(...args) {
    console.log(...args);
    throw new Error(args[0]);
  }
};
