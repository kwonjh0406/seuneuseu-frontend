import { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    theme_color: "#8936FF",
    background_color: "#2EC6FE",
    icons: [
      {
        purpose: "maskable",
        sizes: "512x512",
        src: "/icons/512.png",
        type: "image/png",
      },
      {
        purpose: "any",
        sizes: "512x512",
        src: "/icons/512.png",
        type: "image/png",
      },
    ],
    orientation: "any",
    display: "standalone",
    dir: "auto",
    lang: "ko-KR",
    name: "seuneuseu",
    short_name: "seuneuseu",
    start_url: "/",
    scope: "/",
  }
}
