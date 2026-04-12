import { ImageResponse } from "next/og";
import { loadBrandLogoDataUrl } from "@/lib/load-brand-logo-data-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
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
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori img + data URL for favicon */}
          <img
            alt=""
            src={dataUrl}
            width={28}
            height={28}
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
          fontSize: 14,
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
