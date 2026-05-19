# Local Development

Status: Active
Last updated: 2026-05-19

## Start Command

From the repository root:

```bash
npm run dev
```

This runs:

- Backend: `npm --prefix backend run dev`
- Frontend: `npm --prefix frontend start`

The root launcher sets `DANGEROUSLY_DISABLE_HOST_CHECK=true` for the frontend process. This is a local-only Create React App workaround for webpack-dev-server host validation when the app uses the `proxy` field.

## Backend Database

Local development currently uses MongoDB Atlas, not a local MongoDB daemon.

Expected backend dev behavior:

- `backend/package.json` runs `dotenv -e .env -v NODE_ENV=development -- nodemon index.js`
- `backend/.env` provides `MONGODB_URI_DEV`
- `backend/config/index.js` chooses `MONGODB_URI_DEV` when `NODE_ENV=development`

You do not need `mongod` installed for the default local workflow.

## Local Admin Login

The local default admin credentials in `backend/.env` are:

```text
Email: admin@localhost.dev
Password: admin123
```

If an admin already exists in the development database, startup seeding will not overwrite it. To force the development admin account to match the local defaults, run:

```bash
npm --prefix backend run reset-dev-admin
```

This script refuses to run when `NODE_ENV=production`.

## Known Startup Issues

### MongoDB Connection Error

If the backend logs `MongoDB disconnected` and `MongoDB connection error`, check:

- `backend/.env` includes `MONGODB_URI_DEV`
- Atlas allows your current IP address
- The Atlas username/password in the URI are still valid
- Network access is available from the shell you are using

### Frontend `allowedHosts[0]` Error

If Create React App / webpack-dev-server reports:

```text
options.allowedHosts[0] should be a non-empty string
```

run the app through the root launcher:

```bash
npm run dev
```

The launcher passes `DANGEROUSLY_DISABLE_HOST_CHECK=true` to the frontend process.

## WSL Note

This repo lives under the Windows filesystem when accessed from WSL (`/mnt/c/...`). Node file watching can be very slow there. For faster WSL development, clone the repo into the Linux filesystem, for example `~/dev/horsey`. Otherwise, running from native Windows is reasonable.
