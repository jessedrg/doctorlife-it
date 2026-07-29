import { ImageResponse } from "next/og";

// Imagen social por defecto (Open Graph + Twitter) para toda la web.
export const runtime = "edge";
export const alt = "DoctorLife — cuidado del peso con seguimiento médico";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#221d17";
const PAPER = "#f6f0e6";
const SAGE = "#cdd9a0";
const CLAY = "#a65f3b";
const OLIVE = "#5f6a3e";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: INK,
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Marca */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              backgroundColor: OLIVE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: PAPER,
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            D
          </div>
          <span style={{ color: PAPER, fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>
            DoctorLife
          </span>
        </div>

        {/* Titular */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <span
            style={{
              color: SAGE,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Médicos colegiados en España
          </span>
          <span
            style={{
              color: PAPER,
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              maxWidth: 940,
            }}
          >
            Tu cuerpo, por fin entendido
          </span>
          <span style={{ color: "#c9bfb0", fontSize: 30, lineHeight: 1.3, maxWidth: 900 }}>
            Cuidado del peso con seguimiento médico real desde la app. Sin listas de espera.
          </span>
        </div>

        {/* Pie */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ height: 6, width: 64, borderRadius: 3, backgroundColor: CLAY }} />
          <span style={{ color: "#8f8578", fontSize: 24 }}>doctorlife.io</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
