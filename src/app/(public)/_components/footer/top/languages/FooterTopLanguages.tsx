import { useState } from "react";

import enFlag from "@/assets/flags/english.svg";
import uaFlag from "@/assets/flags/ukraine.svg";
import Select, { SelectOption } from "@/components/ui/select";

type Language = "en" | "uk";

const languages: SelectOption<Language>[] = [
  { value: "en", label: "English", image: enFlag },
  { value: "uk", label: "Українська", image: uaFlag },
];

const FooterTopLanguageSelect = () => {
  const [language, setLanguage] = useState<Language>("en");

  return (
    <div className="flex w-36 items-center justify-end">
      <Select options={languages} value={language} onChange={setLanguage} />
    </div>
  );
};

export default FooterTopLanguageSelect;
