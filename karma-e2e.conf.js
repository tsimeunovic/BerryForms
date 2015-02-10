// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function (config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['ng-scenario'],

        // list of files / patterns to load in the browser
        files: [
            'client/extensions/**/*.js', //Some useful functions are reused also in e2e tests
            'test/e2e/helpers/**/*.js',
            'test/e2e/page-objects/**/*.js',
            'test/e2e/scenarios/**/*.js',

            //Serve js.maps and source ts files
            {pattern: 'client/**/*.js.map', watched: false, included: false, served: true},
            {pattern: 'test/**/*.js.map', watched: false, included: false, served: true},
            {pattern: 'test/**/*.ts', watched: false, included: false, served: true}
        ],

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 8084,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['Chrome'],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        // Inactivity timeout
        browserNoActivityTimeout: 20000,

        // Uncomment the following lines if you are using grunt's server to run the tests
        proxies: {
           '/': 'http://localhost:8080/'
        },

        // URL root prevent conflicts with the site root
        urlRoot: '_karma_'
    });
};
