var videojs, setup, Component, lib;

videojs = require('./core.js');
setup = require('./setup.js');
Component = require('./component.js');
lib = require('./lib.js');

if (typeof HTMLVideoElement === 'undefined') {
  videojs.elementShiv();
}

// Run Auto-load players
// You have to wait at least once in case this script is loaded after your video in the DOM (weird behavior only with minified version)
setup.autoSetupTimeout(1);

module.exports = videojs;

module.exports.getComponent = Component.getComponent;
module.exports.registerComponent = Component.registerComponent;

// Expose but deprecate the window[componentName] method for accessing components
lib.obj.each(Component.components, function(name, component){
  // A deprecation warning as the constuctor
  module.exports[name] = function(player, options, ready){
    lib.log.warn('Using videojs.'+name+' to access the '+name+' component has been deprecated. Please use videojs.getComponent("componentName")');

    return new component(player, options, ready);
  }

  // Allow the prototype and class methods to be accessible still this way
  // Though anything that attempts to override class methods will no longer work
  lib.obj.merge(module.exports[name], component);
});
