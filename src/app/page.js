import { cookies } from "next/headers";

import LoginForm from "@/components/base/login-form";

export default async function Home() {
  const cookieStore = await cookies();

  const spotifyAccessTokenData = cookieStore.get(
    "spotify_access_token_data"
  );

  const youtubeMusicAccessTokenData = cookieStore.get(
    "youtube-music_access_token_data"
  );

  const spotifyData = spotifyAccessTokenData
    ? JSON.parse(spotifyAccessTokenData?.value)
    : null;

  const youtubeMusicData = youtubeMusicAccessTokenData
    ? JSON.parse(youtubeMusicAccessTokenData?.value)
    : null;

  const isLoggedInSpotify = spotifyData?.accessToken
    ? true
    : false;
  const isLoggedInYouTubeMusic =
    youtubeMusicData?.accessToken ? true : false;

  return (
    <div className="flex justify-center items-center flex-col h-screen">
      <LoginForm
        isLoggedInSpotify={isLoggedInSpotify}
        isLoggedInYouTubeMusic={isLoggedInYouTubeMusic}
      />
    </div>
  );
}
