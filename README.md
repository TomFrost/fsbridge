# fsbridge [![Build Status](https://travis-ci.org/TechnologyAdvice/fsbridge.svg?branch=master)](https://travis-ci.org/TechnologyAdvice/fsbridge)
A command-line client to stream file changes to an [FS-EventBridge](https://github.com/TechnologyAdvice/fs_eventbridge) server.

## Installation
fsbridge requires [Node.js](http://nodejs.org). Download it from the website or install from your favorite package manager. To install fsbridge:

```
npm install -g fsbridge
```

## Quick Start

For the common use case of streaming file change events to a Docker VM running via docker-machine, simply `cd` to the directory to be watched for changes and execute:

```
fsbridge .
```

Note that this assumes either the [FS-EventBridge](https://github.com/TechnologyAdvice/fs_eventbridge) installer has been run for the active VM, or the machine was pre-configured with [DevBox](https://github.com/TechnologyAdvice/DevBox).

Have an uncommon use case? Execute `fsbridge --help` for a full range of customizable options.

## License
fsbridge is distributed under the ISC license. See `LICENSE` file for details.

## Credits
fsbridge was created by Tom Shawver at [TechnologyAdvice](http://technologyadvice.com).

