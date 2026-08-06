export interface FooterNavigationColumnType {
  heading: string;
  links: { label: string; highlighted?: boolean }[];
}
export const FOOTER_NAVIGATION_COLUMNS: FooterNavigationColumnType[] = [
  {
    heading: 'Продавцям',
    links: [
      { label: 'Як почати продавати' },
      { label: 'AI-помічник для продавців', highlighted: true },
      { label: 'Тарифи та послуги' },
      { label: 'Реклама товарів' },
      { label: 'Правила для продавців' },
      { label: 'Партнерська програма' },
    ],
  },
  {
    heading: 'Покупцям',
    links: [
      { label: 'Особистий кабінет' },
      { label: 'Пошук товарів по фото' },
      { label: 'Розумний AI-пошук', highlighted: true },
      { label: 'Як оформити замовлення' },
      { label: 'Відстежити посилку' },
      { label: 'Гарантія та повернення' },
      { label: 'Безпечні покупки' },
      { label: 'Залишити відгук' },
    ],
  },
  {
    heading: 'Оплата та доставка',
    links: [
      { label: 'Безпечна онлайн-оплата' },
      { label: 'Оплата при отриманні' },
      { label: 'Visa та Mastercard' },
      { label: 'Доставка Новою Поштою' },
      { label: 'Доставка Укрпоштою' },
    ],
  },
  {
    heading: 'Про компанію',
    links: [
      { label: 'Про нас' },
      { label: 'Контакти' },
      { label: 'Наші технології ШІ', highlighted: true },
      { label: 'Новини та блог' },
      { label: 'Вакансії' },
    ],
  },
  {
    heading: 'Допомога та правила',
    links: [
      { label: 'AI-чат підтримки', highlighted: true },
      { label: 'Служба підтримки' },
      { label: 'Поширені запитання (FAQ)' },
      { label: 'Угода користувача' },
      { label: 'Політика конфіденційності' },
      { label: 'Повідомити про порушення' },
    ],
  },
] as const;
