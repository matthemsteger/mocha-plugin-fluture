import flutureRunnable from './flutureRunnable';

try {
	const mochaPath = require.resolve('mocha');
	if (require.cache[mochaPath]) {
		flutureRunnable(require.cache[mochaPath].exports.Runnable);
	}
} catch (err) {
	// swallow error
}
