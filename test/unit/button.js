var Button = require('../../src/js/button.js');
var TestHelpers = require('./test-helpers.js');

q.module('Button');

test('should localize its text', function(){
  expect(1);

  var player, testButton, el;

  player = TestHelpers.makePlayer({
    'language': 'es',
    'languages': {
      'es': {
        'Play': 'Juego'
      }
    }
  });

  testButton = new Button(player);
  testButton.buttonText = 'Play';
  el = testButton.createEl();

  ok(el.innerHTML, 'Juego', 'translation was successful');
});
