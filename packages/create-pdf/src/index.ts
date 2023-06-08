import child from 'node:child_process'
import fs from 'node:fs'

/**
 * Simple wrapper for `wkhtmltopdf`
 * @param pathToConvert Path to read HTML from
 * @param outputFilePath Path to save PDF to
 */
export function createPdf(pathToConvert: string, outputFilePath: string) {
	const margin = '15mm'
	const params = {
		'--margin-top': margin,
		'--margin-bottom': margin,
		'--margin-left': margin,
		'--margin-right': margin,
	}
	const contents = fs.readFileSync(pathToConvert, 'utf-8')
	const args = [...Object.entries(params).flat(), '-', outputFilePath]

	const proc = child.spawnSync('wkhtmltopdf', args, { input: contents })

	if (proc.status !== 0) {
		console.log(proc)
		console.log(proc.stdout?.toString())
		console.error(proc.stderr?.toString())
		return process.exit(proc.status || 0)
	}
}
