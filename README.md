# LET — Learn Earn Teach

Owner: Aman

## What is included
This is a full-stack Next.js + Prisma architecture for LET with:
- Google OAuth via Auth.js
- Neon PostgreSQL via Prisma
- Admin password gate at `/admin`
- User profile API
- Batch CRUD APIs
- Grant/revoke access APIs
- Batch sections/items/notifications APIs
- Cloudinary upload API
- Private conversation/message APIs
- Tutor content API
- WhatsApp purchase/enquiry links
- Responsive UI and supplied logo

## Important deployment steps

### 1. Install
```bash
npm install
```

### 2. Create `.env.local`
Copy `.env.example` and fill all credentials.

### 3. Neon
Create a Neon PostgreSQL database and set `DATABASE_URL`.

### 4. Prisma
```bash
npx prisma db push
```

### 5. Run
```bash
npm run dev
```

### 6. Google OAuth
In Google Cloud Console:
- Create a project
- Configure OAuth consent screen
- Create OAuth Client ID → Web application
- Add `http://localhost:3000`
- Add callback:
  `http://localhost:3000/api/auth/callback/google`
For Render, add your production domain and:
`https://YOUR-DOMAIN/api/auth/callback/google`

### 7. Cloudinary
Create account → Dashboard/API Keys:
- Cloud Name
- API Key
- API Secret

### 8. Render
Push repository to GitHub.
Create a Render Web Service.
Build command:
`npm install && npm run build`
Start command:
`npm start`

Add all `.env.example` variables in Render.

## Security
Never commit `.env.local`.
Never expose OAuth secrets, Cloudinary API secret, database URL or admin password.

## Future Android app
This web app can later be wrapped using Capacitor.
