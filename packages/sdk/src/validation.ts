import { z } from 'zod'

/*
There's a lot to see here, but it all breaks down to a few things.

 - Splatting: because Strapi has a lot of object nesting, it can
              be good to flatten everything out.
 - Unwrapping: sometimes the opbject only contains a single value
               we want, so we just yoink it.

Otherwise, it's just a lot of validation assertion on what the expected
interface will be. So if Strapi changes it's ouptut for some reason
we can very quickly see that something is different. Instead of needing
to spot it on the consumer
*/

export const schemaTag = z
	.object({
		// Create a more unique ID
		id: z.number().transform((id) => `tag-${id}`),
		attributes: z.object({
			name: z.string(),
			about: z.string().nullable(),
			competence: z
				.enum([
					'Expert',
					'Proficient',
					'Advanced',
					'Competent',
					'Beginner ',
				])
				.nullable(),
		}),
	})
	// Splatting attributes into the parent for a nicer object
	.transform(({ id, attributes }) => ({ id, ...attributes }))

export const schemaTags = z
	.object({
		data: schemaTag.array(),
	})
	// Unwrapping the data object from its parent
	.transform(({ data }) => data)

export const schemaMedia = z
	.object({
		id: z.number(),
		attributes: z.object({
			name: z.string(),
			alternativeText: z.string().nullable(),
			caption: z.string().nullable(),
			width: z.null(),
			height: z.null(),
			formats: z.null(),
			hash: z.string(),
			mime: z.string(),
			url: z.string(),
			previewUrl: z.null(),
			provider: z.literal('local'),
			provider_metadata: z.null(),
		}),
	})
	// Another splat
	.transform(({ id, attributes }) => ({ id, ...attributes }))
const schemaMediaWrapper = z
	.object({
		data: schemaMedia.array().nullable(),
	})
	// Another unwrap
	.transform(({ data }) => data)

export const schemaItem = z.object({
	// Create a more unique ID
	id: z.number().transform((id) => `item-${id}`),
	sub_title: z.string().nullable(),
	title: z.string(),
	// Here Zod will try to turn the value into a date
	start: z.coerce.date(),
	end: z.coerce.date().nullable(),
	tags: schemaTags,
	about: z.string().nullable(),
	media: schemaMediaWrapper,
})

const schemaContactEmail = z.object({
	__component: z.literal('contact.email'),
	name: z.string(),
	email: z.string(),
})
const schemaContactPhone = z.object({
	__component: z.literal('contact.phone'),
	name: z.string(),
	number: z.string(),
})
const schemaContactWebsite = z.object({
	__component: z.literal('contact.website'),
	name: z.string(),
	website_full: z.string(),
	website_readable: z.string(),
})

const schemaSkillGroup = z.object({
	name: z.string(),
	tags: schemaTags,
})

export const schemaAboutAttributes = z.object({
	name: z.string(),
	role: z.string(),
	resume_about: z.string(),
	contact: z.array(
		schemaContactEmail
			.or(schemaContactPhone)
			.or(schemaContactWebsite)
			// Rename `__component` to `component`, because while it's
			// double underscore that usually represents private,
			// we can use it as a public method later
			.transform(({ __component, ...rest }) => ({
				component: __component,
				...rest,
			}))
	),
	skill_group: z.array(schemaSkillGroup),
	education: z.array(schemaItem),
	experience: z.array(schemaItem),
	projects: z.array(schemaItem),
})
const schemaData = z.object({
	attributes: schemaAboutAttributes,
})
const schemaMeta = z.object({})

export const schemaAboutResponse = z.object({
	data: schemaData,
	meta: schemaMeta,
})
