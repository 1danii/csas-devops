import type { paths } from "@/../schema";
import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";

// todo: put in env
const username = "dopo";
const password = "DevOps2024";

const fetchClient = createFetchClient<paths>({
  baseUrl: "https://hackaton-api.fly.dev/api/v1",
  headers: {
    Authorization: `Basic ${btoa(username + ":" + password)}`,
  },
});

export const api = createClient(fetchClient);
