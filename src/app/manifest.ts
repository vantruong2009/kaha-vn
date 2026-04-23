import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KAHA.VN",
    short_name: "KAHA",
    description: "Đèn trang trí cao cấp — KAHA.VN",
    start_url: "/",
    display: "browser",
    background_color: "#faf8f5",
    theme_color: "#faf8f5",
    lang: "vi",
  };
}
