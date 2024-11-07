"use client";

import { useEffect, useState } from "react";

import {
  spotifyAuthURL,
  youtubeAuthURL,
} from "@/lib/utils";

export default function LoginForm({
  isLoggedInSpotify,
  isLoggedInYouTubeMusic,
}) {
  const [playlists, setPlaylists] = useState(null);

  console.log(playlists);

  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      const platform = getCurrentSelectedPlatform();

      fetch(
        process.env.NEXT_PUBLIC_BASE_API_URL +
          "/login-handler",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            platform,
          }),
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          const { status, message } = data;

          // todo: handle 401
          if (status === 200) {
            window.location.href = "/";
          } else {
            console.log(message);
          }
        });
    }
  }, []);

  return (
    <div className="">
      {!isLoggedInSpotify ? (
        <a
          onClick={() =>
            saveCurrentSelectedPlatform("spotify")
          }
          href={spotifyAuthURL}
        >
          Login to Spotify
        </a>
      ) : (
        <div className="mb-5">
          <div>Logged in Spotify</div>

          <div>
            <button
              onClick={async () => {
                const res = await fetch(
                  process.env.NEXT_PUBLIC_BASE_API_URL +
                    "/get-playlists",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      platform: "spotify",
                    }),
                  }
                );

                const { data } = await res.json();

                setPlaylists(data);
              }}
            >
              Retrieve your Spotify Playlists
            </button>
          </div>

          {playlists && (
            <div>
              {playlists.map((playlist) => (
                <div key={playlist.id}>
                  <button
                    onClick={async () => {
                      console.log(playlist);
                    }}
                  >
                    Transfer {playlist.name}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!isLoggedInYouTubeMusic ? (
        <a
          onClick={() =>
            saveCurrentSelectedPlatform("youtube-music")
          }
          href={youtubeAuthURL}
          className="block"
        >
          Login to YouTube Music
        </a>
      ) : (
        <div>
          <div>Logged in YouTube Music</div>
        </div>
      )}
    </div>
  );
}

function saveCurrentSelectedPlatform(platform) {
  localStorage.setItem("currentSelectedPlatform", platform);
}

function getCurrentSelectedPlatform() {
  return localStorage.getItem("currentSelectedPlatform");
}
