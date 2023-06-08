import React, {
	createContext,
	FC,
	ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react'

import { SDK } from 'sdk'
import { HookData, State } from './HookData'

const SDKContext = createContext<HookData>({} as HookData)

interface SDKProviderProps {
	baseUrl: string
	token?: string

	children?: ReactNode
}

export const SDKProvider: FC<SDKProviderProps> = ({
	baseUrl,
	token,

	children,
}) => {
	// We only need to instantiate the SDK once
	const sdk = useMemo(() => {
		return new SDK(baseUrl, token)
	}, [baseUrl, token])

	// These will store the various states of out application
	const [data, setData] = useState<{} | undefined>()
	const [error, setError] = useState<Error | undefined>()
	const [state, setState] = useState(State.pending)

	// In a larger application with multiple endpoints we'd have more methods,
	// but for now it's one endpoint, so we only have one method :D
	const fetch = useCallback(() => {
		if (state !== State.pending && state !== State.errored) {
			return
		}

		setData(undefined)
		setError(undefined)
		setState(State.fetching)

		sdk.aboutGet()
			.then((data) => {
				setData(data)
				setError(undefined)
				setState(State.fetched)
			})
			.catch((err) => {
				setData(undefined)
				setError(err)
				setState(State.errored)
			})
	}, [sdk])

	// This is a bit of naughty TypeScript. I'm casting the object as such
	// because I know the variables will only be as I've written.
	// There are better ways to couple something like this,
	// but for brevity I'm doing it this way.
	const hook = { data, error, state, fetch } as HookData

	return <SDKContext.Provider value={hook} children={children} />
}

export function useSDK(): HookData {
	return useContext(SDKContext)
}
