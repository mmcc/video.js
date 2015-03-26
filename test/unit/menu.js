var MenuButton = require('../../src/js/menu.js').MenuButton;
var TestHelpers = require('./test-helpers.js');

q.module('MenuButton');

test('should place title list item into ul', function() {
  var player, menuButton;

  player = TestHelpers.makePlayer();

  menuButton = new MenuButton(player, {
    'title': 'testTitle'
  });

  var menuContentElement = menuButton.el().getElementsByTagName('UL')[0];
  var titleElement = menuContentElement.children[0];

  ok(titleElement.innerHTML === 'TestTitle', 'title element placed in ul');

  player.dispose();
});