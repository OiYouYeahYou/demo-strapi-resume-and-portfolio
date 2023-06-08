import { existsSync, mkdirSync, writeFileSync } from 'node:fs'

import { SDK } from 'sdk'

/*
Really simple test to make sure the SDK is doing
what it's meant to be doing in isolation.
*/

const sdk = new SDK('http://localhost:1337/')

if (!existsSync('./output')) {
	mkdirSync('./output')
}

function write(path: string, data: any) {
	writeFileSync(path, JSON.stringify(data, null, '\t'))
}

function preProcess(data: any) {
	write('./output/raw.json', data)
}

// Put a little delay here because Strapi takes a bit to boot
setTimeout(() => {
	sdk.aboutGet({ preProcess })
		.then((data) => write('./output/processed.json', data))
		.catch((err) => console.log('oh no', err))
}, 5 * 1000)
