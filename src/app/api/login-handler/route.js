import { cookies } from "next/headers";

import { makeResponse } from "@/lib/utils";

const response = {
  status: 200,
  message: "Success",
};

let tokenData = {};

export async function POST(request) {
  const { token, platform } = await request.json();

  const cookieStore = await cookies();

  if (!token && !platform) {
    response.status = 400;
    response.message = "Missing token or platform";

    return makeResponse(response);
  }

  switch (platform) {
    case "spotify":
      var validateTokenResponse = await fetch(
        process.env.SPOTIFY_API_URL + "/v1/me",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      var validateTokenData =
        await validateTokenResponse.json();

      if (validateTokenData?.error?.status === 401) {
        response.status = 401;
        response.message = "Invalid spotify access token";

        return makeResponse(response);
      }

      tokenData = {
        accessToken: token,
        displayName: validateTokenData.display_name,
        id: validateTokenData.id,
        propic: validateTokenData.images[0].url,
      };

      cookieStore.set(
        "spotify_access_token_data",
        JSON.stringify(tokenData),
        {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: true,
          maxAge: 3600,
        }
      );

      break;

    case "youtube-music":
      var validateTokenResponse = await fetch(
        `${process.env.GOOGLE_API_URL}/oauth2/v3/tokeninfo?access_token=${token}`,
        {}
      );

      var validateTokenData =
        await validateTokenResponse.json();

      if (validateTokenData.error_description) {
        response.status = 401;
        response.message =
          validateTokenData.error_description;

        return makeResponse(response);
      }

      // todo: retrieve user info to display them

      // const userProfileInfoResponse = await fetch(
      //   `${process.env.GOOGLE_API_URL}/oauth2/v1/userinfo`,
      //   {
      //     Authorization: `Bearer ${token}`,
      //   }
      // );

      // const data = await userProfileInfoResponse.json();

      tokenData = {
        accessToken: token,
        displayName: null,
        id: null,
        propic: null,
      };

      cookieStore.set(
        "youtube-music_access_token_data",
        JSON.stringify(tokenData),
        {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: true,
          maxAge: 3600,
        }
      );

      break;
  }

  return makeResponse(response);
}
