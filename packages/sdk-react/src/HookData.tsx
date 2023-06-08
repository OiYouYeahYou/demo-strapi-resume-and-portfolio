export enum State {
	pending = 'waiting',
	fetching = 'fetching',
	fetched = 'fetched',
	errored = 'errored',
}

interface IHookData<
	state extends State,
	data extends {} | undefined,
	error extends Error | undefined
> {
	fetch(): void
	data: data
	error: error
	state: state
}

// Really quick and dirty way to create type gates
export type HookData =
	| IHookData<State.pending | State.fetching, undefined, undefined>
	| IHookData<State.fetched, {}, undefined>
	| IHookData<State.errored, undefined, Error>
