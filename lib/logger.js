
import bigText from './bigText';

// This is a singleton but I <3 the class syntax so here we are
export default new (class Logger {
  greet() {
    console.log(bigText);
  }

  /**
   * Someday this will be fancier.
   */
  log(...args) {
    console.log(...args);
  }
});
