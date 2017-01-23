/* global describe, it, before, after, beforeEach, afterEach */
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

// Strict mode.
'use strict'

// Standard lib.
const path = require('path')

// Package modules.
const chai = require('chai')
const fs = require('fs-extra')
const tempfile = require('tempfile')

// Local modules.
const convert = require('../lib/convert')

// Configure.
const expect = chai.expect

// Test suite.
describe('convert', () => {
  // Default input.
  const input = path.join(__dirname, './fixtures/input.jpg')

  describe('files', () => {
    // Default output.
    let dest
    before(() => { dest = tempfile() })
    before((done) => fs.ensureDir(dest, done))
    afterEach((done) => fs.emptyDir(dest, done))
    after((done) => fs.remove(dest, done))

    // Tests.
    it('should fail when using the same file for input and output', () => {
      return convert
        .files([ input ], path.dirname(input))
        .then(() => { throw new Error('Trigger rejection') })
        .catch((err) => {
          expect(err).to.have.property('message')
          expect(err.message).to.contain('same file for input and output')
        })
    })
    it('should convert a file', () => {
      return convert
        .files([ input ], dest)
        .then(([ info ]) => expect(fs.existsSync(info.path)).to.be.true)
    })
    it('should convert multiple files', () => {
      return convert
        .files([ input, input ], dest)
        .then((info) => expect(info).to.have.length(2))
    })
  })
  describe('stream', () => {
    // Default output.
    let dest
    beforeEach(() => { dest = tempfile() })
    afterEach((done) => fs.remove(dest, done))

    // Tests.
    it('should convert a file', () => {
      return convert
        .stream(fs.createReadStream(input), fs.createWriteStream(dest))
        .then((info) => {
          expect(info).to.be.empty
          expect(fs.existsSync(dest)).to.be.true
        })
    })
  })
})
