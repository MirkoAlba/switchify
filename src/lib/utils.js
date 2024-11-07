const spotifyScopes = [
  "user-library-modify",
  "user-library-read",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-private",
  "playlist-modify-public",
];

export const spotifyAuthURL = `${
  process.env.NEXT_PUBLIC_SPOTIFY_AUTH_ENDPOINT
}?client_id=${
  process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
}&redirect_uri=${
  process.env.NEXT_PUBLIC_REDIRECT_URI
}&response_type=token&scope=${spotifyScopes.join(",")}`;

const youtubeScopes = [
  // "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/youtube",
  "https://www.googleapis.com/auth/youtube.force-ssl",
];

export const youtubeAuthURL = `${
  process.env.NEXT_PUBLIC_YOUTUBE_AUTH_ENDPOINT
}?client_id=${
  process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID
}&redirect_uri=${
  process.env.NEXT_PUBLIC_REDIRECT_URI
}&response_type=token&scope=${youtubeScopes.join(" ")}`;

export function makeResponse(response) {
  return new Response(JSON.stringify(response), {
    status: response.status,
  });
}

export const platforms = ["spotify", "youtube-music"];
