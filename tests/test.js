'use strict';

const supertest = require('supertest');
const test = require('unit.js');
const app = require('../app.js');
const should = require('should');

Object.defineProperty(global, 'should', {
  value: should
});

const request = supertest(app);

describe('Tests app', () => {

  it('verifies GET /', (done) => {
    request.get('/').expect(200).end((err, result) => {
      test.value(result).hasHeader('content-type', 'application/json; charset=utf-8');
      let output = result.body;
      should(output).have.property('mortgages');
      should(output['mortgages']).be.Array;

      for (let mortgage of output['mortgages']) {
        should(mortgage).have.property('provider').and.should.not.be.empty;
        should(mortgage).have.property('rates');
        should(mortgage['rates']).be.Array;
        should(mortgage['rates']).have.a.lengthOf(4);

        for (let rate of mortgage['rates']) {

          should(rate).have.property('type');
          should(rate['type']).should.be.a.String;
          should(['3-years-fixed',
            '5-years-variable',
            '5-years-fixed',
            '10-years-fixed'
          ]).containEql(rate['type']);

          should(rate).have.property('rate');
          should(rate['rate']).be.a.Number;
        };
      }
      done(err);
    });
  }).timeout(5000);

  it('verifies GET /Canadian%20Lender', function (done) {
    request.get('/Canadian%20Lender').expect(200).end(function (err, result) {
      test.value(result).hasHeader('content-type', 'application/json; charset=utf-8');
      let output = result.body;
      should(output).have.property('mortgages');
      should(output['mortgages']).be.Array;
      should(output['mortgages']).have.a.lengthOf(1);

      for (let mortgage of output['mortgages']) {
        should(mortgage).have.property('provider').and.should.not.be.empty;
        should(mortgage).have.property('rates');
        should(mortgage['rates']).be.Array;
        should(mortgage['rates']).have.a.lengthOf(4);

        for (let rate of mortgage['rates']) {

          should(rate).have.property('type');
          should(rate['type']).be.a.String;
          should(['3-years-fixed',
            '5-years-variable',
            '5-years-fixed',
            '10-years-fixed'
          ]).containEql(rate['type']);

          should(rate).have.property('rate');
          should(rate['rate']).be.a.Number;
        };
      }
      done(err);
    });
  }).timeout(5000);

  it('verifies cache mechanism on GET /Canadian%20Lender', function (done) {
    request.get('/Canadian%20Lender').expect(200).end(function (err, result) {
      test.value(result).hasHeader('content-type', 'application/json; charset=utf-8');
      let output = result.body;
      should(output).have.property('mortgages');
      should(output['mortgages']).be.Array;
      should(output['mortgages']).have.a.lengthOf(1);

      for (let mortgage of output['mortgages']) {
        should(mortgage).have.property('provider').and.should.not.be.empty;
        should(mortgage).have.property('rates');
        should(mortgage['rates']).be.Array;
        should(mortgage['rates']).have.a.lengthOf(4);

        for (let rate of mortgage['rates']) {

          should(rate).have.property('type');
          should(rate['type']).be.a.String;
          should(['3-years-fixed',
            '5-years-variable',
            '5-years-fixed',
            '10-years-fixed'
          ]).containEql(rate['type']);

          should(rate).have.property('rate');
          should(rate['rate']).be.a.Number;
        };
      }
      done(err);
    });
  }).timeout(1000);

  it('verifies cache mechanism on GET /', function (done) {
    request.get('/').expect(200).end(function (err, result) {
      test.value(result).hasHeader('content-type', 'application/json; charset=utf-8');
      let output = result.body;
      should(output).have.property('mortgages');
      should(output['mortgages']).be.Array;
      should(output['mortgages'].lenght).be.aboveOrEqual(2);
      
      for (let mortgage of output['mortgages']) {
        should(mortgage).have.property('provider').and.should.not.be.empty;
        should(mortgage).have.property('rates');
        should(mortgage['rates']).be.Array;
        should(mortgage['rates']).have.a.lengthOf(4);

        for (let rate of mortgage['rates']) {

          should(rate).have.property('type');
          should(rate['type']).should.be.a.String;
          should(['3-years-fixed',
            '5-years-variable',
            '5-years-fixed',
            '10-years-fixed'
          ]).containEql(rate['type']);

          should(rate).have.property('rate');
          should(rate['rate']).be.a.Number;
        };
      }
      done(err);
    });
  }).timeout(1000);

});