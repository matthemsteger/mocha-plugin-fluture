A [mocha](https://github.com/mochajs/mocha) plugin to enable futures (using [flutures](https://github.com/fluture-js/Fluture)) support.

There are two modes. The recommended mode is to use the helper function `tester** to wrap your mocha test funtions so that you can return a future.

The second mode is a monkey patch to mocha to allow you to return a future.

**This library is under development as I use it and test it out. The monkey patch is considered experimental.**

## Installation
* `npm install --save-dev mocha-plugin-fluture`

### Monkey Patch Mode
* just add `-r mocha-plugin-fluture/patch` in your mocha command line script
```
# example npm scripts
{
 "scripts" : {
    "mocha": "node node_modules/mocha/bin/_mocha -r mocha-plugin-fluture/patch",
    "coverage": "node node_modules/istanbul/lib/cli.js cover node_modules/mocha/bin/_mocha -- -r mocha-plugin-fluture/patch"
  }
}
```

## Usage

### Helper Function

```
import tester from 'mocha-plugin-fluture';

describe("sometest", function () {
	it("should do stuff", tester(function () {
		const start = Date.now();
		return Future
			.after(1000, start)
			.map(function (s) {
				expect(Date.now() - s).to.be.above(1000);
				return s;
			});
	}));
});
```

### Monkey Patch Mode

```
describe("sometest", function() {
  it("should do stuff", function () {
    var start = Date.now();
    return Future
		.after(1000, start)
		.map(function (s) {
			expect(Date.now() - s).to.be.above(1000);
			return s;
		});
  });

  it("does not change classical usage", function(done) {
    setTimeout(done, 2000);
    console.log("All good");
  });
});
```


## How the Monkey Patch Works

The module monkey patches the `Runnable.prototype.run` method of `mocha` to enable returning futures from fluture. In contrast to other npm packages, this is a plugin and extends `mocha` at runtime - allowing you to use any compatible mocha version.

## License

MIT


# Credits
* [131](https://github.com/131)
* [blakeembrey](https://github.com/blakeembrey) for [co-mocha](https://github.com/blakeembrey/co-mocha)


[![Build Status](https://travis-ci.org/matthemsteger/mocha-plugin-fluture.svg?branch=master)](https://travis-ci.org/matthemsteger/mocha-plugin-fluture)

