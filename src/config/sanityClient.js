import { createClient } from "@sanity/client";
import { SANITY_SECRET_TOKEN } from "./envs";

export const client = createClient({
  projectId: "qjqyemfi",
  dataset: "staging",
  useCdn: false, // set to `false` to bypass the edge cache
  apiVersion: "2023-10-16",
  token: SANITY_SECRET_TOKEN,
});
