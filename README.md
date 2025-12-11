# Portfolio (local development)

This repository contains a Vite + React portfolio site with a minimal file-backed API for dynamic project management.

Quick start

1. Install dependencies:

```bash
npm install
```

2. Seed project data (two options):

- Preferred (executes project module):
```bash
npm run seed
```
- Fallback (parses `src/utils/utils.js` as text; use when dependencies cause the module import to fail):
```bash
npm run seed:fallback
```

3. Start the API server:

```bash
npm run server
```

4. Start the frontend:

```bash
npm run dev
```

Open the site at `http://localhost:5173` (Vite default). Admin panel: `http://localhost:5173/admin`.

Admin notes

- Default admin key is in `server/config.json` as `adminKey`. On first server run the app will compute a PBKDF2-derived hash and write `adminHash` and `adminSalt` to `config.json`. Set a secure `adminKey` and change the `jwtSecret` before deploying to production.
- Admin authentication now uses a salted PBKDF2 hash stored in `server/config.json`. The login endpoint issues a signed JWT (`token`) which the admin UI stores in `localStorage` as `adminToken` and sends as `Authorization: Bearer <token>` for admin requests. The old `x-admin-key` header is still supported as a fallback.

API endpoints

- `GET /api/projects` — list projects
- `GET /api/projects/:title` — get project by title (URL-encoded)
- `POST /api/projects` — create project (requires admin auth: `Authorization: Bearer <token>` or `x-admin-key` header)
- `PUT /api/projects` — update project (requires admin auth)
- `DELETE /api/projects` — delete project (requires admin auth)

- `POST /api/uploads` — upload a file (image). Send the raw file as the request body and include header `x-filename: <original-name>`. Requires admin auth (Bearer token or `x-admin-key`). The response is JSON: `{ "url": "http://localhost:4000/uploads/<file>" }`.

- `GET /api/uploads/list` — list uploaded images and their generated sizes (requires admin auth). Response example:

```json
[
	{
		"name": "image.jpg",
		"timestamp": 1690000000000,
		"original": { "url": "http://localhost:4000/uploads/169...-image.jpg" },
		"optimized": { "url": "http://localhost:4000/uploads/169...-opt-image.jpg" },
		"thumb": { "url": "http://localhost:4000/uploads/169...-thumb-image.jpg" }
	}
]
```

Security & next steps

- This lightweight server is intended for local development only. For production use, move to a proper backend (Express/Next.js) and replace file storage with a database.
- I can add JWT-based authentication, hashed+salted passwords (bcrypt), image uploads, and better admin UX. Tell me which you'd like next.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
