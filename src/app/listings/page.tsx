import { FileText, ExternalLink, RefreshCw } from "lucide-react";

export default function ListingsPage() {
  return (
    <div className="min-h-screen bg-[#080B0E] p-6 lg:p-10 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Marketplace Listings
          </h1>
          <p className="text-sm text-[#8A9099] mt-1">
            Active and queued multi-channel listings on eBay and Shopify.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-[#1E242B] bg-[#12161A] px-4 py-2.5 text-xs font-semibold text-[#C5E756] hover:bg-[#182315] hover:border-[#C5E756]/40 transition-all">
          <RefreshCw className="h-4 w-4" />
          <span>Sync All Channels</span>
        </button>
      </div>

      <div className="rounded-2xl border border-[#1E242B] bg-[#12161A]/90 p-8 text-center text-[#8A9099]">
        <FileText className="h-10 w-10 mx-auto text-[#6C737F] mb-3 stroke-[1.5]" />
        <p className="text-base font-medium text-white">Live Listings Connected</p>
        <p className="text-sm mt-1 max-w-md mx-auto">
          Marketplace-specific titles, pricing, and Cassini SEO descriptions are rendered here.
        </p>
      </div>
    </div>
  );
}
