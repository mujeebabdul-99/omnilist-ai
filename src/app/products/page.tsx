import { Package, Plus, Search, Filter } from "lucide-react";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#080B0E] p-6 lg:p-10 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Products Catalog
          </h1>
          <p className="text-sm text-[#8A9099] mt-1">
            Manage your unified product master data and inventory across channels.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-[#C5E756] px-4 py-2.5 text-xs font-semibold text-[#0A0D10] hover:brightness-110 transition-all shadow-[0_0_16px_rgba(197,231,86,0.2)]">
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#6C737F]" />
          <input
            type="text"
            placeholder="Search by SKU, Title, or UPC..."
            className="w-full rounded-xl border border-[#1E242B] bg-[#12161A] pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-[#6C737F] focus:border-[#C5E756] focus:outline-none"
          />
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-[#1E242B] bg-[#12161A] px-4 py-2.5 text-xs font-medium text-[#A0A6B2] hover:text-white hover:border-[#2D3642] transition-colors">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </button>
      </div>

      <div className="rounded-2xl border border-[#1E242B] bg-[#12161A]/90 p-8 text-center text-[#8A9099]">
        <Package className="h-10 w-10 mx-auto text-[#6C737F] mb-3 stroke-[1.5]" />
        <p className="text-base font-medium text-white">Product Catalog Initialized</p>
        <p className="text-sm mt-1">
          Catalog items will be synchronized with MySQL via Prisma. Use the AI Command bar on the Dashboard to import products via UPC.
        </p>
      </div>
    </div>
  );
}
