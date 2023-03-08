# todo-app

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Inspiration](#inspiration)

## General info
This project is a simple to-do app that lets you add, delete and check off tasks.
Additionally, there's:
* possibility of adding already checked off tasks
* filter functionality
* batch-delete functionality

## Technologies
Created with:
* JSON Server version: 0.17.2
* Typescript version: 4.6.4
* Sass version: 1.56.2

## Setup
This project was bootstrapped with [Vite](https://github.com/vitejs/vite).
You can learn more in the [Vite documentation](https://vitejs.dev/guide/).
To run this project, install it locally using npm:

```
$ cd ../todo-app
$ npm install
```
You need to install JSON Server to run this app:
* install json-server globally (run from any directory)
```
$ npm install -g json-server 
```
* install json-server locally (must be run from root directory)
```
$ npm install --save-dev json-server
```
First run the JSON Server then run the app:
```
$ cd ../todo-app
$ json-server --watch db/db.json --port 3001
$ npm start
```

## Inspiration
This app is inspired by Frontend Mentor's challenge:
[Todo app](https://www.frontendmentor.io/challenges/todo-app-Su1_KokOW).