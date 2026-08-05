import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0d9488 0%, #059669 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -2 }}>Hisaabi</div>
        <div style={{ fontSize: 36, marginTop: 20, opacity: 0.92 }}>
          Chat your expenses. Keep your data.
        </div>
      </div>
    ),
    { ...size },
  );
}
