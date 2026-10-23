interface ProductListing {
  name: string;
  platform: string;
  status: "Processing" | "Live" | "Draft" | "Queued";
  inventory: number;
}

const products: ProductListing[] = [
  { name: "Product Name 1", platform: "Shopify", status: "Processing", inventory: 80 },
  { name: "Product Name 2", platform: "Shopify", status: "Processing", inventory: 200 },
  { name: "Product Name 3", platform: "Shopify", status: "Processing", inventory: 30 },
  { name: "Product Name 4", platform: "Shopify", status: "Processing", inventory: 10 },
];

const statusColor: Record<string, string> = {
  Processing: "#C5E756",
  Live: "#4AC97E",
  Draft: "#8A9099",
  Queued: "#F5B84A",
};

export function QuickListings() {
  return (
    <div
      style={{
        borderRadius: "20px",
        border: "1px solid #1E242B",
        backgroundColor: "#12161A",
        padding: "28px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
        height: "100%",
      }}
    >
      <h2
        style={{
          fontSize: "16px",
          fontWeight: "600",
          color: "#FFFFFF",
          marginBottom: "22px",
          letterSpacing: "-0.2px",
        }}
      >
        Quick product listings
      </h2>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Product Name", "Platform", "Status", "Inventory"].map((h, i) => (
                <th
                  key={h}
                  style={{
                    padding: "0 12px 14px",
                    textAlign: i === 3 ? "right" : "left",
                    fontSize: "12px",
                    fontWeight: "500",
                    color: "#6C737F",
                    letterSpacing: "0.04em",
                    borderBottom: "1px solid #1E242B",
                    whiteSpace: "nowrap",
                    paddingLeft: i === 0 ? 0 : "12px",
                    paddingRight: i === 3 ? 0 : "12px",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((item, i) => (
              <tr
                key={i}
                style={{ borderBottom: "1px solid #181D23", cursor: "default" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "#161B22";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "transparent";
                }}
              >
                <td
                  style={{
                    padding: "16px 12px 16px 0",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#E1E4EA",
                  }}
                >
                  {item.name}
                </td>
                <td
                  style={{
                    padding: "16px 12px",
                    fontSize: "14px",
                    color: "#8A9099",
                  }}
                >
                  {item.platform}
                </td>
                <td style={{ padding: "16px 12px" }}>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: statusColor[item.status] || "#8A9099",
                    }}
                  >
                    {item.status}
                  </span>
                </td>
                <td
                  style={{
                    padding: "16px 0 16px 12px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#E1E4EA",
                    textAlign: "right",
                  }}
                >
                  {item.inventory}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
