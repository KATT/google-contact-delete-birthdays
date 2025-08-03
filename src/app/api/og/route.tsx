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
            backgroundColor: "#ffffff",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "60px",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "24px",
              padding: "60px",
              maxWidth: "900px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            {/* Icon */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "120px",
                height: "120px",
                backgroundColor: "#667eea",
                borderRadius: "24px",
                marginBottom: "30px",
              }}
            >
              <svg
                width="60"
                height="60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "#1a202c",
                textAlign: "center",
                lineHeight: "1.2",
                marginBottom: "20px",
                maxWidth: "800px",
              }}
            >
              {title}
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: "24px",
                color: "#4a5568",
                textAlign: "center",
                lineHeight: "1.4",
                maxWidth: "700px",
                margin: "0",
              }}
            >
              {description}
            </p>

            {/* Features */}
            <div
              style={{
                display: "flex",
                gap: "30px",
                marginTop: "40px",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#f7fafc",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    backgroundColor: "#48bb78",
                    borderRadius: "50%",
                  }}
                />
                <span
                  style={{
                    fontSize: "18px",
                    color: "#2d3748",
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
                  backgroundColor: "#f7fafc",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    backgroundColor: "#667eea",
                    borderRadius: "50%",
                  }}
                />
                <span
                  style={{
                    fontSize: "18px",
                    color: "#2d3748",
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
                  backgroundColor: "#f7fafc",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    backgroundColor: "#ed8936",
                    borderRadius: "50%",
                  }}
                />
                <span
                  style={{
                    fontSize: "18px",
                    color: "#2d3748",
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
