const NodeEnvironment = require('jest-environment-node').default;

class CustomNodeEnvironment extends NodeEnvironment {
  constructor(config, context) {
    // Patch for Node v25+ SecurityError: Cannot initialize local storage
    // Do this BEFORE super() so when NodeEnvironment iterates globalThis, 
    // it sees our safe version.
    try {
      Object.defineProperty(globalThis, 'localStorage', { 
        get: () => undefined, 
        configurable: true 
      });
      Object.defineProperty(globalThis, 'sessionStorage', { 
        get: () => undefined, 
        configurable: true 
      });
    } catch (e) {}
    
    super(config, context);
  }
}

module.exports = CustomNodeEnvironment;
