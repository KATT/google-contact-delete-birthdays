import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title =
      searchParams.get("title") || "Google Contacts Birthday Manager";
    const description =
      searchParams.get("description") ||
      "Clean up your Google Contacts by removing unwanted birthday notifications from old Facebook syncs and random contacts.";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            // Match the page gradient: from-background via-background to-primary/5
            background:
              "linear-gradient(135deg, #f8f9fc 0%, #f8f9fc 50%, #f0f9f4 100%)",
            padding: "60px",
            fontFamily: "Inter, DM Sans, sans-serif",
            position: "relative",
          }}
        >
          {/* Background blur effects to match glassmorphism */}
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "10%",
              width: "300px",
              height: "300px",
              background:
                "linear-gradient(135deg, rgba(114, 194, 164, 0.1) 0%, rgba(114, 194, 164, 0.05) 100%)",
              borderRadius: "50%",
              filter: "blur(40px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "20%",
              right: "10%",
              width: "250px",
              height: "250px",
              background:
                "linear-gradient(135deg, rgba(114, 194, 164, 0.08) 0%, rgba(114, 194, 164, 0.03) 100%)",
              borderRadius: "50%",
              filter: "blur(30px)",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              // Match the card styling with backdrop blur
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "24px",
              padding: "80px 60px",
              maxWidth: "900px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(228, 228, 231, 0.5)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Calendar icon with gradient background - matching the page hero */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "120px",
                height: "120px",
                background:
                  "linear-gradient(135deg, rgba(114, 194, 164, 0.2) 0%, rgba(114, 194, 164, 0.1) 50%, transparent 100%)",
                borderRadius: "24px",
                marginBottom: "40px",
                border: "1px solid rgba(114, 194, 164, 0.2)",
                position: "relative",
              }}
            >
              {/* Animated pulse effect */}
              <div
                style={{
                  position: "absolute",
                  inset: "0",
                  borderRadius: "24px",
                  background:
                    "linear-gradient(135deg, rgba(114, 194, 164, 0.05) 0%, transparent 100%)",
                }}
              />
              <svg
                width="60"
                height="60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgb(114, 194, 164)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ position: "relative", zIndex: 1 }}
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>

            {/* Title with gradient text effect matching the page */}
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                textAlign: "center",
                lineHeight: "1.1",
                marginBottom: "24px",
                maxWidth: "800px",
                background:
                  "linear-gradient(135deg, #3c4043 0%, #3c4043 70%, rgba(60, 64, 67, 0.7) 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ marginBottom: "8px" }}>Google Contacts</div>
              <div
                style={{
                  background: "rgb(114, 194, 164)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                Birthday Manager
              </div>
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: "20px",
                color: "#6b7280",
                textAlign: "center",
                lineHeight: "1.5",
                maxWidth: "700px",
                margin: "0 0 40px 0",
              }}
            >
              {description}
            </p>

            {/* Feature badges matching the page design */}
            <div
              style={{
                display: "flex",
                gap: "20px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "rgba(248, 250, 252, 0.5)",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  border: "1px solid rgba(228, 228, 231, 0.5)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    backgroundColor: "rgb(34, 197, 94)",
                    borderRadius: "50%",
                  }}
                />
                <span
                  style={{
                    fontSize: "16px",
                    color: "#374151",
                    fontWeight: "500",
                  }}
                >
                  Free to Use
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "rgba(248, 250, 252, 0.5)",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  border: "1px solid rgba(228, 228, 231, 0.5)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    backgroundColor: "rgb(114, 194, 164)",
                    borderRadius: "50%",
                  }}
                />
                <span
                  style={{
                    fontSize: "16px",
                    color: "#374151",
                    fontWeight: "500",
                  }}
                >
                  Privacy Focused
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "rgba(248, 250, 252, 0.5)",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  border: "1px solid rgba(228, 228, 231, 0.5)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    backgroundColor: "rgb(251, 146, 60)",
                    borderRadius: "50%",
                  }}
                />
                <span
                  style={{
                    fontSize: "16px",
                    color: "#374151",
                    fontWeight: "500",
                  }}
                >
                  No Data Stored
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error("Error generating OG image:", e);
    return new Response("Failed to generate image", { status: 500 });
  }
}
