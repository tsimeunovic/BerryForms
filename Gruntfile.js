// Generated on 2014-07-09 using generator-angular 0.4.0
// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    // configurable paths
    var yeomanConfig = {
        app: 'client',
        server: 'server',
        test: 'test',

        distroot: 'dist',
        dist: 'dist/client',
        distserver: 'dist/server'
    };

    try {
        yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
    } catch (e) {
    }

    grunt.initConfig({
        yeoman: yeomanConfig,
        autoprefixer: {
            options: ['last 1 version'],
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/styles/',
                        src: '{,*/}*.css',
                        dest: '.tmp/styles/'
                    }
                ]
            }
        },
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= yeoman.distroot %>/*',
                            '!<%= yeoman.distroot %>/.git*'
                        ]
                    }
                ]
            },
            tmp: '.tmp'
        },
        tslint: {
            options: {
                configuration: grunt.file.readJSON("tslint.json")
            },
            all: [
                'BerryForms.ts',
                'client/{,**/}*.ts',
                'server/{,**/}*.ts',
                'test/{,**/}*.ts'
            ],
            client: [
                'client/{,**/}*.ts'
            ],
            test: [
                'test/{,**/}*.ts'
            ],
            server: [
                'server/{,**/}*.ts'
            ]
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                        '<%= yeoman.dist %>/styles/fonts/*'
                    ]
                }
            }
        },
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '{,*/}*.{png,jpg,jpeg}',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },
        svgmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '{,*/}*.svg',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },
        cssmin: {},
        htmlmin: {
            dist: {
                options: {},
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>',
                        src: ['*.html', 'views/*.html'],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [
                    //Client
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '*.{ico,png,txt}',
                            '.htaccess',
                            'images/{,*/}*.{gif,webp}',
                            'fonts/{,*/}*',
                            'angular/localization/*/*.js'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: '<%= yeoman.dist %>/images',
                        src: [
                            'generated/*'
                        ]
                    },
                    //Server
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.server %>',
                        dest: '<%= yeoman.distserver %>',
                        src: [
                            '*/{,*/}*.js',

                            //Exclude interfaces
                            '!*/{,*/}I*.js',
                            '*/{,*/}Identifier*.js'
                        ]
                    },
                    //Root
                    {
                        expand: true,
                        dot: true,
                        cwd: '.',
                        dest: '<%= yeoman.distroot %>',
                        src: [
                            'package.json',
                            'BerryForms.js'
                        ]
                    }
                ]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },
        purifycss: {
            options: {},
            //In 'src' use original html files (purifycss does not find styles from $templatecache) and outputed built javascripts
            app: {
                src: ['<%= yeoman.app %>/index.html', '<%= yeoman.app %>/**/*.html', '<%= yeoman.dist %>/scripts/*.js'],
                css: ['<%= yeoman.dist %>/styles/app-min.css'],
                dest: '<%= yeoman.dist %>/styles/app-min.css'
            },
            external: {
                src: ['<%= yeoman.app %>/index.html', '<%= yeoman.app %>/**/*.html', '<%= yeoman.dist %>/scripts/*.js'],
                css: ['<%= yeoman.dist %>/styles/app-external-min.css'],
                dest: '<%= yeoman.dist %>/styles/app-external-min.css'
            }
        },
        concurrent: {
            dist: [
                'copy:styles',
                'imagemin',
                'svgmin',
                'htmlmin'
            ],
            purify: [
                'purifycss:app',
                'purifycss:external'
            ]
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            },
            unitTravis: {
                configFile: 'karma.conf.js',
                browsers: ['Firefox'],
                singleRun: true
            },
            e2e: {
                configFile: 'karma-e2e.conf.js',
                singleRun: true
            }
        },
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },
        ngmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>/scripts',
                        src: '*.js',
                        dest: '<%= yeoman.dist %>/scripts'
                    }
                ]
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/scripts/scripts.js': [
                        '<%= yeoman.dist %>/scripts/scripts.js'
                    ]
                }
            }
        },
        ngtemplates: {
            app: {
                cwd: '<%= yeoman.app %>',
                src: ['angular/**/*.html', 'template/**/*.html'],
                dest: '<%= yeoman.dist %>/scripts/app-templates.js',
                options: {
                    bootstrap: function (module, script) {
                        return 'var _global = this;' +
                            '_global.BootstrapScripts = _global.BootstrapScripts || [];' +
                            '_global.BootstrapScripts.push(function(angular){' +
                            'angular.module("BerryFormsApp").run(["$templateCache",function($templateCache){' + script + '}]);});';
                    },
                    htmlmin: {
                        collapseWhitespace: true,
                        collapseBooleanAttributes: true
                    }
                }
            }
        },
        less: {
            options: {
                paths: ['<%= yeoman.app %>/styles']
            },
            client: {
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '<%= yeoman.app %>/styles',
                src: '*.less',
                ext: '.css'
            }
        },
        typescript: {
            client: {
                src: ['<%= yeoman.app %>/**/*.ts', '!<%= yeoman.app %>/angular/localization/*/*.ts'],
                options: {
                    sourceMap: true,
                    module: 'commonjs'
                }
            },
            clientLocalization: {
                src: ['<%= yeoman.app %>/angular/localization/*/*.ts'],
                options: {
                    sourceMap: false,
                    module: 'commonjs'
                }
            },
            server: {
                src: ['<%= yeoman.server %>/**/*.ts', 'BerryForms.ts'],
                options: {
                    sourceMap: true,
                    module: 'commonjs'
                }
            },
            test: {
                src: ['<%= yeoman.test %>/**/*.ts'],
                options: {
                    sourceMap: true,
                    module: 'commonjs'
                }
            }
        },
        lesslint: {
            src: ['<%= yeoman.app %>/**/*.less']
        }
    });

    //Tasks
    //Lint
    grunt.registerTask('lint', [
        'tslint:all'
    ]);

    //Tests
    grunt.registerTask('unit-test', [
        'karma:unit'
    ]);

    grunt.registerTask('e2e-test', [
        'karma:e2e'
    ]);

    //Compile (less + typescript)
    grunt.registerTask('compile', [
        'less:client',
        'typescript:client',
        'typescript:clientLocalization',
        'typescript:server',
        'typescript:test'
    ]);

    //Build application (compile, bundle, minify)
    grunt.registerTask('build', [
        'compile', //Compile all typescript and less files
        'tslint:all', //Run typescript linter
        'clean:dist', //Clean 'dist' folder
        'useminPrepare', //Create references from html block
        'concurrent:dist', //Do concurrently: copy styles to .tmp, imagemin, svgmin, and htmlmin
        'autoprefixer', //Adds vendor-prefixes to css
        'concat',
        'copy:dist', //Copy remaining files to 'dist' folder (localization, server part, fonts, ...)
        'ngtemplates', //Convert angular templates from html files into app-templates.js
        'cdnify', //Modify static resource urls
        'ngmin', //Prepare angular components for minification
        'cssmin',
        'uglify', //Minify javascript files
        //'concurrent:purify', //Do concurrently: Purify app css and external css (remove unused selectors)
        'rev', //Add rev hash to files
        'usemin', //Replace references to static resources
        'clean:tmp' //Clean '.tmp' folder
    ]);

    //Travis build server task
    grunt.registerTask('travis', [
        'build',
        'karma:unitTravis'
    ]);
};
