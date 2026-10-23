import { TrendingUp, DollarSign, ShoppingCart, ArrowUpRight } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#080B0E] p-6 lg:p-10 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Performance Analytics
        </h1>
        <p className="text-sm text-[#8A9099] mt-1">
          Revenue, listing velocity, and marketplace conversion rates.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#1E242B] bg-[#12161A] p-5">
          <div className="flex items-center gap-2 text-[#8E95A0]">
            <DollarSign className="h-4 w-4 text-[#C5E756]" />
            <span className="text-sm font-medium text-white">Monthly GMV</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-white">$14,290.00</p>
          <p className="mt-1 text-xs text-good flex items-center gap-1 font-semibold">
            <ArrowUpRight className="h-3.5 w-3.5" /> +18.4% vs last month
          </p>
        </div>

        <div className="rounded-2xl border border-[#1E242B] bg-[#12161A] p-5">
          <div className="flex items-center gap-2 text-[#8E95A0]">
            <ShoppingCart className="h-4 w-4 text-[#82DBF7]" />
            <span className="text-sm font-medium text-white">Total Orders</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-white">284</p>
          <p className="mt-1 text-xs text-good flex items-center gap-1 font-semibold">
            <ArrowUpRight className="h-3.5 w-3.5" /> +12.1%
          </p>
        </div>

        <div className="rounded-2xl border border-[#1E242B] bg-[#12161A] p-5">
          <div className="flex items-center gap-2 text-[#8E95A0]">
            <TrendingUp className="h-4 w-4 text-[#C5E756]" />
            <span className="text-sm font-medium text-white">Avg. Listing Velocity</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-white">4.2 days</p>
          <p className="mt-1 text-xs text-[#8A9099]">from draft to first sale</p>
        </div>
      </div>
    </div>
  );
}
