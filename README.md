# 🌱 Agaram Foundation Web App (`agaramweb`)

Website application for managing **donations** and other oprations to the Agaram Foundation. Built using **Next.js App Router**, **TypeScript**, and **TailwindCSS** **HeroUI** with **PayU** **Razorpay** integration for seamless one-time and subscription payments. all are latest versions.
---

## 📁 Project Structure

```
agaramweb/
├─ app/
│  ├─ (public)/donate/           # Donation pages (UI)
│  ├─ api/payments/              # PayU API endpoints
│  ├─ components/                # Modular, reusable UI components
│  ├─ layout.tsx                 # Global layout for the app
│  └─ page.tsx                   # Home page
├─ lib/                          # Constants and shared logic
├─ public/assets/               # Static assets (logos, illustrations, SVGs)
├─ types/                       # TypeScript type declarations
├─ next.config.ts               # Next.js config
├─ globals.css                  # Global TailwindCSS
├─ tsconfig.json                # TS project config
└─ README.md                    # Project docs
```

---

## 🧪 Local Development Setup

### 1. **Install Dependencies**

```bash
npm install
# or
yarn install
```

### 2. **Create Local Environment File**

Make a `.env.local` file in the root:

```env
# PayU credentials
PAYU_MERCHANT_KEY=your_key
PAYU_MERCHANT_SALT=your_salt
PAYU_BASE_URL=https://secure.payu.in

# Application base
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

> Ensure PayU credentials are valid and not exposed publicly.

---

## 💳 Payment API Routes (Internal)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/payments/create-onetime` | `POST` | Create one-time payment session |
| `/api/payments/create-subscription` | `POST` | Create subscription billing |

Routes are secure and designed for server-side use only. These endpoints communicate with the PayU India Web SDK.

---

## 🧩 Key Components

Located inside `app/components/features/donations/`:

- `DonationCard.tsx`: Card for each donation type
- `DonationGrid.tsx`: Displays grid layout
- `DonationSection.tsx`: Full donation UI container
- `PaymentModal.tsx`: Modal for PayU payment form
- `KnowMoreModal.tsx`: Informational modal
- `SponsorshipSelector.tsx`: Option selector
- `SummaryBar.tsx`: Displays selected donation summary

### Other UI:

- `GrowTree.tsx`: Donation tree growth visual
- `Navbar.tsx`: App navigation bar
- `HeroSection.tsx`: Homepage hero component

---

## 🧾 Donation Constants

In `lib/constants/DonationConst.ts`, you'll find:

- Amount presets
- Sponsorship type definitions
- Static messages & limits

---

## 🏗 Build for Production

```bash
npm run build
npm run start
```

---

## 🧹 Useful Scripts

```bash
npm run lint      # ESLint
npm run format    # Prettier formatting
npm run dev       # Local dev server
```

---

## 🔐 Notes

- All types related to donation logic and PayU SDK are in `types/`
- Assets such as images, SVGs, and branding are in `public/assets/`

---

## 👨‍💻 Developer Notes

- Use `app/components/Providers.tsx` to inject global contexts
- TailwindCSS is fully set up in `globals.css`
- Next.js App Router layout (`app/layout.tsx`) is customized


```
agaramweb
├─ app
│  ├─ (public)
│  │  ├─ contact
│  │  │  └─ page.tsx
│  │  ├─ donate
│  │  │  ├─ layout.tsx
│  │  │  ├─ loading.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ response
│  │  │     └─ page.tsx
│  │  ├─ financials
│  │  │  └─ page.tsx
│  │  ├─ join-us
│  │  │  ├─ corporates
│  │  │  │  └─ page.tsx
│  │  │  ├─ donors
│  │  │  │  └─ page.tsx
│  │  │  ├─ educational-institutions
│  │  │  │  └─ page.tsx
│  │  │  ├─ foreign-donors
│  │  │  │  └─ page.tsx
│  │  │  └─ volunteers
│  │  │     └─ page.tsx
│  │  ├─ mob
│  │  │  ├─ contact
│  │  │  │  └─ page.tsx
│  │  │  ├─ donate
│  │  │  │  ├─ layout.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ donors
│  │  │  │  └─ page.tsx
│  │  │  ├─ educational_trust
│  │  │  │  └─ page.tsx
│  │  │  ├─ namadhu_palli
│  │  │  │  └─ page.tsx
│  │  │  ├─ our_mission
│  │  │  │  ├─ layout.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ partners
│  │  │  │  ├─ layout.tsx
│  │  │  │  └─ page.tsx
│  │  │  └─ yaadhum
│  │  │     └─ page.tsx
│  │  ├─ our_journey
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ our_mission
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ partners
│  │  │  ├─ layout.tsx
│  │  │  ├─ loading.tsx
│  │  │  └─ page.tsx
│  │  ├─ privacy_policy
│  │  │  └─ page.tsx
│  │  └─ terms_and_conditions
│  │     └─ page.tsx
│  ├─ api
│  │  ├─ corporates
│  │  │  └─ route.ts
│  │  ├─ donate
│  │  │  ├─ create
│  │  │  │  └─ route.ts
│  │  │  └─ subscription-success
│  │  │     └─ route.ts
│  │  ├─ donors
│  │  │  └─ route.tsx
│  │  ├─ educational-institutions
│  │  │  └─ route.tsx
│  │  ├─ foreign-donors
│  │  │  └─ route.ts
│  │  ├─ payments
│  │  │  ├─ create-subscription
│  │  │  │  └─ route.ts
│  │  │  ├─ onetime-razorpay
│  │  │  │  ├─ create
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ create-onetime
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ update-status
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ verify
│  │  │  │     └─ route.ts
│  │  │  └─ webhook
│  │  │     └─ route.ts
│  │  └─ volunteers
│  │     └─ route.ts
│  ├─ components
│  │  ├─ ClientLayout.tsx
│  │  ├─ donations
│  │  │  ├─ DonationCard.tsx
│  │  │  ├─ DonationGrid.tsx
│  │  │  ├─ DonationSection.tsx
│  │  │  ├─ KnowMoreModal.tsx
│  │  │  ├─ MonthlyPaymentModal.tsx
│  │  │  ├─ OneTimePaymentModal.tsx
│  │  │  ├─ SponsorshipSelector.tsx
│  │  │  ├─ SubscriptionSuccess.tsx
│  │  │  └─ SummaryBar.tsx
│  │  ├─ financials
│  │  │  └─ FinancialGrid.tsx
│  │  ├─ Footer.tsx
│  │  ├─ home
│  │  │  ├─ AboutSection.tsx
│  │  │  ├─ AgaramAchievers.tsx
│  │  │  ├─ CounterSection.tsx
│  │  │  ├─ FounderMessage.tsx
│  │  │  ├─ HeroSection.tsx
│  │  │  ├─ ProgramsGrid.tsx
│  │  │  ├─ SuccessStoriesSection.tsx
│  │  │  └─ VisionSection.tsx
│  │  ├─ join-us
│  │  │  ├─ CorporateForm.tsx
│  │  │  ├─ DonorForm.tsx
│  │  │  ├─ EducationalInstitutionForm.tsx
│  │  │  ├─ ForeignDonorForm.tsx
│  │  │  ├─ JoinUsLayout.tsx
│  │  │  └─ VolunteerFrom.tsx
│  │  ├─ journey
│  │  │  └─ TwoColumnHorizontalCarousel.tsx
│  │  ├─ mission
│  │  │  ├─ AboutSection.tsx
│  │  │  └─ TrusteeCards.tsx
│  │  ├─ Navbar.tsx
│  │  ├─ Others
│  │  │  └─ GrowTree.tsx
│  │  ├─ partners
│  │  │  ├─ CorporatePartners.tsx
│  │  │  ├─ PartnersCollegeCarousal.tsx
│  │  │  ├─ PartnerSections.tsx
│  │  │  └─ PartnersGrid.tsx
│  │  ├─ Providers.tsx
│  │  └─ UnderMaintenance.tsx
│  ├─ db
│  │  └─ donation.json
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ data
│  └─ partners.ts
├─ lib
│  ├─ constants
│  │  └─ DonationConst.ts
│  ├─ db.ts
│  ├─ hero.ts
│  └─ mongoose.ts
├─ models
│  ├─ Corporates.ts
│  ├─ Donation.ts
│  ├─ Donors.ts
│  ├─ EducationalInstitutions.ts
│  ├─ FailedSubscription.ts
│  ├─ ForeignDonors.ts
│  ├─ OnetimePayments.ts
│  ├─ SubscriptionPayment.ts
│  ├─ SuccessSubscription.ts
│  └─ Volunteers.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ assets
│  │  ├─ documents
│  │  │  ├─ financials
│  │  │  │  ├─ FRCA_2015-2016.pdf
│  │  │  │  ├─ FRCA_2016-2017.pdf
│  │  │  │  ├─ FRCA_2017-2018.pdf
│  │  │  │  ├─ FRCA_2018-2019.pdf
│  │  │  │  ├─ FRCA_2019-2020.pdf
│  │  │  │  ├─ FRCA_2020-2021.pdf
│  │  │  │  ├─ FRCA_2021-2022.pdf
│  │  │  │  ├─ FRCA_2022-2023.pdf
│  │  │  │  └─ FRCA_2023-2024.pdf
│  │  │  └─ servermail
│  │  │     ├─ agaram-stamp.avif
│  │  │     ├─ donation-signature.avif
│  │  │     └─ logo.avif
│  │  └─ images
│  │     ├─ achievers
│  │     │  ├─ alumni-min.png
│  │     │  ├─ arts-science-min.png
│  │     │  ├─ diploma-min.png
│  │     │  ├─ doctors-min.png
│  │     │  ├─ engineers-min.png
│  │     │  ├─ paramedics-min.png
│  │     │  └─ professional-courses-min.png
│  │     ├─ agaram-donation-image.webp
│  │     ├─ bg-video.jpg
│  │     ├─ bg-video.mp4
│  │     ├─ bg-video.webm
│  │     ├─ illustrations
│  │     │  └─ donate.webp
│  │     ├─ join-us
│  │     │  ├─ volunteers-banner.png
│  │     │  └─ volunteers.png
│  │     ├─ journey
│  │     │  ├─ journey_banner.png
│  │     │  ├─ our_journey(1).jpg
│  │     │  ├─ our_journey(10).jpg
│  │     │  ├─ our_journey(11).jpg
│  │     │  ├─ our_journey(12).jpg
│  │     │  ├─ our_journey(13).jpg
│  │     │  ├─ our_journey(14).jpg
│  │     │  ├─ our_journey(15).jpg
│  │     │  ├─ our_journey(2).jpg
│  │     │  ├─ our_journey(3).jpg
│  │     │  ├─ our_journey(4).jpg
│  │     │  ├─ our_journey(5).jpg
│  │     │  ├─ our_journey(6).jpg
│  │     │  ├─ our_journey(7).jpg
│  │     │  ├─ our_journey(8).jpg
│  │     │  └─ our_journey(9).jpg
│  │     ├─ logo
│  │     │  ├─ agaram_logo.png
│  │     │  ├─ agaram_logo.webp
│  │     │  ├─ secured_payments.webp
│  │     │  └─ ssl.webp
│  │     ├─ mission
│  │     │  ├─ founder-message.webp
│  │     │  └─ mission_banner.png
│  │     ├─ partners
│  │     │  ├─ amazon.png
│  │     │  ├─ amazon.webp
│  │     │  ├─ amphenol.png
│  │     │  ├─ amphenol_omniconnect_india_pvt_ltd.webp
│  │     │  ├─ antcorp_technologies_private_limited.png
│  │     │  ├─ aqr_capital_india_services_llp.png
│  │     │  ├─ bank_of_america.png
│  │     │  ├─ basilic_fly_studio_pvt_ltd.png
│  │     │  ├─ bnp.png
│  │     │  ├─ bnp.webp
│  │     │  ├─ bnp_paribas_india.png
│  │     │  ├─ bny.png
│  │     │  ├─ bny_mellon.png
│  │     │  ├─ ford.png
│  │     │  ├─ ford_motor_private_limited.png
│  │     │  ├─ gea_bgr_energy_system_india_limited.png
│  │     │  ├─ infinitesol.png
│  │     │  ├─ kaleesuwari_refinery_private_limited.png
│  │     │  ├─ kauvery_hospital.png
│  │     │  ├─ mrcooper.png
│  │     │  ├─ mr_cooper_group.png
│  │     │  ├─ nobi.png
│  │     │  ├─ Our Partners.txt
│  │     │  ├─ partner_banner.jpg
│  │     │  ├─ partner_default.png
│  │     │  ├─ ramraj_cotton.png
│  │     │  ├─ rrd.png
│  │     │  ├─ rr_donnelley.png
│  │     │  ├─ sagent_leading_technologies.png
│  │     │  ├─ sakthi_masala_private_limited.png
│  │     │  ├─ saravana_stores.png
│  │     │  ├─ sharpwire_industries_india_private_limited.png
│  │     │  ├─ shell.png
│  │     │  ├─ tekion_india_private_limited.png
│  │     │  ├─ w3global_india_private_limited.png
│  │     │  ├─ watertec_india_private_limited.png
│  │     │  ├─ woory.png
│  │     │  └─ zoho_corporations.png
│  │     ├─ programs
│  │     │  ├─ agaram_hostel.jpg
│  │     │  ├─ mentorship.jpg
│  │     │  ├─ namadhu_gramam.jpg
│  │     │  ├─ namadhu_palli.jpg
│  │     │  ├─ sivakumar_edu_trust.jpg
│  │     │  └─ vidhai.jpg
│  │     ├─ slider
│  │     │  ├─ agaram_slider_img_1.webp
│  │     │  └─ agaram_slider_img_2.webp
│  │     ├─ svg
│  │     │  ├─ bg.svg
│  │     │  └─ tree.svg
│  │     ├─ tree
│  │     │  ├─ tree-level-1.svg
│  │     │  ├─ tree-level-2.svg
│  │     │  ├─ tree-level-3.svg
│  │     │  ├─ tree-level-4.svg
│  │     │  └─ tree-level-5.svg
│  │     ├─ web-app-banner.png
│  │     ├─ web-app-manifest-192x192.png
│  │     └─ web-app-manifest-512x512.png
│  └─ site.webmanifest
├─ README.md
├─ references.txt
├─ tsconfig.json
└─ types
   ├─ canvas-confetti.d.ts
   ├─ DonationTypes.ts
   ├─ partners.ts
   └─ payu-websdk.d.ts

```
```
agaramweb
├─ app
│  ├─ (public)
│  │  ├─ contact
│  │  │  └─ page.tsx
│  │  ├─ donate
│  │  │  ├─ layout.tsx
│  │  │  ├─ loading.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ response
│  │  │     └─ page.tsx
│  │  ├─ financials
│  │  │  └─ page.tsx
│  │  ├─ join-us
│  │  │  ├─ corporates
│  │  │  │  └─ page.tsx
│  │  │  ├─ donors
│  │  │  │  └─ page.tsx
│  │  │  ├─ educational-institutions
│  │  │  │  └─ page.tsx
│  │  │  ├─ foreign-donors
│  │  │  │  └─ page.tsx
│  │  │  └─ volunteers
│  │  │     └─ page.tsx
│  │  ├─ mob
│  │  │  ├─ contact
│  │  │  │  └─ page.tsx
│  │  │  ├─ donors
│  │  │  │  └─ page.tsx
│  │  │  ├─ educational_trust
│  │  │  │  └─ page.tsx
│  │  │  ├─ namadhu_palli
│  │  │  │  └─ page.tsx
│  │  │  ├─ our_mission
│  │  │  │  ├─ layout.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ partners
│  │  │  │  ├─ layout.tsx
│  │  │  │  └─ page.tsx
│  │  │  └─ yaadhum
│  │  │     └─ page.tsx
│  │  ├─ our_journey
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ our_mission
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ partners
│  │  │  ├─ layout.tsx
│  │  │  ├─ loading.tsx
│  │  │  └─ page.tsx
│  │  ├─ privacy_policy
│  │  │  └─ page.tsx
│  │  ├─ tech
│  │  │  └─ internship
│  │  │     └─ page.tsx
│  │  ├─ terms_and_conditions
│  │  │  └─ page.tsx
│  │  └─ vidhai
│  │     └─ page.tsx
│  ├─ api
│  │  ├─ corporates
│  │  │  └─ route.ts
│  │  ├─ donate
│  │  │  ├─ create
│  │  │  │  └─ route.ts
│  │  │  └─ subscription-success
│  │  │     └─ route.ts
│  │  ├─ donors
│  │  │  └─ route.tsx
│  │  ├─ educational-institutions
│  │  │  └─ route.tsx
│  │  ├─ enquiry
│  │  │  └─ route.ts
│  │  ├─ foreign-donors
│  │  │  └─ route.ts
│  │  ├─ payments
│  │  │  ├─ create-subscription
│  │  │  │  └─ route.ts
│  │  │  ├─ onetime-razorpay
│  │  │  │  ├─ create
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ create-onetime
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ update-status
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ verify
│  │  │  │     └─ route.ts
│  │  │  └─ webhook
│  │  │     └─ route.ts
│  │  ├─ tech
│  │  │  └─ internship
│  │  │     └─ route.ts
│  │  └─ volunteers
│  │     └─ route.ts
│  ├─ components
│  │  ├─ ClientLayout.tsx
│  │  ├─ donations
│  │  │  ├─ DonationCard.tsx
│  │  │  ├─ DonationGrid.tsx
│  │  │  ├─ DonationSection.tsx
│  │  │  ├─ KnowMoreModal.tsx
│  │  │  ├─ MonthlyPaymentModal.tsx
│  │  │  ├─ OneTimePaymentModal.tsx
│  │  │  ├─ SponsorshipSelector.tsx
│  │  │  ├─ SubscriptionSuccess.tsx
│  │  │  └─ SummaryBar.tsx
│  │  ├─ financials
│  │  │  └─ FinancialGrid.tsx
│  │  ├─ Footer.tsx
│  │  ├─ home
│  │  │  ├─ AboutSection.tsx
│  │  │  ├─ AgaramAchievers.tsx
│  │  │  ├─ CounterSection.tsx
│  │  │  ├─ FounderMessage.tsx
│  │  │  ├─ HeroSection.tsx
│  │  │  ├─ ProgramsGrid.tsx
│  │  │  ├─ SuccessStoriesSection.tsx
│  │  │  └─ VisionSection.tsx
│  │  ├─ join-us
│  │  │  ├─ CorporateForm.tsx
│  │  │  ├─ DonorForm.tsx
│  │  │  ├─ EducationalInstitutionForm.tsx
│  │  │  ├─ ForeignDonorForm.tsx
│  │  │  ├─ JoinUsLayout.tsx
│  │  │  └─ VolunteerFrom.tsx
│  │  ├─ journey
│  │  │  └─ TwoColumnHorizontalCarousel.tsx
│  │  ├─ mission
│  │  │  ├─ AboutSection.tsx
│  │  │  └─ TrusteeCards.tsx
│  │  ├─ Navbar.tsx
│  │  ├─ Others
│  │  │  └─ GrowTree.tsx
│  │  ├─ partners
│  │  │  ├─ CorporatePartners.tsx
│  │  │  ├─ PartnersCollegeCarousal.tsx
│  │  │  ├─ PartnerSections.tsx
│  │  │  └─ PartnersGrid.tsx
│  │  ├─ Providers.tsx
│  │  └─ UnderMaintenance.tsx
│  ├─ db
│  │  └─ donation.json
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ data
│  ├─ DonationConst.ts
│  └─ partners.ts
├─ lib
│  ├─ db.ts
│  ├─ hero.ts
│  └─ mongoose.ts
├─ models
│  ├─ Corporates.ts
│  ├─ Donation.ts
│  ├─ Donors.ts
│  ├─ EducationalInstitutions.ts
│  ├─ Enquiry.ts
│  ├─ FailedSubscription.ts
│  ├─ ForeignDonors.ts
│  ├─ OnetimePayments.ts
│  ├─ SubscriptionPayment.ts
│  ├─ SuccessSubscription.ts
│  ├─ TechIntership.ts
│  └─ Volunteers.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ assets
│  │  ├─ documents
│  │  │  ├─ financials
│  │  │  │  ├─ FRCA_2015-2016.pdf
│  │  │  │  ├─ FRCA_2016-2017.pdf
│  │  │  │  ├─ FRCA_2017-2018.pdf
│  │  │  │  ├─ FRCA_2018-2019.pdf
│  │  │  │  ├─ FRCA_2019-2020.pdf
│  │  │  │  ├─ FRCA_2020-2021.pdf
│  │  │  │  ├─ FRCA_2021-2022.pdf
│  │  │  │  ├─ FRCA_2022-2023.pdf
│  │  │  │  └─ FRCA_2023-2024.pdf
│  │  │  └─ servermail
│  │  │     ├─ agaram-stamp.avif
│  │  │     ├─ donation-signature.avif
│  │  │     └─ logo.avif
│  │  └─ images
│  │     ├─ achievers
│  │     │  ├─ alumni-min.png
│  │     │  ├─ arts-science-min.png
│  │     │  ├─ diploma-min.png
│  │     │  ├─ doctors-min.png
│  │     │  ├─ engineers-min.png
│  │     │  ├─ paramedics-min.png
│  │     │  └─ professional-courses-min.png
│  │     ├─ agaram-donation-image.webp
│  │     ├─ bg-video.jpg
│  │     ├─ bg-video.mp4
│  │     ├─ bg-video.webm
│  │     ├─ join-us
│  │     │  ├─ volunteers-banner.png
│  │     │  └─ volunteers.png
│  │     ├─ journey
│  │     │  ├─ journey_banner.png
│  │     │  ├─ our_journey(1).jpg
│  │     │  ├─ our_journey(10).jpg
│  │     │  ├─ our_journey(11).jpg
│  │     │  ├─ our_journey(12).jpg
│  │     │  ├─ our_journey(13).jpg
│  │     │  ├─ our_journey(14).jpg
│  │     │  ├─ our_journey(15).jpg
│  │     │  ├─ our_journey(2).jpg
│  │     │  ├─ our_journey(3).jpg
│  │     │  ├─ our_journey(4).jpg
│  │     │  ├─ our_journey(5).jpg
│  │     │  ├─ our_journey(6).jpg
│  │     │  ├─ our_journey(7).jpg
│  │     │  ├─ our_journey(8).jpg
│  │     │  └─ our_journey(9).jpg
│  │     ├─ logo
│  │     │  ├─ agaram_alumni_association.webp
│  │     │  ├─ agaram_foundation_org.webp
│  │     │  ├─ agaram_logo.png
│  │     │  ├─ agaram_logo.webp
│  │     │  ├─ antcorp_technologies.webp
│  │     │  ├─ playstore.webp
│  │     │  ├─ secured_payments.webp
│  │     │  ├─ ssl.webp
│  │     │  └─ swiggy.webp
│  │     ├─ mission
│  │     │  ├─ founder-message.webp
│  │     │  ├─ mission_banner.png
│  │     │  └─ our_mission.webp
│  │     ├─ partners
│  │     │  ├─ amazon.png
│  │     │  ├─ amazon.webp
│  │     │  ├─ amphenol.png
│  │     │  ├─ amphenol_omniconnect_india_pvt_ltd.webp
│  │     │  ├─ antcorp_technologies_private_limited.png
│  │     │  ├─ aqr_capital_india_services_llp.png
│  │     │  ├─ bank_of_america.png
│  │     │  ├─ basilic_fly_studio_pvt_ltd.png
│  │     │  ├─ bnp.png
│  │     │  ├─ bnp.webp
│  │     │  ├─ bnp_paribas_india.png
│  │     │  ├─ bny.png
│  │     │  ├─ bny_mellon.png
│  │     │  ├─ ford.png
│  │     │  ├─ ford_motor_private_limited.png
│  │     │  ├─ gea_bgr_energy_system_india_limited.png
│  │     │  ├─ infinitesol.png
│  │     │  ├─ kaleesuwari_refinery_private_limited.png
│  │     │  ├─ kauvery_hospital.png
│  │     │  ├─ mrcooper.png
│  │     │  ├─ mr_cooper_group.png
│  │     │  ├─ nobi.png
│  │     │  ├─ Our Partners.txt
│  │     │  ├─ partner_banner.jpg
│  │     │  ├─ partner_default.png
│  │     │  ├─ ramraj_cotton.png
│  │     │  ├─ rrd.png
│  │     │  ├─ rr_donnelley.png
│  │     │  ├─ sagent_leading_technologies.png
│  │     │  ├─ sakthi_masala_private_limited.png
│  │     │  ├─ saravana_stores.png
│  │     │  ├─ sharpwire_industries_india_private_limited.png
│  │     │  ├─ shell.png
│  │     │  ├─ tekion_india_private_limited.png
│  │     │  ├─ w3global_india_private_limited.png
│  │     │  ├─ watertec_india_private_limited.png
│  │     │  ├─ woory.png
│  │     │  └─ zoho_corporations.png
│  │     ├─ programs
│  │     │  ├─ agaram_hostel.jpg
│  │     │  ├─ mentorship.jpg
│  │     │  ├─ namadhu_gramam.jpg
│  │     │  ├─ namadhu_palli.jpg
│  │     │  ├─ sivakumar_edu_trust.jpg
│  │     │  └─ vidhai.jpg
│  │     ├─ slider
│  │     │  ├─ agaram_slider_img_1.webp
│  │     │  └─ agaram_slider_img_2.webp
│  │     ├─ svg
│  │     │  ├─ bg.svg
│  │     │  └─ tree.svg
│  │     ├─ tree
│  │     │  ├─ tree-level-1.svg
│  │     │  ├─ tree-level-2.svg
│  │     │  ├─ tree-level-3.svg
│  │     │  ├─ tree-level-4.svg
│  │     │  └─ tree-level-5.svg
│  │     ├─ web-app-banner.png
│  │     ├─ web-app-manifest-192x192.png
│  │     └─ web-app-manifest-512x512.png
│  └─ site.webmanifest
├─ README.md
├─ references.txt
├─ tsconfig.json
└─ types
   ├─ canvas-confetti.d.ts
   ├─ DonationTypes.ts
   ├─ partners.ts
   └─ payu-websdk.d.ts

```
```
agaramweb
├─ app
│  ├─ (public)
│  │  ├─ contact
│  │  │  └─ page.tsx
│  │  ├─ donate
│  │  │  ├─ layout.tsx
│  │  │  ├─ loading.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ response
│  │  │     └─ page.tsx
│  │  ├─ financials
│  │  │  └─ page.tsx
│  │  ├─ join-us
│  │  │  ├─ corporates
│  │  │  │  └─ page.tsx
│  │  │  ├─ donors
│  │  │  │  └─ page.tsx
│  │  │  ├─ educational-institutions
│  │  │  │  └─ page.tsx
│  │  │  ├─ foreign-donors
│  │  │  │  └─ page.tsx
│  │  │  └─ volunteers
│  │  │     └─ page.tsx
│  │  ├─ mob
│  │  │  ├─ contact
│  │  │  │  └─ page.tsx
│  │  │  ├─ donors
│  │  │  │  └─ page.tsx
│  │  │  ├─ educational_trust
│  │  │  │  └─ page.tsx
│  │  │  ├─ namadhu_palli
│  │  │  │  └─ page.tsx
│  │  │  ├─ our_mission
│  │  │  │  ├─ layout.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ partners
│  │  │  │  ├─ layout.tsx
│  │  │  │  └─ page.tsx
│  │  │  └─ yaadhum
│  │  │     └─ page.tsx
│  │  ├─ our_journey
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ our_mission
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ partners
│  │  │  ├─ layout.tsx
│  │  │  ├─ loading.tsx
│  │  │  └─ page.tsx
│  │  ├─ privacy_policy
│  │  │  └─ page.tsx
│  │  ├─ profile
│  │  │  ├─ mytransactions
│  │  │  │  └─ page.tsx
│  │  │  └─ page.tsx
│  │  ├─ signup
│  │  │  └─ page.tsx
│  │  ├─ tech
│  │  │  └─ internship
│  │  │     └─ page.tsx
│  │  ├─ terms_and_conditions
│  │  │  └─ page.tsx
│  │  └─ vidhai
│  │     └─ page.tsx
│  ├─ api
│  │  ├─ auth
│  │  │  ├─ logout
│  │  │  │  └─ route.ts
│  │  │  ├─ refresh
│  │  │  │  └─ route.ts
│  │  │  ├─ revoke
│  │  │  │  └─ route.ts
│  │  │  ├─ send-otp
│  │  │  │  └─ route.ts
│  │  │  ├─ signup
│  │  │  │  └─ route.ts
│  │  │  └─ validate-otp
│  │  │     └─ route.ts
│  │  ├─ corporates
│  │  │  └─ route.ts
│  │  ├─ debug
│  │  │  └─ cookies
│  │  │     └─ route.ts
│  │  ├─ donate
│  │  │  ├─ create
│  │  │  │  └─ route.ts
│  │  │  └─ subscription-success
│  │  │     └─ route.ts
│  │  ├─ donors
│  │  │  └─ route.tsx
│  │  ├─ educational-institutions
│  │  │  └─ route.tsx
│  │  ├─ enquiry
│  │  │  └─ route.ts
│  │  ├─ foreign-donors
│  │  │  └─ route.ts
│  │  ├─ payments
│  │  │  ├─ create-subscription
│  │  │  │  └─ route.ts
│  │  │  ├─ list
│  │  │  │  └─ route.ts
│  │  │  ├─ onetime-razorpay
│  │  │  │  ├─ create
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ create-onetime
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ update-status
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ verify
│  │  │  │     └─ route.ts
│  │  │  ├─ transaction
│  │  │  │  └─ route.ts
│  │  │  └─ webhook
│  │  │     └─ route.ts
│  │  ├─ tech
│  │  │  └─ internship
│  │  │     ├─ resume
│  │  │     │  └─ [id]
│  │  │     │     └─ route.ts
│  │  │     └─ route.ts
│  │  ├─ user
│  │  │  └─ profile
│  │  │     └─ route.ts
│  │  └─ volunteers
│  │     └─ route.ts
│  ├─ components
│  │  ├─ ClientLayout.tsx
│  │  ├─ donations
│  │  │  ├─ DonationCard.tsx
│  │  │  ├─ DonationGrid.tsx
│  │  │  ├─ DonationSection.tsx
│  │  │  ├─ KnowMoreModal.tsx
│  │  │  ├─ MonthlyPaymentModal.tsx
│  │  │  ├─ OneTimePaymentModal.tsx
│  │  │  ├─ SponsorshipSelector.tsx
│  │  │  ├─ SubscriptionSuccess.tsx
│  │  │  └─ SummaryBar.tsx
│  │  ├─ financials
│  │  │  └─ FinancialGrid.tsx
│  │  ├─ Footer.tsx
│  │  ├─ home
│  │  │  ├─ AboutSection.tsx
│  │  │  ├─ AgaramAchievers.tsx
│  │  │  ├─ CounterSection.tsx
│  │  │  ├─ FounderMessage.tsx
│  │  │  ├─ HeroSection.tsx
│  │  │  ├─ ProgramsGrid.tsx
│  │  │  ├─ SuccessStoriesSection.tsx
│  │  │  └─ VisionSection.tsx
│  │  ├─ join-us
│  │  │  ├─ CorporateForm.tsx
│  │  │  ├─ DonorForm.tsx
│  │  │  ├─ EducationalInstitutionForm.tsx
│  │  │  ├─ ForeignDonorForm.tsx
│  │  │  ├─ JoinUsLayout.tsx
│  │  │  └─ VolunteerFrom.tsx
│  │  ├─ journey
│  │  │  └─ TwoColumnHorizontalCarousel.tsx
│  │  ├─ mission
│  │  │  ├─ AboutSection.tsx
│  │  │  └─ TrusteeCards.tsx
│  │  ├─ Navbar.tsx
│  │  ├─ Others
│  │  │  └─ GrowTree.tsx
│  │  ├─ partners
│  │  │  ├─ CorporatePartners.tsx
│  │  │  ├─ PartnersCollegeCarousal.tsx
│  │  │  ├─ PartnerSections.tsx
│  │  │  └─ PartnersGrid.tsx
│  │  ├─ Providers.tsx
│  │  └─ UnderMaintenance.tsx
│  ├─ db
│  │  └─ donation.json
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ data
│  ├─ DonationConst.ts
│  └─ partners.ts
├─ lib
│  ├─ auth
│  │  └─ refreshAgaram.ts
│  ├─ db.ts
│  ├─ hero.ts
│  └─ mongoose.ts
├─ models
│  ├─ Corporates.ts
│  ├─ Donation.ts
│  ├─ Donors.ts
│  ├─ EducationalInstitutions.ts
│  ├─ Enquiry.ts
│  ├─ FailedSubscription.ts
│  ├─ ForeignDonors.ts
│  ├─ OnetimePayments.ts
│  ├─ SubscriptionPayment.ts
│  ├─ SuccessSubscription.ts
│  ├─ TechIntership.ts
│  └─ Volunteers.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ assets
│  │  ├─ documents
│  │  │  ├─ financials
│  │  │  │  ├─ FRCA_2015-2016.pdf
│  │  │  │  ├─ FRCA_2016-2017.pdf
│  │  │  │  ├─ FRCA_2017-2018.pdf
│  │  │  │  ├─ FRCA_2018-2019.pdf
│  │  │  │  ├─ FRCA_2019-2020.pdf
│  │  │  │  ├─ FRCA_2020-2021.pdf
│  │  │  │  ├─ FRCA_2021-2022.pdf
│  │  │  │  ├─ FRCA_2022-2023.pdf
│  │  │  │  └─ FRCA_2023-2024.pdf
│  │  │  └─ servermail
│  │  │     ├─ agaram-stamp.avif
│  │  │     ├─ donation-signature.avif
│  │  │     └─ logo.avif
│  │  ├─ images
│  │  │  ├─ achievers
│  │  │  │  ├─ alumni-min.png
│  │  │  │  ├─ arts-science-min.png
│  │  │  │  ├─ diploma-min.png
│  │  │  │  ├─ doctors-min.png
│  │  │  │  ├─ engineers-min.png
│  │  │  │  ├─ paramedics-min.png
│  │  │  │  └─ professional-courses-min.png
│  │  │  ├─ agaram-donation-image.webp
│  │  │  ├─ bg-video.jpg
│  │  │  ├─ bg-video.mp4
│  │  │  ├─ bg-video.webm
│  │  │  ├─ join-us
│  │  │  │  ├─ volunteers-banner.png
│  │  │  │  └─ volunteers.png
│  │  │  ├─ journey
│  │  │  │  ├─ journey_banner.png
│  │  │  │  ├─ our_journey(1).jpg
│  │  │  │  ├─ our_journey(10).jpg
│  │  │  │  ├─ our_journey(11).jpg
│  │  │  │  ├─ our_journey(12).jpg
│  │  │  │  ├─ our_journey(13).jpg
│  │  │  │  ├─ our_journey(14).jpg
│  │  │  │  ├─ our_journey(15).jpg
│  │  │  │  ├─ our_journey(2).jpg
│  │  │  │  ├─ our_journey(3).jpg
│  │  │  │  ├─ our_journey(4).jpg
│  │  │  │  ├─ our_journey(5).jpg
│  │  │  │  ├─ our_journey(6).jpg
│  │  │  │  ├─ our_journey(7).jpg
│  │  │  │  ├─ our_journey(8).jpg
│  │  │  │  └─ our_journey(9).jpg
│  │  │  ├─ logo
│  │  │  │  ├─ agaram_alumni_association.webp
│  │  │  │  ├─ agaram_foundation_org.webp
│  │  │  │  ├─ agaram_logo.png
│  │  │  │  ├─ agaram_logo.webp
│  │  │  │  ├─ antcorp_technologies.webp
│  │  │  │  ├─ playstore.webp
│  │  │  │  ├─ secured_payments.webp
│  │  │  │  ├─ ssl.webp
│  │  │  │  └─ swiggy.webp
│  │  │  ├─ mission
│  │  │  │  ├─ founder-message.webp
│  │  │  │  ├─ mission_banner.png
│  │  │  │  └─ our_mission.webp
│  │  │  ├─ partners
│  │  │  │  ├─ amazon.png
│  │  │  │  ├─ amazon.webp
│  │  │  │  ├─ amphenol.png
│  │  │  │  ├─ amphenol_omniconnect_india_pvt_ltd.webp
│  │  │  │  ├─ antcorp_technologies_private_limited.png
│  │  │  │  ├─ aqr_capital_india_services_llp.png
│  │  │  │  ├─ bank_of_america.png
│  │  │  │  ├─ basilic_fly_studio_pvt_ltd.png
│  │  │  │  ├─ bnp.png
│  │  │  │  ├─ bnp.webp
│  │  │  │  ├─ bnp_paribas_india.png
│  │  │  │  ├─ bny.png
│  │  │  │  ├─ bny_mellon.png
│  │  │  │  ├─ ford.png
│  │  │  │  ├─ ford_motor_private_limited.png
│  │  │  │  ├─ gea_bgr_energy_system_india_limited.png
│  │  │  │  ├─ infinitesol.png
│  │  │  │  ├─ kaleesuwari_refinery_private_limited.png
│  │  │  │  ├─ kauvery_hospital.png
│  │  │  │  ├─ mrcooper.png
│  │  │  │  ├─ mr_cooper_group.png
│  │  │  │  ├─ nobi.png
│  │  │  │  ├─ Our Partners.txt
│  │  │  │  ├─ partner_banner.jpg
│  │  │  │  ├─ partner_default.png
│  │  │  │  ├─ ramraj_cotton.png
│  │  │  │  ├─ rrd.png
│  │  │  │  ├─ rr_donnelley.png
│  │  │  │  ├─ sagent_leading_technologies.png
│  │  │  │  ├─ sakthi_masala_private_limited.png
│  │  │  │  ├─ saravana_stores.png
│  │  │  │  ├─ sharpwire_industries_india_private_limited.png
│  │  │  │  ├─ shell.png
│  │  │  │  ├─ tekion_india_private_limited.png
│  │  │  │  ├─ w3global_india_private_limited.png
│  │  │  │  ├─ watertec_india_private_limited.png
│  │  │  │  ├─ woory.png
│  │  │  │  └─ zoho_corporations.png
│  │  │  ├─ programs
│  │  │  │  ├─ agaram_hostel.jpg
│  │  │  │  ├─ mentorship.jpg
│  │  │  │  ├─ namadhu_gramam.jpg
│  │  │  │  ├─ namadhu_palli.jpg
│  │  │  │  ├─ sivakumar_edu_trust.jpg
│  │  │  │  └─ vidhai.jpg
│  │  │  ├─ slider
│  │  │  │  ├─ agaram_slider_img_1.webp
│  │  │  │  └─ agaram_slider_img_2.webp
│  │  │  ├─ svg
│  │  │  │  ├─ bg.svg
│  │  │  │  └─ tree.svg
│  │  │  ├─ tree
│  │  │  │  ├─ tree-level-1.svg
│  │  │  │  ├─ tree-level-2.svg
│  │  │  │  ├─ tree-level-3.svg
│  │  │  │  ├─ tree-level-4.svg
│  │  │  │  └─ tree-level-5.svg
│  │  │  ├─ web-app-banner.png
│  │  │  ├─ web-app-manifest-192x192.png
│  │  │  └─ web-app-manifest-512x512.png
│  │  └─ resumes
│  │     └─ Vijayashankar-1759565012159-07376a2fda14.pdf
│  └─ site.webmanifest
├─ README.md
├─ references.txt
├─ tsconfig.json
└─ types
   ├─ canvas-confetti.d.ts
   ├─ DonationTypes.ts
   ├─ partners.ts
   └─ payu-websdk.d.ts

```