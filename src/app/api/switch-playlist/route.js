import { cookies } from "next/headers";

import { makeResponse, platforms } from "@/lib/utils";

export async function POST(request) {
  const { fromPlatform, toPlatform, playlistName, songs } =
    await request.json();

  const response = {
    status: 200,
    message: "Success",
    data: null,
  };

  const cookieStore = await cookies();

  const accessTokenData = cookieStore.get(
    `${toPlatform}_access_token_data`
  );

  if (!accessTokenData) {
    response.status = 401;
    response.message = "Missing valid access token";

    return makeResponse(response);
  }

  const { accessToken } = JSON.parse(accessTokenData.value);

  console.log(accessToken);

  return makeResponse(response);
}
