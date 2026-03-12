// Polyfill for fetch and related globals needed by Next.js
const { FetchAPI } = require('whatwg-fetch');

global.fetch = FetchAPI.fetch;
global.Request = FetchAPI.Request;
global.Response = FetchAPI.Response;
global.Headers = FetchAPI.Headers;
