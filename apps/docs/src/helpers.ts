import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

// prettier-ignore
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Helpers that can be used in Pug
 */
export const helpers = {
	yearMonth(date: Date) {
		if (!(date instanceof Date)) {
			throw new TypeError('`yearMoth` helper expects a Date object')
		}

		return `${months[date.getMonth()]}-${date.getFullYear()}`
	},

	markdown(text: string) {
		if (typeof text !== 'string') {
			throw new TypeError('`markdown` helper expects a string')
		}

		return md.render(text)
	},
}
