# BaaS Account Internal Transfer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add prototype-only internal fiat transfer flows between the Hong Kong trust account and the US account.

**Architecture:** Keep the flow local to `BaasOpeningPrototype.jsx` using existing state-driven pseudo-pages. Quick links set a transfer direction, the form collects currency and amount, a confirmation modal gates submission, and a local record list shows the pending Admin review item.

**Tech Stack:** React state, existing lucide icons, existing local `Button` and `Badge` UI components, Vite build, Browser verification.

---

### Task 1: Add Transfer State And Quick Link Entry Points

**Files:**
- Modify: `src/pages/BaasOpeningPrototype.jsx`

**Step 1: Define the failing browser behavior**

On `/admin/product-manual/baas-prototype/opening`, set demo status to `开户成功`.

Expected before implementation:
- Hong Kong trust quick links do not include `转账至美国账户`.
- US account quick links do not include `转账至香港账户`.

**Step 2: Add local transfer state**

Add state for:
- transfer page mode
- transfer direction
- submitted transfer records
- confirmation modal visibility

**Step 3: Pass transfer entry callbacks into `QuickActionDock`**

Hong Kong trust quick links call `onOpenInternalTransfer('trust-to-us')`.

US account quick links call `onOpenInternalTransfer('us-to-trust')`.

### Task 2: Build The Transfer Form Page

**Files:**
- Modify: `src/pages/BaasOpeningPrototype.jsx`

**Step 1: Add a local page component**

Create `InternalTransferPage` with:
- back button
- direction-sensitive title
- transfer summary cards
- currency select, default `USD`
- amount input
- fee display mode toggle: fixed or percentage
- submit button

**Step 2: Keep backend configuration language explicit**

Display `实际手续费以后台配置为准` near the fee section.

### Task 3: Add Confirmation And Record List

**Files:**
- Modify: `src/pages/BaasOpeningPrototype.jsx`

**Step 1: Add confirmation modal**

On submit, show direction, currency, amount, fee mode, and fee display.

**Step 2: Add local pending review record**

After confirmation, append a record with status `UNDER_REVIEW / 待后台审核` and navigate to the local record list.

**Step 3: Add record list page**

Show submitted records with transfer direction, currency, amount, fee, created time, and review status.

### Task 4: Verify

**Files:**
- Verify: `src/pages/BaasOpeningPrototype.jsx`

**Step 1: Run build**

Run: `pnpm run build`

Expected: build exits 0.

**Step 2: Browser verification**

Run the dev server and verify:
- Hong Kong trust quick link opens `转账至美国账户`.
- US quick link opens `转账至香港账户`.
- Fee mode toggles between fixed and percentage displays.
- Submit opens confirmation.
- Confirmation creates a pending Admin review record in the list.
