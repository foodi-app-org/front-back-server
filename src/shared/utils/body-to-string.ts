
/**
 * Safely convert response.body (string | object | AsyncIterable | { string }) to a string.
 * Handles multipart/async iterable responses and falls back to toString().
 *
 * @param body - any value returned by Apollo's executeHTTPGraphQLRequest
 * @returns Promise<string> resolved textual representation
 */
export const bodyToString = async (body: any): Promise<string> => {
    if (body == null) return ''

    if (typeof body === 'string') return body

    if (typeof body === 'object' && typeof body.string === 'string') return body.string

    if (typeof (body as any)[Symbol.asyncIterator] === 'function') {
        let acc = ''
        // consume async iterable
        // eslint-disable-next-line no-restricted-syntax
        for await (const chunk of body as AsyncIterable<any>) {
            acc += typeof chunk === 'string' ? chunk : JSON.stringify(chunk)
        }
        return acc
    }

    try {
        return JSON.stringify(body)
    } catch {
        return String(body)
    }
}
