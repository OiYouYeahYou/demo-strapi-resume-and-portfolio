import axios, { RawAxiosRequestHeaders } from 'axios'
import qs from 'qs'

import { schemaAboutResponse } from './validation'
import { Tag, Item, AboutAttributes } from './types'

export type GenericItemKeys = 'education' | 'experience' | 'projects'

export interface SDKFetchOptions {
	itemKeys?: GenericItemKeys[]
	preProcess?(data: any): void
}

const defaultItemKeys: GenericItemKeys[] = [
	'education',
	'experience',
	'projects',
]

const fetchDefaults: SDKFetchOptions = {
	itemKeys: defaultItemKeys,
}

/**
 * About get query with instructions on populating the full interface
 */
const aboutGetQuery = {
	populate: {
		contact: '*',
		skill_group: { populate: '*' },
		education: { populate: '*' },
		experience: { populate: '*' },
		projects: { populate: '*' },
	},
}

/**
 * Acts as an interface between the REST API and the application
 */
export class SDK {
	constructor(
		private readonly baseUrl: string,
		private readonly token?: string
	) {}

	/**
	 * Helper to create full URLs for resources from the API server.
	 *
	 * @param part the path of the resource
	 * @param query optional query for use with QS
	 * @returns the full URL
	 */
	private createUrl(part: string, query?: any) {
		const url = new URL(part, this.baseUrl)
		if (query) {
			url.search = qs.stringify(query)
		}
		return url.toString()
	}

	/**
	 * Simple headers helper function
	 */
	private headers(customHeaders?: RawAxiosRequestHeaders) {
		const headers: RawAxiosRequestHeaders = {
			...customHeaders,
		}

		if (this.token) {
			headers.Authorization = `Bearer ${this.token}`
		}

		return headers
	}

	/**
	 * Get the About content from the Strapi server
	 */
	async aboutGet({
		itemKeys = defaultItemKeys,
		preProcess,
	}: SDKFetchOptions = fetchDefaults) {
		const url = this.createUrl('api/about', aboutGetQuery)
		const response = await axios.get(url, { headers: this.headers() })
		if (preProcess) {
			preProcess(response.data)
		}
		const about = schemaAboutResponse.parse(response.data).data.attributes

		// Doing some after the fact processing that Zod does not support
		// It is likely Strapi can do this, but this is the way I've done it
		// pre-Strapi
		const tags = this.createGlobablTagsArray(about, itemKeys)
		await this.genericiseMedia(about)

		return { ...about, tags }
	}

	/**
	 * Finds all the tags and smooshes them into a single array, and adds
	 * a reference to each item that references the tag
	 */
	private createGlobablTagsArray(
		about: AboutAttributes,
		itemKeys: GenericItemKeys[]
	) {
		const tagMap = new Map<string, Tag & { items: Item[] }>()

		for (const groups of about.skill_group) {
			for (const tag of groups.tags) {
				tagMap.set(tag.id, { ...tag, items: [] })
			}
		}

		for (const item of itemKeys.flatMap((key) => about[key])) {
			for (const tag of item.tags) {
				const _tag = tagMap.get(tag.id)
				if (_tag) {
					_tag.items.push(item)
				} else {
					tagMap.set(tag.id, { ...tag, items: [item] })
				}
			}
		}

		return [...tagMap.values()]
	}

	/**
	 * This makes sure that we can use media content outside of the Strapi domain
	 */
	private async genericiseMedia(about: AboutAttributes) {
		// Get all the generic items,
		// smoosh them together and
		// yoink their media arrays
		const mediaSmoosh = defaultItemKeys
			.flatMap((key) => about[key])
			.map(({ media }) => media)

		// Itterage through all of those media arrays
		for (const mediaArray of mediaSmoosh) {
			// Early continue to avoid super nesting
			if (!mediaArray || mediaArray.length === 0) {
				continue
			}

			for (const media of mediaArray) {
				// Another early continue to keep a happy line
				if (media.provider !== 'local') {
					continue
				}

				// This is my super sneaky way of not needing
				// to host my strapi server publically.
				// I don't recommend this for production at all,
				// instead you'd probably want to use a
				// provider like Cloudinary or AWS S3
				const url = this.createUrl(media.url)
				const imgRes = await axios.get(url, {
					responseType: 'arraybuffer',
				})
				const base64 = Buffer.from(imgRes.data, 'binary').toString(
					'base64url'
				)
				// data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUA
				media.url = `data:${media.mime};base64,${base64}`

				// In other situations, this would be much better if
				// you **have** to use the local media provider
				//media.url = this.url(media.url)
			}
		}
	}
}
