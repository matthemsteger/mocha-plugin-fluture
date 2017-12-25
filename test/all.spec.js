import {expect} from 'chai';
import {of as futureOf, Future} from 'fluture';
import flutureRunnable from './../src/patch/flutureRunnable';

delete require.cache[require.resolve('mocha/lib/runnable')];
const Runnable = require('mocha/lib/runnable');

flutureRunnable(Runnable); // apply plugin
flutureRunnable(Runnable); // test apply only once

describe('mocha-plugin-fluture/patch', function () {
	describe('synchronous', function () {
		it('should pass', function (done) {
			const test = new Runnable('synchronous', function () { });
			test.run(done);
		});

		it('should fail', function (done) {
			const test = new Runnable('synchronous', function () {
				throw new Error('You had one job');
			});

			test.run(function (err) {
				expect(err).to.be.ok;
				expect(err).to.have.property('message', 'You had one job');

				return done();
			});
		});

		it('should fail with custom error object', function (done) {
			const test = new Runnable('synchronous', function () {
				throw 'You had one job'; // eslint-disable-line no-throw-literal
			});

			test.run(function (err) {
				expect(err).to.be.ok;
				expect(err).to.equal('You had one job');

				return done();
			});
		});
	});

	describe('promise', function () {
		it('should pass', function (done) {
			const test = new Runnable('promise', function () {
				return Promise.resolve(true);
			});

			test.run(done);
		});

		it('should fail', function (done) {
			const test = new Runnable('promise', function () {
				return new Promise(function (resolve, reject) {
					return setTimeout(function () {
						return reject(new Error('You promised me'));
					}, 0);
				});
			});

			test.run(function (err) {
				expect(err).to.be.ok;
				expect(err).to.have.property('message', 'You promised me');

				return done();
			});
		});
	});

	describe('callback', function () {
		it('should pass', function (done) {
			const test = new Runnable('callback', function (d) {
				return setTimeout(d, 0);
			});

			test.run(done);
		});

		it('should fail', function (done) {
			const test = new Runnable('callback', function (d) {
				return setTimeout(function () {
					return d(new Error('You never called me back'));
				}, 0);
			});

			test.run(function (err) {
				expect(err).to.be.ok;
				expect(err).to.have.property('message', 'You never called me back');

				return done();
			});
		});
	});

	describe('fluture', function () {
		it('should pass', function (done) {
			const test = new Runnable('fluture', function () {
				return futureOf(true);
			});

			test.run(done);
		});

		it('should fail', function (done) {
			const test = new Runnable('fluture', function () {
				return Future(function (reject) {
					setTimeout(function () {
						return reject(new Error('You futured me'));
					}, 0);
				});
			});

			test.run(function (err) {
				expect(err).to.be.ok;
				expect(err).to.have.property('message', 'You futured me');

				return done();
			});
		});
	});
});
