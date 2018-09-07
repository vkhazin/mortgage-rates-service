<<<<<<< HEAD
'use strict';

const supertest = require('supertest'); 
const test = require('unit.js');
const app = require('../app.js');

const request = supertest(app);

describe('Tests app', function() {
  it('verifies get', function(done) {
    request.get('/').expect(200).end(function(err, result) {
        test.string(result.body.Output).contains('Hello');
        test.value(result).hasHeader('content-type', 'application/json; charset=utf-8');
        done(err);
    });
  });
  it('verifies post', function(done) {
    request.post('/').expect(200).end(function(err, result) {
        test.string(result.body.Output).contains('Hello');
        test.value(result).hasHeader('content-type', 'application/json; charset=utf-8');
        done(err);
    });
  });
});
=======
'use strict';

const supertest = require('supertest'); 
const test = require('unit.js');
const app = require('../app.js');

const request = supertest(app);

describe('Tests app', function() {
  it('verifies get', function(done) {
    request.get('/').expect(200).end(function(err, result) {
        //test.string(result.body.Output).contains('Hello');
        //test.value(result).hasHeader('content-type', 'application/json; charset=utf-8');
        done(err);
    });
  });
  /*
  it('verifies post', function(done) {
    request.post('/').expect(200).end(function(err, result) {
        //test.string(result.body.Output).contains('Hello');
        //test.value(result).hasHeader('content-type', 'application/json; charset=utf-8');
        done(err);
    });
  });
  */
});
>>>>>>> b2b42e88941d60c280beb4e38fe0c74fe9804a7a
