# Show "Entdecker Safaris" on the Google sign-in screen

## Why Lovable appears now

Google sign-in currently uses Lovable's shared (managed) Google OAuth app. Google always shows the name of the OAuth app that requests access, so the consent screen reads Lovable, not Entdecker Safaris. No code change on the site can rename it — the name comes from Google's side.

The only way to show your own company name is to register your own Google OAuth app for entdeckersafaris.com and point the sign-in at it.

## What needs to happen

1. You (or I, guiding you step by step) create a Google Cloud project and configure its OAuth consent screen:
   - App name: `Entdecker Safaris`
   - Support email: `info@entdeckersafaris.com`
   - App logo: the transparent Entdecker logo already used on the site
   - Authorized domains: `entdeckersafaris.com`, `lovable.app`
   - Scopes: `openid`, `userinfo.email`, `userinfo.profile`
2. Create an OAuth Client ID (type: Web application) and add the callback URL shown in the backend's Google provider settings as an authorized redirect URI.
3. Paste the Client ID and Client Secret into the backend auth settings for the Google provider (Users → Authentication Settings → Sign In Methods → Google). From that moment the consent screen shows "Entdecker Safaris" with your logo.
4. I verify sign-in and sign-up still work end to end from the site (`/auth`) and fix anything that breaks.

## Notes

- Until Google verifies the app (needed only if you request sensitive scopes — these basic ones usually don't), Google may show an "unverified app" notice for accounts outside your own. With just email/profile scopes this is normally not triggered.
- No changes to the site's sign-in code are required: the existing Google button keeps working, it simply talks to your OAuth app instead of the shared one.
- Nothing else on the site changes: email/password sign-in, admin area, and the rest of the pages are untouched.

## If you'd rather not do the Google Cloud setup

We keep the shared credentials and the consent screen keeps saying Lovable. Sign-in itself works fine — it's purely a branding difference.
