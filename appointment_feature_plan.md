# Appointment Booking Feature — Implementation Plan

The appointment feature is the **final feature** of this demo clinics platform. It enables patients (role: `user` / `patient`) to reserve available slots from a clinic's profile page, while admin can fully manage appointments (CRUD), and `doctor` / `reception` roles have read-only access.

## User Review Required

> **Appointment status lifecycle** — The API body you provided has no `status` field. The existing skeleton `appointmentsApi.ts` defines statuses `scheduled | completed | cancelled`. Should we assume the backend manages `status` internally (defaults to `scheduled` on create), or should the admin be able to set/change the status from the UI?

> **Patient identification** — When a patient reserves a slot, should `patientId` be auto-filled from the logged-in user's JWT (`authUser.id`), or does the API require a separate patient record ID? Currently, the auth token stores `id` and `role`. The plan assumes we use `authUser.id` as `patientId`.

> **Delete/Edit permissions** — You mentioned admin can delete/edit, reception and doctor can read. Can reception also _create_ appointments on behalf of walk-in patients, or is creation strictly patient-self-service? The plan below assumes **only patients create (self-reserve) and admin can CRUD**.

## Open Questions

1. Does the backend return any appointment response shape we should be aware of (e.g., nested `data` wrapper, populated `clinicId`/`patientId` as objects)? The plan includes a robust normalizer like the existing clinic/user ones to handle both cases. 
2. Should the "My Appointments" page for patients show all-time history or only upcoming? The plan defaults to showing all with a filter.
3. Does the backend support any query params for filtering appointments (e.g., `?clinicId=`, `?status=`)? The plan does client-side filtering as a safe default.

---

## Proposed Changes

### Appointment Types & Normalization

#### [NEW] `src/features/appointments/types/appointment.ts`

Define the TypeScript interfaces matching the API contract:

```ts
export type AppointmentStatus = "scheduled" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  clinicId: string;
  patientId: string;
  appointmentDate: string;   // "YYYY-MM-DD"
  startTime: string;         // "HH:mm"
  endTime: string;           // "HH:mm"
  notes?: string;
  status: AppointmentStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAppointmentPayload {
  clinicId: string;
  patientId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export type UpdateAppointmentPayload = Partial<CreateAppointmentPayload>;
```

#### [NEW] `src/features/appointments/lib/normalize.ts`

Robust normalizer following the exact same pattern as `features/clinics/lib/normalize.ts` — unwraps `{ data: ... }` wrappers, handles `_id` → `id`, coerces types safely.

---

### RTK Query API Slice

#### [MODIFY] `src/features/appointments/appointmentsApi.ts`

**Complete rewrite** of the existing skeleton. The current file only has `getAppointments`. Expand to full CRUD:

| Endpoint | Method | URL | Tag behavior |
|---|---|---|---|
| `getAppointments` | `GET` | `/appointments` | Provides `Appointment:LIST` |
| `getAppointmentById` | `GET` | `/appointments/{id}` | Provides `Appointment:{id}` |
| `createAppointment` | `POST` | `/appointments` | Invalidates `Appointment:LIST` + relevant `Clinic:SLOTS-*` |
| `updateAppointment` | `PATCH` | `/appointments/{id}` | Invalidates `LIST` + `{id}` |
| `deleteAppointment` | `DELETE` | `/appointments/{id}` | Invalidates `LIST` + `{id}` |

**Key detail**: After a successful `createAppointment`, we also invalidate the clinic's available-slots cache so the slot grid instantly reflects the booking.

---

### Zod Validation Schema

#### [NEW] `src/features/appointments/schemas/appointmentFormSchema.ts`

Validates the booking payload before submission. Used by the admin edit form and the patient reservation confirmation dialog.

---

### Auth & Role Hooks

#### [NEW] `src/features/auth/hooks/useUserRole.ts`

Returns the current user's role string. Enables the appointment components to branch on `admin | doctor | reception | patient | user`. Follows the same pattern as `useIsAdmin.ts`.

---

### UI Components

#### Patient Booking Flow (Clinic Profile → Slots Tab)

##### [MODIFY] `src/features/clinics/components/ClinicSlotsTab.tsx`

- Make **available** slot chips **clickable** for users with role `user` or `patient`.
- On click, open a `BookSlotConfirmationDialog` pre-filled with the clinic ID, selected date, and the slot's `startTime` / `endTime`.
- Admin/doctor/reception see slots as read-only (current behavior preserved).
- Available slots get a `cursor-pointer` + hover ring animation; unavailable ones stay `line-through` and non-interactive.
- Pass `clinicId` and `clinicName` down to the dialog.

##### [NEW] `src/features/appointments/components/BookSlotConfirmationDialog.tsx`

A confirmation dialog (`AlertDialog` from shadcn) shown when a patient clicks an available slot:

- Displays: clinic name, date, time range.
- Optional `<Textarea>` for notes (e.g., "First consultation").
- "Confirm Booking" primary CTA fires `createAppointment` mutation.
- On success: toast notification + dialog closes + slot cache invalidated (auto-refreshes the grid).
- On error: inline error message.

---

#### Admin Appointment Management

##### [NEW] `src/features/appointments/components/AppointmentsManagementPage.tsx`

Full admin management page at `/dashboard/appointments` — mirrors the structure of `ClinicsManagementPage.tsx`:

- Summary card (total / upcoming / completed / cancelled counts).
- `AppointmentsTable` with columns: Patient, Clinic, Date, Time, Status, Actions.
- Admin gets Edit and Delete actions.
- Doctor/reception see the table read-only (no action column).
- Patient sees only their own appointments (filtered by `patientId === authUser.id`).

##### [NEW] `src/features/appointments/components/AppointmentsTable.tsx`

TanStack React Table implementation following the pattern in `ClinicsTable.tsx` and `UsersTable.tsx`.

##### [NEW] `src/features/appointments/components/AppointmentStatusBadge.tsx`

Color-coded badge: `scheduled` → teal/accent, `completed` → green/success, `cancelled` → muted/line-through.

##### [NEW] `src/features/appointments/components/EditAppointmentDialog.tsx`

Admin-only dialog to edit appointment date, time, and notes. Uses `react-hook-form` + the Zod schema.

##### [NEW] `src/features/appointments/components/DeleteAppointmentDialog.tsx`

Admin-only destructive confirmation dialog — follows the pattern of `DeleteClinicDialog.tsx`.

---

### Barrel Export

#### [NEW] `src/features/appointments/index.ts`

Re-exports all hooks, types, and components from the appointments feature module.

---

### Routing

#### [NEW] `src/app/[locale]/dashboard/appointments/page.tsx`

Route page that renders `<AppointmentsManagementPage />`. Follows the exact pattern of `clinics/page.tsx`.

---

### Navigation

#### [MODIFY] `src/components/layout/navbar/nav-links.ts`

Add the `Appointments` link to the navbar:

```diff
+import { CalendarCheck } from "lucide-react";
 
 export const NAV_LINKS: NavLinkItem[] = [
   { href: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
   { href: "/dashboard/clinics", labelKey: "clinics", icon: Building2 },
+  { href: "/dashboard/appointments", labelKey: "appointments", icon: CalendarCheck },
   { href: "/dashboard/users", labelKey: "users", icon: Users },
   { href: "/dashboard/profile", labelKey: "viewProfile", icon: User },
 ];
```

Update the `NavLinkItem` `href` and `labelKey` union types to include the new values.

---

### Internationalization

#### [MODIFY] `messages/en.json`

Add a new `"appointments"` top-level key with all strings for:
- Page title/subtitle
- Table column headers
- Status labels
- Booking confirmation dialog strings
- Edit/delete dialog strings
- Validation errors
- Toast messages
- Empty/loading/error states

Also add `"appointments": "Appointments"` inside the `"nav"` section.

#### [MODIFY] `messages/ar.json`

Arabic translations for all the above keys.

---

## File Summary

| Action | Path | Purpose |
|---|---|---|
| NEW | `features/appointments/types/appointment.ts` | TypeScript interfaces |
| NEW | `features/appointments/lib/normalize.ts` | API response normalizer |
| MODIFY | `features/appointments/appointmentsApi.ts` | Full CRUD RTK Query slice |
| NEW | `features/appointments/schemas/appointmentFormSchema.ts` | Zod validation |
| NEW | `features/auth/hooks/useUserRole.ts` | Role accessor hook |
| MODIFY | `features/clinics/components/ClinicSlotsTab.tsx` | Make slots clickable for patients |
| NEW | `features/appointments/components/BookSlotConfirmationDialog.tsx` | Patient booking dialog |
| NEW | `features/appointments/components/AppointmentsManagementPage.tsx` | Dashboard page |
| NEW | `features/appointments/components/AppointmentsTable.tsx` | Table component |
| NEW | `features/appointments/components/AppointmentStatusBadge.tsx` | Status badge |
| NEW | `features/appointments/components/EditAppointmentDialog.tsx` | Admin edit dialog |
| NEW | `features/appointments/components/DeleteAppointmentDialog.tsx` | Admin delete dialog |
| NEW | `features/appointments/index.ts` | Barrel exports |
| NEW | `app/[locale]/dashboard/appointments/page.tsx` | Route page |
| MODIFY | `components/layout/navbar/nav-links.ts` | Add nav link |
| MODIFY | `messages/en.json` | English translations |
| MODIFY | `messages/ar.json` | Arabic translations |

---

## Verification Plan

### Automated Tests
- `npm run build` — confirm zero TypeScript errors and successful production build.
- Manual browser testing of the full booking flow:
  1. Login as `user`/`patient` → navigate to a clinic → Slots tab → click available slot → confirm booking → verify toast + slot disappears from available list.
  2. Login as `admin` → navigate to `/dashboard/appointments` → verify table shows all appointments → edit one → delete one.
  3. Login as `doctor`/`reception` → verify `/dashboard/appointments` shows read-only table (no action buttons).
  4. Verify Arabic locale renders correctly with RTL layout.

### Manual Verification
- Test responsive behavior at mobile / tablet / desktop breakpoints.
- Verify dark mode styling for all new components.
- Confirm the nav link appears and highlights correctly for all roles.
