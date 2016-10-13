#!/usr/bin/env node
/*
 * fsbridge
 * Copyright (c) 2016 TechnologyAdvice, LLC
 */

'use strict'

const FSEventBridgeClient = require('fs-eventbridge-js')
const path = require('path')
const pkg = require('../package.json')
const url = require('url')
const yargs = require('yargs')

const getDockerHost = () => {
  if (!process.env.DOCKER_HOST) return 'localhost'
  const parsed = url.parse(process.env.DOCKER_HOST)
  return parsed.hostname
}

const argv = yargs
  .usage('Usage: $0 [options] <watch_path>')
  .demand(1)
  .env('FS_EVENTBRIDGE')
  .option('h', {
    alias: 'host',
    describe: 'The hostname or IP address of the FS-EventBridge server. If not specified, the FS_EVENTBRIDGE_HOST ' +
      'environment variable is used, followed by the IP of the active docker-machine container if that does not exist.',
    nargs: 1,
    type: 'string',
    default: getDockerHost()
  })
  .option('p', {
    alias: 'port',
    describe: 'The port of the FS-EventBridge server. If not specified, the FS_EVENTBRIDGE_PORT environment ' +
      'variable is used, followed by 65056 if that does not exist.',
    nargs: 1,
    type: 'number',
    default: 65056
  })
  .option('a', {
    alias: 'allow-hidden',
    describe: 'Allow hidden files, and files within hidden folders, to be monitored for changes.',
    nargs: 0,
    type: 'boolean'
  })
  .option('i', {
    alias: 'ignore-ms',
    describe: 'The number of milliseconds after a file is changed in which to ignore additional changes. This ' +
      'reduces the load of rapidly-changing files, and prevents an infinite loop in some filesharing use cases.',
    nargs: 1,
    type: 'number',
    default: 250
  })
  .option('s', {
    alias: 'silent',
    describe: 'Do not output responses from the FS-EventBridge server.',
    nargs: 0,
    type: 'boolean'
  })
  .version(pkg.version)
  .help('help')
  .strict()
  .argv

const bridge = new FSEventBridgeClient({
  host: argv.host,
  port: argv.port,
  watch: path.resolve(argv._[0]),
  ignoreHidden: !argv.allowHidden,
  ignoreMs: argv.ignoreMs,
  persistent: true
})

bridge.on('error_connection', err => {
  process.stderr.write(`Connection failed: ${err.message}\n`)
  bridge.stop()
  process.exit(101)
})

if (!argv.silent) {
  bridge.on('response', str => {
    process.stdout.write(`${str}\n`)
  })
}

process.on('SIGINT', () => {
  process.stdout.write('Caught SIGINT, stopping...\n')
  bridge.stop()
  process.exit(0)
})

bridge.start()

