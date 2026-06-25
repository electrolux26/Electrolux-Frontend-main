Azure AD (MSAL) Integration Setup
=================================

1) Install new dependencies:

```bash
npm install
```

The project package.json was updated to include `@azure/msal-browser` and `@azure/msal-react`.

2) Environment variables (create a `.env` file at project root):

- `VITE_AZURE_CLIENT_ID` - your Azure AD app (client) ID
- `VITE_AZURE_TENANT_ID` - your tenant id (or use `common`)
- `VITE_AZURE_AUTHORITY` - optional full authority URL (overrides tenant id)
- `VITE_AZURE_REDIRECT_URI` - optional redirect URI (defaults to app origin)

Example `.env`:

```
VITE_AZURE_CLIENT_ID=your-client-id-here
VITE_AZURE_TENANT_ID=your-tenant-id-here
VITE_AZURE_REDIRECT_URI=http://localhost:5173
```

3) Run the dev server:

```bash
npm run dev
```

Notes:
- The app uses `loginPopup` by default. For production or stricter browsers, consider using `loginRedirect`.
- See `src/authConfig.ts` and `src/context/AuthContext.tsx` for integration details.
