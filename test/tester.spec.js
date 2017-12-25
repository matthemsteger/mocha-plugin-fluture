import chai, {expect} from 'chai';
import {of as futureOf, Future} from 'fluture';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import tester from './../src/tester';

chai.use(sinonChai);

describe('mocoa-plugin-fluture/tester', function () {
	it('should export a function as default', function () {
		expect(tester).to.be.a('function');
	});

	describe('tester', function () {
		it('should allow to return a future for a mocha test', function (done) {
			const test = tester(function () {
				return futureOf(true);
			});

			test(done);
		});

		it('should fail with a rejected future', function (done) {
			const test = tester(function () {
				return Future(function (reject) {
					setTimeout(function () {
						return reject(new Error('You futured me'));
					}, 0);
				});
			});

			test(function (err) {
				expect(err).to.be.ok;
				expect(err).to.have.property('message', 'You futured me');

				return done();
			});
		});

		it('should fail and warn when a synchronous error is thrown', function (done) {
			const warnSpy = sinon.spy(console, 'warn');
			const test = tester(function () {
				throw new Error('synchronous error');
			});

			test(function (err) {
				expect(err).to.be.ok;
				expect(err).to.have.property('message', 'synchronous error');
				expect(warnSpy).to.have.been.called;

				return done();
			});
		});

		it('should run the demo function', tester(function () {
			const start = Date.now();
			return Future
				.after(100, start)
				.map(function (s) {
					expect(Date.now() - s).to.be.above(100);
					return s;
				});
		}));
	});
});
