import { ImageResponse } from "next/og";
import { loadBrandLogoDataUrl } from "@/lib/load-brand-logo-data-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const dataUrl = await loadBrandLogoDataUrl();

  if (dataUrl) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#faf5ff",
            padding: 24,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori img + data URL for apple-icon */}
          <img
            alt=""
            src={dataUrl}
            width={140}
            height={140}
            style={{ objectFit: "contain" }}
          />
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 72,
          background: "#7c3aed",
          color: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
        }}
      >
        MS
      </div>
    ),
    { ...size }
  );
}
