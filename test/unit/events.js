import * as Events from '../../src/js/events.js';
import document from 'global/document';

q.module('Events');

test('should add and remove an event listener to an element', function(){
  expect(1);

  var el = document.createElement('div');
  var listener = function(){
    ok(true, 'Click Triggered');
  };

  Events.on(el, 'click', listener);
  Events.trigger(el, 'click'); // 1 click
  Events.off(el, 'click', listener);
  Events.trigger(el, 'click'); // No click should happen.
});

test('should add and remove multiple event listeners to an element with a single call', function(){
  expect(6);

  var el = document.createElement('div');
  var listener = function(){
    ok(true, 'Callback triggered');
  };

  Events.on(el, ['click', 'event1', 'event2'], listener);

  Events.trigger(el, 'click');
  Events.trigger(el, 'click');
  Events.off(el, 'click', listener);
  Events.trigger(el, 'click'); // No click should happen.

  Events.trigger(el, 'event1');
  Events.trigger(el, 'event1');
  Events.off(el, 'event1', listener);
  Events.trigger(el, 'event1'); // No event1 should happen.

  Events.trigger(el, 'event2');
  Events.trigger(el, 'event2');
  Events.off(el, 'event2', listener);
  Events.trigger(el, 'event2'); // No event2 should happen.
});

test('should remove all listeners of a type', function(){
  var el = document.createElement('div');
  var clicks = 0;
  var listener = function(){
    clicks++;
  };
  var listener2 = function(){
    clicks++;
  };

  Events.on(el, 'click', listener);
  Events.on(el, 'click', listener2);
  Events.trigger(el, 'click'); // 2 clicks

  ok(clicks === 2, 'both click listeners fired');

  Events.off(el, 'click');
  Events.trigger(el, 'click'); // No click should happen.

  ok(clicks === 2, 'no click listeners fired');
});

test('should remove all listeners of an array of types', function(){
  var el = document.createElement('div');
  var calls = 0;
  var listener = function(){
    calls++;
  };
  var listener2 = function(){
    calls++;
  };

  Events.on(el, ['click', 'event1'], listener);
  Events.on(el, ['click', 'event1'], listener2);
  Events.trigger(el, 'click'); // 2 calls
  Events.trigger(el, 'event1'); // 2 calls

  ok(calls === 4, 'both click listeners fired');

  Events.off(el, ['click', 'event1']);
  Events.trigger(el, 'click'); // No click should happen.
  Events.trigger(el, 'event1'); // No event1 should happen.

  ok(calls === 4, 'no event listeners fired');
});

test('should remove all listeners from an element', function(){
  expect(2);

  var el = document.createElement('div');
  var listener = function(){
    ok(true, 'Fake1 Triggered');
  };
  var listener2 = function(){
    ok(true, 'Fake2 Triggered');
  };

  Events.on(el, 'fake1', listener);
  Events.on(el, 'fake2', listener2);

  Events.trigger(el, 'fake1');
  Events.trigger(el, 'fake2');

  Events.off(el);

  // No listener should happen.
  Events.trigger(el, 'fake1');
  Events.trigger(el, 'fake2');
});

test('should listen only once', function(){
  expect(1);

  var el = document.createElement('div');
  var listener = function(){
    ok(true, 'Click Triggered');
  };

  Events.one(el, 'click', listener);
  Events.trigger(el, 'click'); // 1 click
  Events.trigger(el, 'click'); // No click should happen.
});

test( 'should listen only once in multiple events from a single call', function(){
  expect(3);

  var el = document.createElement('div');
  var listener = function(){
    ok(true, 'Callback Triggered');
  };

  Events.one(el, ['click', 'event1', 'event2'], listener);
  Events.trigger(el, 'click'); // 1 click
  Events.trigger(el, 'click'); // No click should happen.
  Events.trigger(el, 'event1'); // event1 must be handled.
  Events.trigger(el, 'event1'); // No event1 should be handled.
  Events.trigger(el, 'event2'); // event2 must be handled.
  Events.trigger(el, 'event2'); // No event2 should be handled.
});

test('should stop immediate propagtion', function(){
  expect(1);

  var el = document.createElement('div');

  Events.on(el, 'test', function(e){
    ok(true, 'First listener fired');
    e.stopImmediatePropagation();
  });

  Events.on(el, 'test', function(e){
    ok(false, 'Second listener fired');
  });

  Events.trigger(el, 'test');
});

test('should bubble up DOM unless bubbles == false', function(){
  expect(3);

  var outer = document.createElement('div');
  var inner = outer.appendChild(document.createElement('div'));

  // Verify that if bubbles === true, event bubbles up dom.
  Events.on(inner, 'bubbles', function(e){
    ok(true, 'Inner listener fired');
  });
  Events.on(outer, 'bubbles', function(e){
    ok(true, 'Outer listener fired');
  });
  Events.trigger(inner, { type:'bubbles', target:inner, bubbles:true });

  // Only change 'bubbles' to false, and verify only inner handler is called.
  Events.on(inner, 'nobub', function(e){
    ok(true, 'Inner listener fired');
  });
  Events.on(outer, 'nobub', function(e){
    ok(false, 'Outer listener fired');
  });
  Events.trigger(inner, { type:'nobub', target:inner, bubbles:false });
});

test('should have a defaultPrevented property on an event that was prevent from doing default action', function() {
  expect(2);

  var el = document.createElement('div');

  Events.on(el, 'test', function(e){
    ok(true, 'First listener fired');
    e.preventDefault();
  });

  Events.on(el, 'test', function(e){
    ok(e.defaultPrevented, 'Should have `defaultPrevented` to signify preventDefault being called');
  });

  Events.trigger(el, 'test');
});
