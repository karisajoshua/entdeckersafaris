# Sign-in in the menu, password visibility, Google sign-up

## 1. Sign-in link in the site header

- Add a session-aware affordance to `src/components/site-header.tsx` (desktop nav and mobile menu):
  - Signed out: a discreet "Sign In" link to `/auth`, placed next to the "Book Now" button.
  - Signed in: replace it with "Admin" (to `/admin`) plus "Sign Out".
- Session state comes from a small client-side hook using the existing auth client (`getUser()` on mount + `onAuthStateChange` for updates), so the header never shows "Sign In" to a signed-in user.
- Sign out clears cached data, signs out, and navigates to `/` .

## 2. Show / hide password

- On `src/routes/auth.tsx`, wrap the password input in a relative container with an eye / eye-off icon button on the right (Material Symbols `visibility` / `visibility_off`), toggling `type` between `password` and `text`.
- Button has `aria-label` ("Show password" / "Hide password") and `tabIndex` in the normal flow; styling matches the existing field borders.

## 3. Sign up with Google

- The auth page already has a "Continue with Google" button; in sign-up mode its label becomes "Sign up with Google" so it reads correctly (the same OAuth call handles both — Google creates the account on first sign-in).
- Enable the managed Google provider on the backend in the same change, so the first Google attempt does not fail with an unsupported-provider error. Email/password stays enabled.

## Technical notes

- New `src/hooks/use-session.tsx` (or inline hook in the header) holding `user | null`; single `onAuthStateChange` subscription, no new route guards.
- No database or schema changes; no changes to the protected route gate.
- Google provider enabled via the social-login configuration tool with managed credentials — nothing for you to set up manually.
