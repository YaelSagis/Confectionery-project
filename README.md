# Dolce · קונדיטוריה בוטיק

אתר לקונדיטוריה: חלק ציבורי שבו לקוחות רואים את התפריט ושולחים הזמנה, וממשק ניהול לצוות לניהול מתכונים, הזמנות ולקוחות.

## מבנה הפרויקט

| תיקייה | מה יש בה | טכנולוגיה |
|---|---|---|
| [`confectionery-client`](confectionery-client) | האתר: דף בית, תפריט והזמנה, ממשק ניהול | Angular 21, עברית (RTL), מצב בהיר וכהה |
| [`confectionery-backend`](confectionery-backend) | ה-API ובסיס הנתונים | ASP.NET Core 8, Entity Framework Core, SQL Server, JWT |

הבקנד בנוי בשכבות (Clean Architecture):

```
confectionery-backend/
  Clean.API       Controllers, Middleware, Program.cs
  Clean.Core      Entities, DTOs, ממשקים של Repositories ו-Services
  Clean.Data      DataContext, Repositories, Migrations
  Clean.Service   לוגיקה עסקית, AutoMapper, JWT
```

## מה אפשר לעשות באתר

**לקוחות:**
- לעיין בתפריט עם תמונות, תיאורים ומחירים, ולחפש בו.
- לפתוח מאפה לפרטים, להוסיף להזמנה ולבחור כמויות. הסל נשמר גם אחרי רענון.
- לשלוח הזמנה עם שם, טלפון, אימייל, תאריך והערות.

**צוות (אחרי כניסה):**
- לוח בקרה עם סיכום ההזמנות.
- מתכונים: הוספה, עריכה ומחיקה, כולל תמונה, מחיר, זמן הכנה, רמת קושי, מצרכים ואופן הכנה.
- הזמנות: מעקב לפי סטטוס (חדשה, בהכנה, מוכנה, נמסרה).
- לקוחות: רשימה ופרטי קשר.

## הרצה מקומית

דרישות: .NET 8 SDK, Node.js, SQL Server (למשל SQL Server Express).

1. **בסיס הנתונים:** מעדכנים את `ConnectionString` בקובץ `confectionery-backend/Clean.API/appsettings.Development.json`, ומריצים:
   ```
   cd confectionery-backend
   dotnet ef database update --project Clean.Data --startup-project Clean.API
   ```
2. **השרת** (פורט 5096):
   ```
   cd confectionery-backend/Clean.API
   dotnet run --launch-profile http
   ```
3. **האתר:**
   ```
   cd confectionery-client
   npm install
   npm start
   ```
4. פותחים את http://localhost:4200. כניסת צוות: `test` / `password`.

בזמן פיתוח, בקשות ל-`/api` עוברות לשרת דרך `proxy.conf.mjs`, ולכן לא צריך הגדרות CORS.

## העלאה לרנדר

הקובץ [`render.yaml`](render.yaml) מגדיר שני שירותים:
- `confectionery-backend`: השרת, נבנה מה-Dockerfile.
- `confectionery-client`: האתר, כאתר סטטי. בקשות ל-`/api` מועברות לשרת.

ב-Render: New ← Blueprint ← בוחרים את הריפו. משתני סביבה לשרת:
- `ConnectionString`: מחרוזת החיבור לבסיס נתונים SQL Server בענן.
- `Jwt__Key`: נוצר אוטומטית.

סודות לא נשמרים בריפו. המפתח שב-`appsettings.json` מיועד לפיתוח מקומי בלבד.
