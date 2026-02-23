"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function DocsPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff", padding: "16px" }}>
      <SwaggerUI url="/api/openapi" />
      <style jsx global>{`
        html, body {
          background: #ffffff !important;
        }
        .swagger-ui, .swagger-ui .wrapper {
          background: #ffffff !important;
        }
      `}</style>
    </div>
  );
}
