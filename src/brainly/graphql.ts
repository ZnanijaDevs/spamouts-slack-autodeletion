import fetch from "cross-fetch";

const BRAINLY_GRAPHQL_ENDPOINT = "https://graphql.z-dn.net/ru";

export type BrainlyGraphQLResponse<R> = {
  data: R;
  errors: Array<object>;
}

/** Send a request to the Brainly GraphQL API */
export default async function gql<R>(
  query: string,
  variables?: Record<string, unknown>
): Promise<R> {
  const response = await fetch(BRAINLY_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Service-Name": "ZnanijaDevs/spamouts-slack-autodeletion",
      "X-B-Token-Long": process.env.BRAINLY_AUTH_TOKEN
    },
    body: JSON.stringify({
      query,
      variables
    })
  });

  const data: BrainlyGraphQLResponse<R> = await response.json();
  if ("errors" in data) {
    throw Error(`Request to the Brainly GraphQL API failed: ${JSON.stringify(data)}`);
  }

  return data.data;
}