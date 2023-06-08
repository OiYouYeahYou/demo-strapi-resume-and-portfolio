import { z } from 'zod'

import {
	schemaAboutResponse,
	schemaAboutAttributes,
	schemaTag,
	schemaItem,
	schemaMedia,
} from './validation'

/*
The real magic of Zod here over other validation tools.
All we need is `z.infer<typeof schema>` to get the types we
can use in the rest of the application. Such a time saver,
as well ensuring 1-to-1 coupling with the validation.
*/

export type AboutResponse = z.infer<typeof schemaAboutResponse>
export type AboutAttributes = z.infer<typeof schemaAboutAttributes>
export type Tag = z.infer<typeof schemaTag>
export type Media = z.infer<typeof schemaMedia>
export type Item = z.infer<typeof schemaItem>
