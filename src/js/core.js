/**
 * @fileoverview Main function src.
 */

import Player from './player';
import Plugins from './plugins';
import Options from './options';
import * as VjsLib from './lib';
import * as VjsUtil from './util';
import CoreObject from './core-object';

let document = global.document;

// HTML5 Shiv. Must be in <head> to support older browsers.
var elementShiv = function() {
  document.createElement('video');
  document.createElement('audio');
  document.createElement('track');
}

/**
 * Doubles as the main function for users to create a player instance and also
 * the main library object.
 *
 * **ALIASES** videojs, _V_ (deprecated)
 *
 * The `vjs` function can be used to initialize or retrieve a player.
 *
 *     var myPlayer = vjs('my_video_id');
 *
 * @param  {String|Element} id      Video element or video element ID
 * @param  {Object=} options        Optional options object for config/settings
 * @param  {Function=} ready        Optional ready callback
 * @return {vjs.Player}             A player instance
 * @namespace
 */
var vjs = function(id, options, ready){
  var tag; // Element of ID

  // Allow for element or ID to be passed in
  // String ID
  if (typeof id === 'string') {

    // Adjust for jQuery ID syntax
    if (id.indexOf('#') === 0) {
      id = id.slice(1);
    }

    // If a player instance has already been created for this ID return it.
    if (Player.players[id]) {

      // If options or ready funtion are passed, warn
      if (options) {
        VjsLib.log.warn ('Player "' + id + '" is already initialised. Options will not be applied.');
      }

      if (ready) {
        Player.players[id].ready(ready);
      }

      return Player.players[id];

    // Otherwise get element for ID
    } else {
      tag = VjsLib.el(id);
    }

  // ID is a media element
  } else {
    tag = id;
  }

  // Check for a useable element
  if (!tag || !tag.nodeName) { // re: nodeName, could be a box div also
    throw new TypeError('The element or ID supplied is not valid. (videojs)'); // Returns
  }

  // Element may have a player attr referring to an already created player instance.
  // If not, set up a new player and return the instance.
  return tag['player'] || new Player(tag, options, ready);
};

// Extended name, also available externally, window.videojs
// var videojs = window['videojs'] = vjs;

// CDN Version. Used to target right flash swf.
vjs.CDN_VERSION = 'GENERATED_CDN_VSN';
vjs.ACCESS_PROTOCOL = ('https:' == document.location.protocol ? 'https://' : 'http://');

/**
* Full player version
* @type {string}
*/
vjs['VERSION'] = 'GENERATED_FULL_VSN';

// Set CDN Version of swf
// The added (+) blocks the replace from changing this GENERATED_CDN_VSN string
if (vjs.CDN_VERSION !== 'GENERATED'+'_CDN_VSN') {
  Options['flash']['swf'] = vjs.ACCESS_PROTOCOL + 'vjs.zencdn.net/'+vjs.CDN_VERSION+'/video-js.swf';
}

/**
 * Utility function for adding languages to the default options. Useful for
 * amending multiple language support at runtime.
 *
 * Example: vjs.addLanguage('es', {'Hello':'Hola'});
 *
 * @param  {String} code The language code or dictionary property
 * @param  {Object} data The data values to be translated
 * @return {Object} The resulting global languages dictionary object
 */
vjs.addLanguage = function(code, data){
  if(Options['languages'][code] !== undefined) {
    Options['languages'][code] = VjsUtil.mergeOptions(Options['languages'][code], data);
  } else {
    Options['languages'][code] = data;
  }
  return Options['languages'];
};

/**
 * Custom Universal Module Definition (UMD)
 *
 * Video.js will never be a non-browser lib so we can simplify UMD a bunch and
 * still support requirejs and browserify. This also needs to be closure
 * compiler compatible, so string keys are used.
 */
if (typeof define === 'function' && define['amd']) {
  define('videojs', [], function(){ return vjs; });

// checking that module is an object too because of umdjs/umd#35
} else if (typeof exports === 'object' && typeof module === 'object') {
  module['exports'] = vjs;
}

let videojs = vjs;
export default videojs;
export { elementShiv };
