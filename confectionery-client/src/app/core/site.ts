// Business details shown on the public site (home page + footer).
// Placeholder values: replace them with the real ones.

export const SITE = {
  name: 'Dolce',
  tagline: 'קונדיטוריה בוטיק',
  phone: '03-1234567',
  email: 'hello@dolce.co.il',
  address: 'רחוב הדוגמה 12, תל אביב',
  instagram: 'dolce.patisserie',
  kosher: 'כשר חלבי בהשגחת הרבנות',
  hours: [
    { days: 'א׳–ה׳', time: '08:00–19:00' },
    { days: 'ו׳', time: '07:30–14:00' },
    { days: 'שבת', time: 'סגור' },
  ],
  /** Short promises shown in the hero and the scrolling strip. */
  highlights: ['עבודת יד', 'חמאה אמיתית', 'אפייה יומית', 'חומרי גלם טריים', 'הזמנות לאירועים'],
  about: {
    title: 'מטבח קטן, הרבה סבלנות',
    paragraphs: [
      'התחלנו במטבח ביתי, עם מתכונים שעברו אצלנו במשפחה ותנור אחד שעבד שעות נוספות.',
      'היום אנחנו עדיין אופים בכמויות קטנות, כל בוקר מחדש, עם חמאה אמיתית, שוקולד איכותי ופירות העונה. בלי קיצורי דרך.',
    ],
    signature: 'הצוות של Dolce',
  },
  /** Questions customers ask before ordering. */
  faq: [
    { q: 'כמה זמן מראש צריך להזמין?', a: 'רוב המאפים מוכנים תוך יום-יומיים. לעוגות מעוצבות ולאירועים גדולים כדאי להזמין לפחות שבוע מראש.' },
    { q: 'יש אפשרות לכיתוב או לעיצוב אישי?', a: 'כן. כותבים בהערות של ההזמנה מה תרצו, ונחזור אליכם לתאם את הפרטים.' },
    { q: 'מה לגבי אלרגיות ורגישויות?', a: 'כל המאפים מכילים גלוטן, חלב וביצים, וחלקם אגוזים. ציינו רגישות בהערות ונבדוק מה אפשר להתאים.' },
    { q: 'איך מקבלים את ההזמנה?', a: 'אוספים מהקונדיטוריה בתאריך שבחרתם. משלוח אפשר לתאם בטלפון, בתוספת תשלום לפי האזור.' },
    { q: 'איך משלמים?', a: 'התשלום הוא באיסוף, במזומן, באשראי או בביט. אנחנו לא גובים מראש דרך האתר.' },
  ],
} as const;

/** Stock photos (Unsplash) in public/images: replace with your own photos under the same names. */
export const PHOTOS = {
  hero: 'images/hero.jpg',
  about: 'images/about.jpg',
  menuBanner: 'images/menu-banner.jpg',
  cta: 'images/cta.jpg',
  gallery: ['images/gallery-1.jpg', 'images/gallery-2.jpg', 'images/gallery-3.jpg', 'images/gallery-4.jpg'],
} as const;
