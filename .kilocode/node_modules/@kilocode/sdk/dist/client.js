export * from "./gen/types.gen.js";
import { createClient } from "./gen/client/client.gen.js";
import { KiloClient } from "./gen/sdk.gen.js";
export { KiloClient };
export function createKiloClient(config) {
    if (!config?.fetch) {
        const customFetch = (req) => {
            // @ts-ignore
            req.timeout = false;
            return fetch(req);
        };
        config = {
            ...config,
            fetch: customFetch,
        };
    }
    if (config?.directory) {
        config.headers = {
            ...config.headers,
            "x-kilo-directory": encodeURIComponent(config.directory),
        };
    }
    const client = createClient(config);
    return new KiloClient({ client });
}
