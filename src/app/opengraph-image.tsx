import { ImageResponse } from "next/og";

export const alt =
  "StackCost ranks the yearly all-in cost of DCAing Bitcoin on 9 US platforms at $100 a week";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const rows: { name: string; cost: string; estimate: boolean }[] = [
  { name: "Cash App", cost: "$0.00", estimate: false },
  { name: "Strike", cost: "$12.33", estimate: true },
  { name: "River", cost: "$14.00", estimate: true },
  { name: "Robinhood", cost: "$49.40", estimate: true },
  { name: "Swan", cost: "$52.00", estimate: false },
  { name: "Kraken", cost: "$78.00", estimate: true },
  { name: "Fold", cost: "$78.00", estimate: true },
  { name: "Coinbase", cost: "$103.48", estimate: true },
  { name: "PayPal", cost: "$156.00", estimate: true },
];

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#09090b",
          color: "#fafafa",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: 12,
            height: "100%",
            backgroundColor: "#fbbf24",
            display: "flex",
          }}
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            padding: "48px 56px",
            gap: 48,
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  fontSize: 36,
                  fontWeight: 600,
                  letterSpacing: "-0.04em",
                }}
              >
                <span>Stack</span>
                <span style={{ color: "#fbbf24" }}>Cost</span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 36,
                  fontSize: 52,
                  fontWeight: 650,
                  lineHeight: 1.15,
                  letterSpacing: "-0.03em",
                }}
              >
                <span>The real yearly</span>
                <span>cost of DCAing</span>
                <span>Bitcoin</span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 28,
                  fontSize: 24,
                  color: "#a1a1aa",
                  lineHeight: 1.4,
                }}
              >
                <span>$100 a week · 9 US platforms</span>
                <span>Fees + spread + first-buy + custody</span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 20,
                color: "#71717a",
              }}
            >
              stackcost-pink.vercel.app
            </div>
          </div>
          <div
            style={{
              width: 420,
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: 16,
              padding: "20px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
                color: "#71717a",
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              <span>Platform</span>
              <span>Yearly cost</span>
            </div>
            {rows.map((r) => (
              <div
                key={r.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "7px 0",
                  borderTop: "1px solid #27272a",
                  fontSize: 22,
                }}
              >
                <span style={{ color: "#e4e4e7" }}>{r.name}</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontWeight: 650, fontVariantNumeric: "tabular-nums" }}>
                    {r.cost}
                  </span>
                  {r.estimate ? (
                    <span style={{ fontSize: 13, color: "#a1a1aa" }}>est.</span>
                  ) : null}
                </div>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                marginTop: 10,
                fontSize: 13,
                color: "#71717a",
              }}
            >
              Estimates labeled. Sources on the site.
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
