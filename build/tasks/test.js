module.exports = function(grunt) {
  // The test task will run `karma:saucelabs` when running in travis,
  // when running via a PR from a fork, it'll run qunit tests in phantom using
  // karma otherwise, it'll run the tests in chrome via karma
  // You can specify which browsers to build with by using grunt-style arguments
  // or separating them with a comma:
  //   grunt test:chrome:firefox  # grunt-style
  //   grunt test:chrome,firefox  # comma-separated
  grunt.registerTask('test', function() {
    var tasks = this.args,
    tasksMinified,
    tasksMinifiedApi;

    // I believe this was done originally because of security implications around running
    // Saucelabs automatically on PRs.
    if (process.env.TRAVIS && process.env.TRAVIS_PULL_REQUEST !== 'false') {
      grunt.task.run(['karma:firefox', 'coveralls']);
    } else if (process.env.TRAVIS) {
      grunt.task.run(['karma:firefox', 'coveralls']);
      //Disabling saucelabs until we figure out how to make it run reliably.
      //grunt.task.run([
      //'karma:chrome_sl',
      //'karma:firefox_sl',
      //'karma:safari_sl',
      //'karma:ipad_sl',
      //'karma:android_sl',
      //'karma:ie_sl'
      //]);
    } else {
      // if we aren't running this in a CI, but running it manually, we can
      // supply arguments to this task. These arguments are either colon (`:`)
      // separated which is the default grunt separator for arguments, or they
      // are comma (`,`) separated to make it easier.
      // The arguments are the names of which browsers you want.
      if (tasks.length === 0) {
        tasks.push('chrome');
      }
      if (tasks.length === 1) {
        tasks = tasks[0].split(',');
      }

      tasks = tasks.map(function(task) {
        return 'karma:' + task;
      });

      grunt.task.run(tasks);
    }
  });
};
