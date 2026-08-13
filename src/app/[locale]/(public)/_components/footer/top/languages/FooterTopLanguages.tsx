"use client";

import enFlag from "@/assets/flags/english.svg";
import uaFlag from "@/assets/flags/ukraine.svg";
import ImageSelect, {
  type ImageSelectOption,
} from "@/components/ui/image-select";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";

const languages: ImageSelectOption<Locale>[] = [
  { value: "en", label: "English", image: enFlag },
  { value: "uk", label: "Українська", image: uaFlag },
];

const FooterTopLanguageSelect = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("LocaleSwitcher");

  const changeLocale = (nextLocale: Locale) => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="flex w-36 items-center justify-end">
      <span className="sr-only">{t("label")}</span>
      <ImageSelect
        options={languages}
        value={locale}
        onChange={changeLocale}
      />
    </div>
  );
};

export default FooterTopLanguageSelect;
