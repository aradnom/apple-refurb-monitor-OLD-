# OH HI

This is a simple tool for monitoring product updates on Apple's Refurb site.

Specifically, it's looking for Retina iPad Minis at the moment.

## Installing Dependencies

	npm install

## Setup

This works by searching product titles for keyword.  Set search and email alert info in config
and run with forever - https://npmjs.org/package/forever

## Sample config

node_modules/config.js:

	/* Config info - should not be publicly accessible */

	// Request path - should be product page to search
	exports.path = 'http://store.apple.com/us/browse/home/specialdeals/ipad/ipad_mini/wi_fi';

	// Keyword to look for
	exports.search = 'retina';

	// Alert email parameters
	exports.mail = {
		from: 'from address',
		to: 'to address'
	};

	// How often to search
	exports.refresh_interval = 15; // Minutes

	// Controls various log outputs
	exports.debug = true;
