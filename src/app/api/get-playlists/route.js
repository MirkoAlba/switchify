import { cookies } from "next/headers";

import { makeResponse, platforms } from "@/lib/utils";

export async function POST(request) {
  const { platform } = await request.json();

  const response = {
    status: 200,
    message: "Success",
    data: null,
  };

  const cookieStore = await cookies();

  const accessTokenData = cookieStore.get(
    `${platform}_access_token_data`
  );

  if (!accessTokenData) {
    response.status = 401;
    response.message = "Missing valid access token";

    return makeResponse(response);
  }

  const { accessToken } = JSON.parse(accessTokenData.value);

  if (!platform && !platforms.includes(platform)) {
    response.status = 400;
    response.message = "Missing or not valid platform";

    return makeResponse(response);
  }

  var playlists = null;

  switch (platform) {
    case "spotify":
      var playlistsResponse = await fetch(
        `${process.env.SPOTIFY_API_URL}/v1/me/playlists`,
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );

      playlists = await playlistsResponse.json();

      playlists = playlists.items;

      break;

    case "youtube-music":
      break;
  }

  response.data = playlists;

  return makeResponse(response);
}
