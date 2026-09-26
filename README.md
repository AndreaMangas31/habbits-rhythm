This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

## Traducciones con Languager AI

La aplicación usa el SDK de Languager AI con español como idioma fuente. El selector fijo de la esquina superior derecha permite cambiar a español, inglés, francés, alemán o italiano; las cadenas del onboarding se traducen al cambiarlo.

1. Crea en Languager una clave **CLIENT** con el permiso `translations:read` y los orígenes permitidos de tu app (`http://localhost:3000` durante el desarrollo).
2. Crea una clave **SERVER** con `translations:create`, sin exponerla al navegador.
3. Copia `.env.example` a `.env.local` y completa las dos claves.

`LANGUAGER_API_KEY` solo se usa en `POST /api/languager/session`, que entrega tokens de sesión de diez minutos. `NEXT_PUBLIC_LANGUAGER_API_KEY` sí llega al navegador, por lo que debe ser la clave CLIENT restringida.

Si defines `NEXT_PUBLIC_LANGUAGER_API_URL` (por ejemplo para una API local), define también `LANGUAGER_BASE_URL` con la misma URL. Así los tokens de sesión se emiten y validan contra la misma API.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
