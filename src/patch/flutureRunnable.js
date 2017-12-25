export default function flutureRunnable(Runnable) {
	if (Runnable._fluturesupport) { // eslint-disable-line no-underscore-dangle
		return;
	}

	const {run} = Runnable.prototype;

	Runnable.prototype.run = function runWithFuture(fn) { // eslint-disable-line no-param-reassign
		const oldFn = this.fn;
		const oldFnAsync = oldFn.length;

		if (!oldFnAsync) {
			try {
				if (this.isPending()) {
					// throw an error
				} else {
					const result = this.fn.call(this.ctx);
					if (result && typeof result.then === 'function') {
						this.resetTimeout();
						result.then(() => fn(), (reason) => fn(reason));
					} else if (result && typeof result.fork === 'function') {
						this.resetTimeout();
						result.fork(
							(reason) => fn(reason),
							() => fn()
						);
					} else {
						fn();
					}
				}
			} catch (err) {
				fn(err);
			}
		} else {
			run.call(this, fn);
		}
	};

	Runnable._fluturesupport = true; // eslint-disable-line no-underscore-dangle, no-param-reassign
}
