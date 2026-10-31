# Dolce – Angular client for Clean.API

Angular 21 frontend (standalone components, signals, zoneless) for the `Clean` .NET API.
The UI is in Hebrew (RTL) and has dark and light themes.

## Running

1. Start the API on the `http` profile (port 5096):
   ```
   cd ../Clean/Clean.API
   dotnet run --launch-profile http
   ```
2. Start the client:
   ```
   npm install
   npm start
   ```
3. Open http://localhost:4200. Staff login ("כניסת צוות"): `test` / `password`.

During `ng serve`, calls to `/api` go through `proxy.conf.mjs` to the API, so you don't need CORS.
To use a different address, for example the https profile:
```
$env:API_URL="https://localhost:7126"; npm start
```

## Structure

There are two parts:

| Part | Routes | Who can use it |
|---|---|---|
| Public site | `/`, `/menu` | Everyone. The menu shows only name and price (`GET api/Recipe/catalog`), and orders are sent to `POST api/Order/public`. |
| Staff area | `/admin`, `/admin/recipes`, `/admin/orders`, `/admin/clients` | Signed-in staff only (`authGuard` here, `[Authorize]` in the API). |

The items in a customer order are saved as text in `Order.notes` (migration `AddOrderNotes`).

```
src/app/
  core/            models, config, interceptors + guard (http.ts), helpers (format.ts)
    services/      CrudService base, Recipe/Order/Client services, Auth, Toast/Confirm/Theme
  shared/          Icon, Modal, ToastHost, ConfirmDialog
  pages/           home + menu (public), login, dashboard + recipes + orders + clients (staff)
```

- JWT: the token is saved in localStorage and added to every `/api` request. A 401 response sends the user back to the login page.

## פרטי העסק ותמונות

- **פרטי העסק** (טלפון, כתובת, שעות פתיחה, כשרות, אינסטגרם, טקסט "הסיפור שלנו"): `src/app/core/site.ts`. כרגע אלה ערכים לדוגמה.
- **תמונות:** `public/images/`. אלה תמונות מ-Unsplash (מותרות לשימוש חופשי). כדי להחליף, שומרים תמונה משלכם באותו שם קובץ.
- **איורי המאפים** נבחרים לפי מילים בשם המתכון (עוגיות, קרואסון, פאי, מוס, עוגת גבינה…): `src/app/shared/pastry.ts`.
