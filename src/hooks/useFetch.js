import { ServerPath } from "../config";

export default function useFetch() {
  /**
   *
   * @param {string} path
   * @param {{query?: {[k: string]: any},method: "GET" | "DELETE" | "POST" | "PUT", body: any}} options
   */
  async function request(path, options) {
    try {
      const res = await fetch(
        ServerPath + path + "?" + new URLSearchParams(options?.query || {}),
        {
          method: options?.method || "GET",
          body: options?.body || null,
        }
      );
      const json = await res.json();
      return json;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  return {
    request,
  };
}
