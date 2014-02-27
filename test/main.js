/*global describe, it*/
'use strict';

var fs = require('fs'),
should = require('should'),
path = require('path');
require('mocha');

var gutil = require('gulp-util'),
ejs = require('../');

describe('gulp-ejs', function () {

    var expectedFile = new gutil.File({
        path: 'test/expected/output.html',
        cwd: 'test/',
        base: 'test/expected',
        contents: fs.readFileSync('test/expected/output.html')
    });

    var expectedFileWithPartial = new gutil.File({
        path: 'test/expected/outputWithPartial.html',
        cwd: 'test/',
        base: 'test/expected',
        contents: fs.readFileSync('test/expected/outputWithPartial.html')
    });

    it('should produce correct html output when rendering a file', function (done) {

        var srcFile = new gutil.File({
            path: 'test/fixtures/ok.ejs',
            cwd: 'test/',
            base: 'test/fixtures',
            contents: fs.readFileSync('test/fixtures/ok.ejs')
        });

        var stream = ejs({ title: 'gulp-ejs' });

        stream.on('error', function (err) {
            should.exist(err);
            done(err);
        });

        stream.on('data', function (newFile) {

            should.exist(newFile);
            should.exist(newFile.contents);

            String(newFile.contents).should.equal(String(expectedFile.contents));
            done();
        });

        stream.write(srcFile);
        String(path.extname(srcFile.path)).should.equal('.html');

      stream.end();
    });

    it('should throw error when syntax is incorrect', function (done) {

        var srcFile = new gutil.File({
            path: 'test/fixtures/nok.ejs',
            cwd: 'test/',
            base: 'test/fixtures',
            contents: fs.readFileSync('test/fixtures/nok.ejs')
        });

        var stream = ejs({ title: 'gulp-ejs' });

        stream.on('error', function (err) {
            should.exist(err);
            done();
        });

        stream.write(srcFile);
        stream.end();
    });

  it('should produce correct html output with a specific file extension', function (done) {

    var srcFile = new gutil.File({
      path: 'test/fixtures/ok.ejs',
      cwd: 'test/',
      base: 'test/fixtures',
      contents: fs.readFileSync('test/fixtures/ok.ejs')
    });

    var stream = ejs({ title: 'gulp-ejs' }, {ext:'.txt'});

    stream.on('error', function (err) {
      should.exist(err);
      done(err);
    });

    stream.on('data', function (newFile) {

      should.exist(newFile);
      should.exist(newFile.contents);

      String(newFile.contents).should.equal(String(expectedFile.contents));
      done();
    });

    stream.write(srcFile);
    String(path.extname(srcFile.path)).should.equal('.txt');

    stream.end();
  });

  it('should produce correct html output using partial', function (done) {

    var srcFile = new gutil.File({
      path: 'test/fixtures/withpartial.ejs',
      cwd: 'test/',
      base: 'test/fixtures',
      contents: fs.readFileSync('test/fixtures/withpartial.ejs')
    });

    var stream = ejs({ title: 'gulp-ejs', msg: 'gulp-ejs', name: 'rpvl' });

    stream.on('data', function (newFile) {

      should.exist(newFile);
      should.exist(newFile.contents);

      String(newFile.contents).should.equal(String(expectedFileWithPartial.contents));
      done();
    });

    stream.write(srcFile);
    stream.end();
  });

});
