import videojs, { elementShiv } from './core';
import * as setup from './setup';
import Component from './component';
import * as VjsLib from './lib';
import MediaLoader from './media/loader';

if (typeof HTMLVideoElement === 'undefined') {
  elementShiv();
}

// Run Auto-load players
// You have to wait at least once in case this script is loaded after your video in the DOM (weird behavior only with minified version)
setup.autoSetupTimeout(1, videojs);

export let getComponent = Component.getComponent;
export let registerComponent = Component.registerComponent;

// Expose but deprecate the window[componentName] method for accessing components
VjsLib.obj.each(Component.components, function(name, component){
  // A deprecation warning as the constuctor
  module.exports[name] = function(player, options, ready){
    VjsLib.log.warn('Using videojs.'+name+' to access the '+name+' component has been deprecated. Please use videojs.getComponent("componentName")');

    return new Component(player, options, ready);
  };

  // Allow the prototype and class methods to be accessible still this way
  // Though anything that attempts to override class methods will no longer work
  VjsLib.obj.merge(module.exports[name], component);
});

export default videojs;
export { getComponent, registerComponent };
