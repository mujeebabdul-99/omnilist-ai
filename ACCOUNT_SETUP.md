# Marketplace Account Setup & Legal Guide (Pakistan)

## 📦 Overview
This document walks you through **creating seller accounts** on the major marketplaces integrated with OmniList (eBay, Shopify, Amazon, Walmart, Etsy) **and testing their OAuth/auth flows**.  It also outlines the **legal and compliance steps** you need to follow when operating an e‑commerce business from Pakistan.

---

## 1️⃣ eBay (Seller & Sandbox)
### 1.1 Register as a Developer
1. Go to the **eBay Developer Program**: <https://developer.ebay.com/> and click **Sign Up**.
2. Fill in your personal details (use a Pakistani address – it’s accepted).
3. Verify your email and log in.

### 1.2 Create a Sandbox Application
1. In the **Dashboard**, click **Create an App**.
2. Choose **Sandbox** environment.
3. Note the **App ID (Client ID)**, **Cert ID (Client Secret)** and **Redirect URL**.
   - Set the redirect URI to your OmniList callback, e.g.
     `https://your‑domain.com/api/ebay/auth/callback`
4. **Save** the keys – you’ll need them in `.env` (`EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET`).

### 1.3 Generate Sandbox Test Users
1. In **User Tokens → Sandbox Users**, click **Create User**.
2. Create a **Seller** and a **Buyer** user (provide a fake email; they’re only for testing).
3. Record the **User ID** and **Password**.

### 1.4 Test OAuth Flow in OmniList
```bash
# Start the dev server (if not running)
npm run dev
```
1. Visit `https://your‑domain.com/api/ebay/auth`.
2. Log in with the **sandbox seller** credentials.
3. After consent, you should be redirected back to OmniList with a **code** that is exchanged for an **access token**.
4. Verify the token by fetching your sandbox listings:
   `GET /api/ebay/listings` (protected route).

> ✅ **Result:** You can now list, update, and delete items on eBay **sandbox** without a real seller account.

---

## 2️⃣ Shopify (Partner Development Store)
### 2.1 Sign Up for a Shopify Partner Account
- Visit <https://partners.shopify.com/> and **Create a Partner account**.
- Complete the onboarding questionnaire.

### 2.2 Create a Development Store
1. In the Partner Dashboard → **Stores → Add Store** → **Development store**.
2. Choose **Store name**, **Password**, and **Domain**.
3. Enable **Private apps** under **Apps → Manage private apps → Enable**.

### 2.3 Generate API Credentials
1. Click **Create a new private app**.
2. Provide a **Title** (e.g., `OmniList Integration`).
3. Set **Admin API permissions** you need – usually **Products**, **Orders**, **Inventory** (Read/Write).
4. Add the **Redirect URI** matching OmniList: `https://your‑domain.com/api/shopify/auth/callback`.
5. Save – note the **API key** and **API secret key**.

### 2.4 Test the OAuth Flow
```bash
# Assuming the dev server is running
open https://your‑domain.com/api/shopify/auth
```
- You’ll be prompted to install the custom app on the development store.
- After approval, OmniList receives an **access token** which can be used to list products via the Shopify Admin API.

---

## 3️⃣ Amazon (SP‑API / MWS)
### 3.1 Register as an Amazon Seller
- Go to <https://sellercentral.amazon.com/> and click **Register**.
- Choose **Individual** (no monthly fee) or **Professional** (if you expect > $40 k/year).
- Complete the **identity verification** (passport, bank account).  Amazon allows Pakistani sellers for most marketplaces (e.g., **Amazon.com**, **Amazon.ae**).

### 3.2 Enroll in the **Amazon Marketplace Web Service (MWS)** / **Selling Partner API (SP‑API)**
1. After registration, sign in to **Seller Central → Apps & Services → Develop Apps**.
2. Click **Add a new app** → **Create a new developer profile** (if you don’t have one).
3. Generate the following credentials:
   - **Seller ID** (Merchant ID)
   - **MWS Auth Token** (or SP‑API **Refresh Token**)
   - **AWS Access Key ID** & **Secret Access Key** (for SP‑API signing)
4. Add the OmniList callback URL to the **Allowed Return URLs** list.

### 3.3 Test the Integration
- Use OmniList’s built‑in **Amazon auth endpoint** (`/api/amazon/auth`).
- Follow the consent screen, retrieve the **Refresh Token**, and store it in `.env` (`AMAZON_REFRESH_TOKEN`).
- Run a simple **list‑orders** request to confirm connectivity.

---

## 4️⃣ Walmart & Etsy (Optional Quick‑Start)
| Marketplace | Account Type | Key Steps |
|------------|--------------|----------|
| **Walmart** | Seller Central (requires US Tax ID) – you can use a **global partner** or **third‑party service** to obtain a **Walmart Marketplace** account. |
| **Etsy** | Register at <https://www.etsy.com/> → **Shop Manager → Apps & Services** → **Create a private app**. |

*Both provide OAuth client IDs & secrets similar to eBay/Shopify. Add the OmniList redirect URL and test with the same flow.*

---

## 5️⃣ Legal & Compliance Checklist for Pakistan
1. **Business Registration**
   - **Sole Proprietorship** – simple, register at **FBR** for a **National Tax Number (NTN)**.
   - **Private Limited Company** – register with **SECP**; obtain **NTN** and **Sales Tax Registration** if annual turnover > PKR 5 million.
2. **Tax Obligations**
   - **Income Tax** – file annually via the FBR portal; keep all sales invoices.
   - **Sales Tax (GST)** – applicable on local sales; export sales are generally exempt but still need documentation.
3. **Foreign Currency & Payouts**
   - Use **Payoneer** (official partner for eBay Managed Payments in Pakistan) or a **US LLC with Mercury/Relay Bank**. *(Note: PayPal is not directly supported in Pakistan).*
   - Comply with the **State Bank of Pakistan (SBP)** regulations on foreign remittances under **FE Circular No. 04 of 2020** (Form-E exemption up to $5,000 for B2C e-commerce courier exports).
   - Generate **e-PRC (Electronic Proceeds Realization Certificate)** for FBR tax declaration.

> 📖 **Deep Dive Document:** For the complete, exhaustive guide on Pakistani legal setup, FBR tax exemptions, SBP circulars, and Payoneer/US LLC models, see [PAKISTAN_SELLER_AND_LEGAL_GUIDE.md](file:///Users/User/Desktop/Abdul%20projects/OmniList/PAKISTAN_SELLER_AND_LEGAL_GUIDE.md).
4. **Customs & Import Duties**
   - When importing goods for resale, declare the **HS Code** and pay applicable **customs duty** and **sales tax**.
   - Keep **customs clearance documents** for audit purposes.
5. **Data Protection & Consumer Rights**
   - Follow the **Pakistan Personal Data Protection Bill (draft)** – store only necessary personal data, protect it with encryption (HTTPS, bcrypt passwords).
   - Provide a **Privacy Policy** and **Terms of Service** on your website.
6. **Marketplace Specific Policies**
   - **eBay** – follow the **eBay International Seller Policy**; disclose shipping times and customs fees.
   - **Shopify** – comply with Shopify's **Terms of Service** and local consumer protection laws.
   - **Amazon** – ensure your listings respect **Amazon’s Product Authenticity** and **Export Regulations**.

---

## 6️⃣ Testing Checklist
- **[ ]** Set environment variables (`EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET`, `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `AMAZON_*`).
- **[ ]** Run `npm run dev` and open the OAuth routes for each marketplace.
- **[ ]** Verify that a **token** is stored (check your DB `UserMarketplaceToken` table).
- **[ ]** Create a **sample product** in OmniList and push it to each marketplace.
- **[ ]** Review the response logs for any permission errors and adjust API scopes accordingly.
- **[ ]** Confirm payouts can be received to your **Payoneer** or **local foreign‑currency bank account**.

---

## 7️⃣ Quick Reference Links
- eBay Developer Docs: <https://developer.ebay.com/api-docs/static/oauth-client-credentials.html>
- Shopify Partner Docs: <https://shopify.dev/apps/auth>
- Amazon SP‑API Docs: <https://developer.amazonservices.com/>
- Pakistan FBR Portal: <https://fbr.gov.pk/>
- SECP Company Registration: <https://www.secp.gov.pk/> 

---

*Prepared for the upcoming meeting with **Michal** – the co‑founder candidate who will drive sales & marketing. This guide shows we have a solid, compliant, and internationally‑ready marketplace integration pipeline.*

