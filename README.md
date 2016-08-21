# create-gitignore
A simple CLI to generate .gitignore

It fetches templates from the official github repo for .gitignores: https://github.com/github/gitignore

## Usage 

```sh
npm install -g create-gitignore
create-gitignore <template>
```

Fetches a list of available templates
```sh
create-gitignore list
```

Generate a .gitignore file from template. 

```sh
create-gitignore <template>
```
**Warning**: *Case Sensitive!*


## Developing

```sh
npm run dev
npm start
```

## Todo
* Remove case sensitiveness
