import { writeFileSync, mkdirSync, existsSync } from 'node:fs'

import pug from 'pug'
import sass from 'sass'

import { SDK } from 'sdk'
import { createPdf } from 'create-pdf'

import { helpers } from './helpers'

/*
Barebones bundler to create the final assets from Pug, SCSS and the REST API
*/

const sdk = new SDK('http://localhost:1337/')

// Ensure the output directory is present
if (!existsSync('./output')) {
	mkdirSync('./output')
}

sdk.aboutGet().then((data) => {
	const files = ['resume', 'portfolio']
	for (const file of files) {
		// Put all the paths in one place is, IMO, some good housekeeping
		// instead of littering the place with magic string
		const pathStyles = `./src/scss/${file}.scss`
		const pathPug = `./src/pug/${file}.pug`
		const pathHtml = `./output/${file}.html`
		const pathPdf = `./output/${file}.pdf`

		// Get the styles if they exist
		let styles: string | undefined
		if (existsSync(pathStyles)) {
			styles = sass.compile(pathStyles).css
		}

		// Make the output files
		const html = pug.renderFile(pathPug, {
			pretty: '\t',
			...helpers,
			...data,
			styles,
		})
		writeFileSync(pathHtml, html)
		// The magic sauce for the resume, currently it's doing everything
		// but we only need the reume
		createPdf(pathHtml, pathPdf)
	}
})
