/* eslint-disable @typescript-eslint/no-explicit-any -- test mocks */
import { apiClient, auth } from "./client";

describe("apiClient", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    auth.clearToken();
    // Default mock implementation
    global.fetch = jest.fn(() =>
      Promise.resolve(new Response(JSON.stringify({
        success: true,
        data: { id: 1, name: "Test" }
      })))
    );
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  test("GET request sends correct method and headers", async () => {
    const response = await apiClient.get("/users");

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, options] = (global.fetch as any).mock.calls[0];

    expect(url).toContain("/users");
    expect(options.method).toBe("GET");
    expect(options.headers["Content-Type"]).toBe("application/json");
    expect(response.success).toBe(true);
    expect((response.data as any).name).toBe("Test");
  });

  test("POST request sends correct body", async () => {
    const payload = { name: "New User" };
    await apiClient.post("/users", payload);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, options] = (global.fetch as any).mock.calls[0];

    expect(url).toContain("/users");
    expect(options.method).toBe("POST");
    expect(options.body).toBe(JSON.stringify(payload));
  });

  test("Auth token is included in headers when set", async () => {
    auth.setToken("mock-token");
    await apiClient.get("/protected");

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const options = (global.fetch as any).mock.calls[0][1];

    expect(options.headers["Authorization"]).toBe("Bearer mock-token");
  });

  test("Auth token is NOT included when not set", async () => {
    auth.clearToken();
    await apiClient.get("/public");

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const options = (global.fetch as any).mock.calls[0][1];

    expect(options.headers["Authorization"]).toBeUndefined();
  });

  test("Auth token is skipped when skipAuth is true", async () => {
    auth.setToken("mock-token");
    await apiClient.get("/public", { skipAuth: true });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const options = (global.fetch as any).mock.calls[0][1];

    expect(options.headers["Authorization"]).toBeUndefined();
  });

  test("ApiError is thrown on non-ok response", async () => {
    // Override fetch implementation for this test
    global.fetch = jest.fn(() => {
      return Promise.resolve(new Response(JSON.stringify({
        message: "Forbidden",
        code: "FORBIDDEN"
      }), {
        status: 403,
        statusText: "Forbidden"
      }));
    });

    try {
      await apiClient.get("/forbidden");
    } catch (error: any) {
      expect(error.message).toBe("Forbidden");
      expect(error.code).toBe("FORBIDDEN");
      expect(error.statusCode).toBe(403);
    }
  });

  test("Network error is propagated", async () => {
    // Override fetch implementation for this test
    global.fetch = jest.fn(() => Promise.reject(new Error("Network Error")));

    let caughtError: any;
    try {
      await apiClient.get("/fail");
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError).toBeDefined();
    expect(caughtError.message).toBe("Network Error");
  });
});
