/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Mark van Seventer
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// @see http://sharp.dimens.io/en/stable/api-output/#tile

// Strict mode.
'use strict'

// Local modules.
const constants = require('../lib/constants')
const queue = require('../lib/queue')

// Configure.
const options = {
  container: {
    choices: constants.CONTAINER,
    desc: 'Tile container',
    defaultDescription: 'fs',
    nargs: 1
  },
  layout: {
    choices: constants.LAYOUT,
    desc: 'Filesystem layout',
    defaultDescription: 'dz',
    nargs: 1
  },
  overlap: {
    desc: 'Tile overlap in pixels',
    defaultDescription: 0,
    nargs: 1,
    type: 'number'
  },
  size: {
    desc: 'Tile size in pixels',
    defaultDescription: 256,
    nargs: 1,
    type: 'number'
  }
}

// Command builder.
const builder = (yargs) => {
  return yargs
    .strict()
    .example('$0 tile 512', 'output.dz is the Deep Zoom XML definition, output_files contains 512×512 tiles grouped by zoom level')
    .epilog('For more information on available options, please visit http://sharp.dimens.io/en/stable/api-output/#tile')
    .options(options)
}

// Command handler.
const handler = (args) => {
  return queue.push([ 'tile', (sharp) => {
    return sharp.tile({
      size: args.size,
      overlap: args.overlap,
      container: args.container,
      layout: args.layout
    })
  }])
}

// Exports.
module.exports = {
  command: 'tile [size]',
  describe: 'Use tile-based deep zoom (image pyramid) output',
  builder,
  handler
}
