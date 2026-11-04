/**
 * demo-listings.ts
 * Pre-built mock listings for demo purposes.
 * Used to show instant AI output without waiting for Gemini API.
 */

import type { Platform, DraftListing } from "@/stores/draft-store";
import { nanoid } from "nanoid";

interface DemoProduct {
  keywords: string[];
  ebay: {
    good: Omit<DraftListing, "id" | "platform" | "isEditing" | "isApproved">;
    damaged: Omit<DraftListing, "id" | "platform" | "isEditing" | "isApproved">;
  };
  shopify: {
    good: Omit<DraftListing, "id" | "platform" | "isEditing" | "isApproved">;
    damaged: Omit<DraftListing, "id" | "platform" | "isEditing" | "isApproved">;
  };
}

const DEMO_PRODUCTS: DemoProduct[] = [
  // ── iPhone ──────────────────────────────────────────────────────────────────
  {
    keywords: ["iphone", "apple phone", "ios"],
    ebay: {
      damaged: {
        seoTitle: "Apple iPhone 13 Pro 128GB Sierra Blue - Cracked Screen, 78% Battery | Parts/Repair",
        seoDescription: `Apple iPhone 13 Pro 128GB in Sierra Blue. Sold for parts or repair.

Condition details:
- Cracked front screen (touchscreen still functional)
- Battery health: 78%
- Body: minor scratches, no dents
- Face ID: working
- All cameras: working (12MP triple system)
- 5G: working
- iCloud: cleared, ready to activate

Great for screen replacement or resale after repair. Tested before listing.

Ships within 1 business day. 30-day returns accepted.`,
        price: 189,
        condition: "For Parts or Not Working",
        categoryId: "9355",
        aiScore: 91,
        aiTone: "transparent",
        itemSpecifics: {
          Brand: "Apple",
          Model: "iPhone 13 Pro",
          Storage: "128GB",
          Color: "Sierra Blue",
          "Battery Health": "78%",
          Screen: "Cracked",
          Network: "Unlocked",
          "Face ID": "Working",
          "Operating System": "iOS",
          "Main Camera": "12MP Triple",
        },
      },
      good: {
        seoTitle: "Apple iPhone 13 Pro 128GB Sierra Blue - Unlocked, Excellent Condition, 92% Battery",
        seoDescription: `Apple iPhone 13 Pro 128GB in Sierra Blue. Fully unlocked, works on any carrier.

Condition: Excellent - minor signs of normal use, no cracks, screen is perfect.

Included:
- iPhone 13 Pro 128GB
- USB-C to Lightning cable
- Original box

Battery health: 92%. All features tested and working: Face ID, 5G, Triple camera, MagSafe.

Fast shipping. 30-day returns accepted.`,
        price: 489,
        condition: "Used - Excellent",
        categoryId: "9355",
        aiScore: 94,
        aiTone: "confident",
        itemSpecifics: {
          Brand: "Apple",
          Model: "iPhone 13 Pro",
          Storage: "128GB",
          Color: "Sierra Blue",
          "Battery Health": "92%",
          Screen: "No cracks",
          Network: "Unlocked",
          "Face ID": "Working",
          "Operating System": "iOS",
          "Main Camera": "12MP Triple",
        },
      },
    },
    shopify: {
      damaged: {
        seoTitle: "iPhone 13 Pro 128GB (Cracked Screen - Parts/Repair)",
        seoDescription: `Selling an iPhone 13 Pro 128GB in Sierra Blue, listed for parts or repair.

What you get:
- Working device with cracked front screen
- Battery health at 78%
- All cameras functional
- Face ID working
- iCloud cleared and ready

Ideal for repair shops or buyers who want to replace the screen for a great deal. Ships within 24 hours.`,
        price: 199,
        condition: "For Parts",
        categoryId: "smartphones",
        aiScore: 88,
        aiTone: "transparent",
        itemSpecifics: {
          Brand: "Apple",
          Model: "iPhone 13 Pro",
          Storage: "128GB",
          Color: "Sierra Blue",
          Condition: "Parts/Repair",
          "Battery Health": "78%",
          Network: "Unlocked",
        },
      },
      good: {
        seoTitle: "Apple iPhone 13 Pro 128GB - Unlocked, Excellent Condition",
        seoDescription: `A clean iPhone 13 Pro 128GB in Sierra Blue. Unlocked for any carrier worldwide.

Battery health: 92%. Screen and body in excellent shape with minor normal wear. All features fully working.

Includes original cable and box. Ships same day on orders before 3 PM.`,
        price: 499,
        condition: "Used - Excellent",
        categoryId: "smartphones",
        aiScore: 93,
        aiTone: "confident",
        itemSpecifics: {
          Brand: "Apple",
          Model: "iPhone 13 Pro",
          Storage: "128GB",
          Condition: "Excellent",
          Network: "Unlocked",
          "Battery Health": "92%",
        },
      },
    },
  },

  // ── Air Jordan / Sneakers ───────────────────────────────────────────────────
  {
    keywords: ["jordan", "air jordan", "sneaker", "nike", "aj1", "kicks"],
    ebay: {
      good: {
        seoTitle: "Nike Air Jordan 1 Retro High OG 'Chicago' Size 10 - Used, Great Shape | Deadstock Box",
        seoDescription: `Nike Air Jordan 1 Retro High OG 'Chicago'. Size 10 US. Worn 3-4 times indoors only.

Condition: Used, great shape. No creasing. Sole clean. Laces: original white laces included.

Comes with original box, both lace sets, and Nike receipt. Ships double-boxed.

Authentic - 100% verified. Will provide StockX receipt on request.`,
        price: 285,
        condition: "Pre-Owned",
        categoryId: "15709",
        aiScore: 90,
        aiTone: "confident",
        itemSpecifics: {
          Brand: "Nike",
          Model: "Air Jordan 1 Retro High OG",
          Colorway: "Chicago",
          "US Size": "10",
          Width: "D - Medium",
          Condition: "Pre-Owned (Great Shape)",
          "Original Box": "Yes",
          "Release Year": "2022",
        },
      },
      damaged: {
        seoTitle: "Nike Air Jordan 1 High OG 'Chicago' Size 10 - Worn, Signs of Use | Great Price",
        seoDescription: `Nike Air Jordan 1 High OG 'Chicago'. Size 10 US. Visibly worn with creasing on toe box and slight sole yellowing.

Honest condition: noticeable wear, not display quality. Great for a beater pair or sole swap project.

No box. Ships carefully wrapped.`,
        price: 149,
        condition: "Pre-Owned",
        categoryId: "15709",
        aiScore: 82,
        aiTone: "transparent",
        itemSpecifics: {
          Brand: "Nike",
          Model: "Air Jordan 1 Retro High OG",
          Colorway: "Chicago",
          "US Size": "10",
          Condition: "Worn - Visible Use",
          "Original Box": "No",
        },
      },
    },
    shopify: {
      good: {
        seoTitle: "Air Jordan 1 Retro High OG Chicago - Size 10 (Used, Excellent)",
        seoDescription: `Lightly used Air Jordan 1 Retro High OG in the Chicago colorway. Size 10 US. Worn only a handful of times indoors. No creasing. Comes with original box and both lace sets. 100% authentic.`,
        price: 295,
        condition: "Pre-Owned - Excellent",
        categoryId: "sneakers",
        aiScore: 90,
        aiTone: "confident",
        itemSpecifics: {
          Brand: "Nike",
          Model: "Air Jordan 1 High OG",
          Size: "US 10",
          Colorway: "Chicago",
          Condition: "Excellent",
        },
      },
      damaged: {
        seoTitle: "Air Jordan 1 Retro High OG Chicago - Size 10 (Worn, Priced to Sell)",
        seoDescription: `Nike Air Jordan 1 OG Chicago in size 10. Visible wear on toe box and sole. Honest beater condition. No box included. Great deal for the colorway.`,
        price: 155,
        condition: "Pre-Owned - Worn",
        categoryId: "sneakers",
        aiScore: 80,
        aiTone: "transparent",
        itemSpecifics: { Brand: "Nike", Size: "US 10", Condition: "Worn" },
      },
    },
  },

  // ── PlayStation 5 ────────────────────────────────────────────────────────────
  {
    keywords: ["ps5", "playstation", "sony console", "playstation 5"],
    ebay: {
      good: {
        seoTitle: "Sony PlayStation 5 Disc Edition Console - Excellent Condition, All Cables, Controller",
        seoDescription: `Sony PlayStation 5 Disc Edition. Everything works perfectly. Used for about 6 months, then stored.

Included:
- PS5 Disc console
- 1x DualSense controller (fully working)
- HDMI cable + power cable
- Original box

No overheating, no disc read errors. Fan clean. Ready to play day one.

Ships double-boxed, insured.`,
        price: 419,
        condition: "Used - Very Good",
        categoryId: "139971",
        aiScore: 95,
        aiTone: "confident",
        itemSpecifics: {
          Brand: "Sony",
          Model: "PlayStation 5",
          Edition: "Disc",
          Storage: "825GB SSD",
          Controllers: "1x DualSense",
          "Original Box": "Yes",
          Color: "White",
          Region: "US/Global",
        },
      },
      damaged: {
        seoTitle: "Sony PlayStation 5 Disc Edition - HDMI Port Issue | For Repair or Parts",
        seoDescription: `Sony PlayStation 5 Disc Edition. Console powers on, fan runs, disc drive works. HDMI port is loose - no video output unless cable is held in place.

Best for someone who can replace the HDMI port (straightforward repair). All other functions tested and working.

No controller included. Original box included.`,
        price: 199,
        condition: "For Parts or Not Working",
        categoryId: "139971",
        aiScore: 85,
        aiTone: "transparent",
        itemSpecifics: {
          Brand: "Sony",
          Model: "PlayStation 5",
          Edition: "Disc",
          Issue: "HDMI port loose",
          "Powers On": "Yes",
          "Disc Drive": "Working",
          "Original Box": "Yes",
        },
      },
    },
    shopify: {
      good: {
        seoTitle: "PlayStation 5 Disc Edition - Used, Excellent Condition",
        seoDescription: `Sony PS5 Disc Edition in excellent condition. 6 months of use. Includes console, DualSense controller, all cables, and original box. Zero issues. Ships insured.`,
        price: 429,
        condition: "Used - Excellent",
        categoryId: "gaming-consoles",
        aiScore: 94,
        aiTone: "confident",
        itemSpecifics: { Brand: "Sony", Model: "PS5", Edition: "Disc", Condition: "Excellent" },
      },
      damaged: {
        seoTitle: "PlayStation 5 - HDMI Port Issue (For Repair)",
        seoDescription: `PS5 Disc Edition with a loose HDMI port. Console powers on and disc drive works. Needs HDMI port replacement. Great parts or repair opportunity.`,
        price: 209,
        condition: "For Parts/Repair",
        categoryId: "gaming-consoles",
        aiScore: 83,
        aiTone: "transparent",
        itemSpecifics: { Brand: "Sony", Model: "PS5", Issue: "HDMI port", Condition: "Parts/Repair" },
      },
    },
  },

  // ── MacBook ──────────────────────────────────────────────────────────────────
  {
    keywords: ["macbook", "mac laptop", "apple laptop", "macbook pro", "macbook air"],
    ebay: {
      good: {
        seoTitle: "Apple MacBook Pro 14\" M1 Pro 2021 - 16GB RAM, 512GB SSD, Space Gray | Excellent",
        seoDescription: `Apple MacBook Pro 14-inch (2021) with M1 Pro chip. Space Gray.
Specs: 16GB unified memory, 512GB SSD, 10-core CPU, 16-core GPU.

Condition: Excellent - no dents, no scratches. Screen perfect, no dead pixels. Battery: 94% health (87 cycles).

Includes original charger (MagSafe 3), original box.

Factory reset and ready to set up. Ships in original box with bubble wrap.`,
        price: 1099,
        condition: "Used - Excellent",
        categoryId: "111422",
        aiScore: 96,
        aiTone: "confident",
        itemSpecifics: {
          Brand: "Apple",
          Model: "MacBook Pro 14-inch (2021)",
          Chip: "Apple M1 Pro",
          RAM: "16GB",
          Storage: "512GB SSD",
          Color: "Space Gray",
          "Battery Health": "94%",
          "Battery Cycles": "87",
          Screen: "Perfect - no dead pixels",
          Charger: "Included",
        },
      },
      damaged: {
        seoTitle: "Apple MacBook Pro 14\" M1 Pro 2021 - Cracked Screen, Fully Working | Parts or Repair",
        seoDescription: `Apple MacBook Pro 14-inch M1 Pro (2021). Cracked display - hairline crack on the bottom left corner. Screen still functions but crack is visible.

Everything else works perfectly:
- M1 Pro chip: fully working
- 16GB RAM, 512GB SSD
- Keyboard, trackpad, speakers, ports: all working
- Battery: 88% health

Ideal for screen replacement or someone who uses an external monitor. Ships carefully packed.`,
        price: 599,
        condition: "For Parts or Not Working",
        categoryId: "111422",
        aiScore: 87,
        aiTone: "transparent",
        itemSpecifics: {
          Brand: "Apple",
          Model: "MacBook Pro 14-inch (2021)",
          Chip: "Apple M1 Pro",
          RAM: "16GB",
          Storage: "512GB SSD",
          "Screen Issue": "Cracked display",
          "Battery Health": "88%",
          Keyboard: "Working",
          Trackpad: "Working",
        },
      },
    },
    shopify: {
      good: {
        seoTitle: "MacBook Pro 14\" M1 Pro 2021 - 16GB / 512GB (Excellent Condition)",
        seoDescription: `Lightly used MacBook Pro 14-inch (2021) with M1 Pro, 16GB RAM, 512GB SSD. 94% battery health. Excellent cosmetic condition. Includes MagSafe 3 charger and original box. Factory reset and ready to go.`,
        price: 1129,
        condition: "Used - Excellent",
        categoryId: "laptops",
        aiScore: 95,
        aiTone: "confident",
        itemSpecifics: { Brand: "Apple", Chip: "M1 Pro", RAM: "16GB", Storage: "512GB", Condition: "Excellent" },
      },
      damaged: {
        seoTitle: "MacBook Pro 14\" M1 Pro - Cracked Screen (All Else Works)",
        seoDescription: `MacBook Pro 14-inch M1 Pro with a cracked display. Screen functional but cracked. Keyboard, trackpad, ports all working. 88% battery. Great for external monitor use or screen repair.`,
        price: 619,
        condition: "Parts/Repair",
        categoryId: "laptops",
        aiScore: 85,
        aiTone: "transparent",
        itemSpecifics: { Brand: "Apple", Chip: "M1 Pro", RAM: "16GB", Storage: "512GB", Issue: "Cracked screen" },
      },
    },
  },

  // ── Samsung Galaxy ──────────────────────────────────────────────────────────
  {
    keywords: ["samsung", "galaxy", "samsung phone", "android phone", "galaxy s"],
    ebay: {
      good: {
        seoTitle: "Samsung Galaxy S23 Ultra 256GB Phantom Black - Unlocked, Excellent | S Pen Included",
        seoDescription: `Samsung Galaxy S23 Ultra 256GB in Phantom Black. Factory unlocked, works on any carrier.

Condition: Excellent - no cracks, no scratches. Screen is flawless.

Includes:
- Galaxy S23 Ultra with S Pen
- Original USB-C cable
- Original box

Battery health: 96%. All features tested: 200MP camera, 12GB RAM, S Pen, Samsung DeX.

30-day returns. Ships same business day.`,
        price: 629,
        condition: "Used - Excellent",
        categoryId: "9355",
        aiScore: 93,
        aiTone: "confident",
        itemSpecifics: {
          Brand: "Samsung",
          Model: "Galaxy S23 Ultra",
          Storage: "256GB",
          RAM: "12GB",
          Color: "Phantom Black",
          Network: "Unlocked",
          "Battery Health": "96%",
          "S Pen": "Included",
          Camera: "200MP",
        },
      },
      damaged: {
        seoTitle: "Samsung Galaxy S23 Ultra 256GB - Cracked Back Glass, Working | Great Deal",
        seoDescription: `Samsung Galaxy S23 Ultra 256GB. Front screen is perfect - crack is on the back glass only (cosmetic, does not affect function).

All features work:
- 200MP camera: working
- S Pen: included and working
- Battery health: 89%
- Fingerprint, face unlock: working

Unlocked for any carrier. No box included.`,
        price: 379,
        condition: "Used - Good",
        categoryId: "9355",
        aiScore: 86,
        aiTone: "transparent",
        itemSpecifics: {
          Brand: "Samsung",
          Model: "Galaxy S23 Ultra",
          Storage: "256GB",
          Color: "Phantom Black",
          "Back Glass": "Cracked (cosmetic)",
          "Front Screen": "Perfect",
          Network: "Unlocked",
          "Battery Health": "89%",
          "S Pen": "Included",
        },
      },
    },
    shopify: {
      good: {
        seoTitle: "Samsung Galaxy S23 Ultra 256GB - Unlocked, Excellent Condition",
        seoDescription: `Unlocked Galaxy S23 Ultra 256GB in Phantom Black. Excellent condition, 96% battery health. Includes S Pen, USB-C cable, and original box. Ships same day.`,
        price: 639,
        condition: "Used - Excellent",
        categoryId: "smartphones",
        aiScore: 92,
        aiTone: "confident",
        itemSpecifics: { Brand: "Samsung", Model: "Galaxy S23 Ultra", Storage: "256GB", Condition: "Excellent", Network: "Unlocked" },
      },
      damaged: {
        seoTitle: "Samsung Galaxy S23 Ultra - Cracked Back Glass (Screen Perfect)",
        seoDescription: `Galaxy S23 Ultra 256GB with cracked back glass (cosmetic only - screen is flawless). All features working, 89% battery. S Pen included. Unlocked.`,
        price: 389,
        condition: "Used - Good",
        categoryId: "smartphones",
        aiScore: 84,
        aiTone: "transparent",
        itemSpecifics: { Brand: "Samsung", Model: "Galaxy S23 Ultra", Storage: "256GB", Issue: "Back glass cracked", "Front Screen": "Perfect" },
      },
    },
  },
];

const DAMAGE_KEYWORDS = [
  "crack", "broken", "damaged", "repair", "parts", "screen crack",
  "bad battery", "poor battery", "78%", "79%", "80%", "81%", "82%", "83%",
  "dent", "scratch", "fault", "not working", "dead", "issue",
];

function isDamaged(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  return DAMAGE_KEYWORDS.some((kw) => lower.includes(kw));
}

export function findDemoListing(
  prompt: string,
  platform: Platform
): DraftListing | null {
  const lower = prompt.toLowerCase();

  const match = DEMO_PRODUCTS.find((p) =>
    p.keywords.some((kw) => lower.includes(kw))
  );

  if (!match) return null;

  const conditionKey = isDamaged(prompt) ? "damaged" : "good";
  const template = match[platform.toLowerCase() as "ebay" | "shopify"][conditionKey];

  return {
    id: nanoid(),
    platform,
    isEditing: false,
    isApproved: false,
    ...template,
  };
}

