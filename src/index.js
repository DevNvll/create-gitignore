#!/usr/bin/env node
import minimist from 'minimist'
import request from 'axios'
import fs from 'fs'
import inquirer from 'inquirer'
import chalk from 'chalk'


let args = minimist(process.argv.slice(2))

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function getGitignore(name, cb) {
  request(`https://raw.githubusercontent.com/github/gitignore/master/${capitalize(name)}.gitignore`).then((body) => {
    cb(null, body.data)
  }).catch((err) => {
    if(err.response.status === 404) {
      request(`https://raw.githubusercontent.com/github/gitignore/master/Global/${capitalize(name)}.gitignore`)
      .then((body) => {
        cb(null, body.data)
      })
      .catch((err) => {
        cb(404, null)
      })
    }
  })
}

function createFile(gitignore) {
  fs.stat('.gitignore', (err, file) => {
    if(!file) {
      fs.writeFile('.gitignore', gitignore, {encoding: 'utf-8'}, () => {
        console.log(chalk.green('\nFile created!'))
      })
    } else {
      inquirer.prompt([
        {
          type: 'confirm',
          message: 'Overwrite existing .gitignore file?',
          name: 'overwrite',
        }
      ]).then(function (answer) {
        if(answer.overwrite) {
          fs.writeFile('.gitignore', gitignore, {encoding: 'utf-8'}, () => {
            console.log(chalk.green('\nFile created!'))
          })
        }
        else {
          console.log('\nOk, bye!')
        }
      })
    }
  })

}

if(args._[0] && args._[0] !== 'list') {
  console.log(chalk.green('Trying to create .gitignore for'), chalk.green.bold(capitalize(args._[0])))
  getGitignore(args._[0], (err, file) => {
    if(err === 404) console.log(chalk.red('Template not found. Use: create-gitignore list'))
    else createFile(file)
  })
} else if(!args._[0]) {
  console.error('Usage:', 'create-gitignore <template>')
}

if(args._[0] == 'list') {
  console.log(chalk.cyan('Fetching template list.. \n'))
  let list = []
  request('https://api.github.com/repos/github/gitignore/contents/')
  .then((body) => {
    for(let file of body.data) {
      if(file.name.split('.')[0] !== 'README' && file.name.split('.')[0] !== 'CONTRIBUTING' && file.name.split('.')[0] !== 'LICENSE')
      list.push(file.name.split('.')[0])
    }
    request('https://api.github.com/repos/github/gitignore/contents/Global')
    .then((body) => {
      for(let file of body.data) {
        if(file.name.split('.')[0] !== 'README' && file.name.split('.')[0] !== 'CONTRIBUTING' && file.name.split('.')[0] !== 'LICENSE')
        list.push(file.name.split('.')[0])
      }
      console.log(chalk.cyan('Available templates:'), list.slice(1).join(', '))
    })

  })
}
