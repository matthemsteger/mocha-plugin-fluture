
/**
 * Tester takes a function and allows you to return
 * a future from the function, converting it to mocha
 * async calls
 */
export default function tester(fn) {
	return function mochaFutureTester(done) {
		try {
			const future = fn();
			future.fork(
				(err) => done(err),
				() => done()
			);
		} catch (err) {
			console.warn('Caught a synchronous error while testing a future'); // eslint-disable-line no-console
			done(err);
		}
	};
}
