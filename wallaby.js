module.exports = function (wallaby) {
  return {
    files: [
      'src/*.js',
      'test/lib/message/*.js',
      'spec/helpers/functions/*.js'
    ],

    tests: [
      'test/spec/*Spec.js'
    ],

    env: {
      type: 'node'
    },

    workers: {
      recycle: true
    },

    debug: true,

    testFramework: 'jasmine'
  };
};
