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
        const isNonASCII = /[^\x00-\x7F]/.test(config.directory);
        const encodedDirectory = isNonASCII ? encodeURIComponent(config.directory) : config.directory;
        config.headers = {
            ...config.headers,
            "x-kilo-directory": encodedDirectory,
        };
    }
    if (config?.experimental_workspaceID) {
        config.headers = {
            ...config.headers,
            "x-kilo-workspace": config.experimental_workspaceID,
        };
    }
    const client = createClient(config);
    return new KiloClient({ client });
}
