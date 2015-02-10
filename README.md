# <img alt="Raspberry logo" src="https://raw.githubusercontent.com/tsimeunovic/BerryForms/master/readme_pictures/md_logo_bw.png" width="14" height="18"/> Berry Forms

### Turn your Raspberry Pi into personal xRM server

## About

Berry Forms is lightweight personal xRM application written using [MEAN.IO](http://mean.io/#!/) and [Typescript](http://www.typescriptlang.org/). It aims to run on any device that can run MongoDB and Node.js (like Raspberry Pi). Client is a small responsive website (~ 170kb on first load) that uses simple rest api to retrieve and persist data.

## Features

First public GitHub release contains just few basic features to make Berry Forms usable for personal usage. Manual setup and/or basic troubleshooting skills are required. User can:

- Define schema for custom entities
    <p align="center"><img alt="Tablet schema" src="https://raw.githubusercontent.com/tsimeunovic/BerryForms/master/readme_pictures/md_tablet_schema.png"/></p>
    <p align="center"><img alt="Mobile fields" src="https://raw.githubusercontent.com/tsimeunovic/BerryForms/master/readme_pictures/md_mobile_fields.png"/></p>
- Create new records
    <p align="center"><img alt="Desktop list" src="https://raw.githubusercontent.com/tsimeunovic/BerryForms/master/readme_pictures/md_desktop_list.png"/></p>
- Filter records
    <p align="center"><img alt="Mobile filter" src="https://raw.githubusercontent.com/tsimeunovic/BerryForms/master/readme_pictures/md_mobile_filter.png"/></p>
- Write plugins that can react to certain application events

Other than that application has built-in support for different languages. It contains 7 types of fields (Boolean, Date, List, Select, Text, Textarea, Relationship) out of the box and can be easily extended to support more.

## Upcoming features

Features that i would like to add in near future:

- Login screen. Support for different users and roles
- Settings page
- Dashboard with charts, predefined and custom counters
- Additional field types
- And a lot more ...

## How to try it

- Make sure you have installed nodejs and mongodb
- Clone repository or otherwise download source codes
- Install dependencies by running 'npm install' and 'bower install'
- Run 'grunt compile' or navigate to dist folder
- Run 'node BerryForms.js'
- Navigate to 'http://localhost:8080/'

## How to contribute

Feel free to contribute by writing the code, sharing ideas or submitting bugs/issues.

