import { Settings, Shield, Key, Link as LinkIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#080B0E] p-6 lg:p-10 flex flex-col gap-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Settings & Integrations
        </h1>
        <p className="text-sm text-[#8A9099] mt-1">
          Manage your multi-tenant account, API credentials, and marketplace integrations.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-[#1E242B] bg-[#12161A] p-6">
          <div className="flex items-center gap-3 mb-4">
            <LinkIcon className="h-5 w-5 text-[#C5E756]" />
            <h2 className="text-base font-semibold text-white">Marketplace Connections</h2>
          </div>
          <p className="text-xs text-[#8A9099] mb-5">
            Connect your seller stores to enable auto-sync and one-click publishing.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* eBay */}
            <div className="flex items-center justify-between rounded-xl border border-[#1E242B] bg-[#0E1216] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E53238]/10 text-lg font-bold text-[#E53238]">
                  e
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">eBay</p>
                  <p className="text-xs text-[#8A9099]">OAuth 2.0</p>
                </div>
              </div>
              <button className="rounded-lg bg-[#182315] border border-[#C5E756]/30 px-3 py-1.5 text-xs font-semibold text-[#C5E756] hover:bg-[#1E2C1A] transition-colors">
                Connect
              </button>
            </div>

            {/* Shopify */}
            <div className="flex items-center justify-between rounded-xl border border-[#1E242B] bg-[#0E1216] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#96BF48]/10 text-lg font-bold text-[#96BF48]">
                  S
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Shopify</p>
                  <p className="text-xs text-[#8A9099]">Admin API</p>
                </div>
              </div>
              <button className="rounded-lg bg-[#182315] border border-[#C5E756]/30 px-3 py-1.5 text-xs font-semibold text-[#C5E756] hover:bg-[#1E2C1A] transition-colors">
                Connect
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#1E242B] bg-[#12161A] p-6">
          <div className="flex items-center gap-3 mb-2">
            <Key className="h-5 w-5 text-[#82DBF7]" />
            <h2 className="text-base font-semibold text-white">AI Provider (Google Gemini)</h2>
          </div>
          <p className="text-xs text-[#8A9099] mb-4">
            Structured JSON output powered by Gemini 1.5 Flash.
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-soft border border-lime-line px-3 py-1 text-xs font-medium text-[#C5E756]">
              ● Ready for GEMINI_API_KEY
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
