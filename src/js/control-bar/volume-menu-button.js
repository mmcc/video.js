import Button from '../button';
import Component from '../component';
import Menu, { MenuButton } from '../menu';
import MuteToggle from '../mute-toggle';
import VjsLib from '../lib';
import { VolumeBar } from './volume-control';

/**
 * Menu button with a popup for showing the volume slider.
 * @constructor
 */
var VolumeMenuButton = MenuButton.extend({
  /** @constructor */
  init: function(player, options){
    MenuButton.call(this, player, options);

    // Same listeners as MuteToggle
    this.on(player, 'volumechange', this.volumeUpdate);

    // hide mute toggle if the current tech doesn't support volume control
    if (player.tech && player.tech['featuresVolumeControl'] === false) {
      this.addClass('vjs-hidden');
    }
    this.on(player, 'loadstart', function(){
      if (player.tech['featuresVolumeControl'] === false) {
        this.addClass('vjs-hidden');
      } else {
        this.removeClass('vjs-hidden');
      }
    });
    this.addClass('vjs-menu-button');
  }
});

Component.registerComponent('VolumeMenuButton', VolumeMenuButton);

VolumeMenuButton.prototype.createMenu = function(){
  var menu = new Menu(this.player_, {
    contentElType: 'div'
  });
  var vc = new VolumeBar(this.player_, this.options_['volumeBar']);
  vc.on('focus', function() {
    menu.lockShowing();
  });
  vc.on('blur', function() {
    menu.unlockShowing();
  });
  menu.addChild(vc);
  return menu;
};

VolumeMenuButton.prototype.onClick = function(){
  MuteToggle.prototype.onClick.call(this);
  MenuButton.prototype.onClick.call(this);
};

VolumeMenuButton.prototype.createEl = function(){
  return Button.prototype.createEl.call(this, 'div', {
    className: 'vjs-volume-menu-button vjs-menu-button vjs-control',
    innerHTML: '<div><span class="vjs-control-text">' + this.localize('Mute') + '</span></div>'
  });
};

VolumeMenuButton.prototype.volumeUpdate = MuteToggle.prototype.update;

export default VolumeMenuButton;
