import FooterTopLogo from "@/app/[locale]/(public)/_components/footer/top/logo/FooterTopLogo";
import { UserIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input/input";
import AuthContentFooter from "./footer/AuthContentFooter";

const AuthContent = () => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex bg-green-400 flex-1 items-center justify-center">
        <div className="border w-120">
          <FooterTopLogo />
          <div className="flex flex-col w-full space-y-6">
            <div className="space-y-1">
              <p>Ласкаво просимо назад</p>
              <p>Увійдіть у свій аккаунт</p>
            </div>
            <div className="flex items-center justify-center">
              <Button className="flex-1">Вхід</Button>
              <Button className="flex-1">Реєстрація</Button>
            </div>
            <Input
              placeholder="Текст інпут"
              start={<UserIcon className="size-full " />}
            />
          </div>
        </div>
      </div>
      <AuthContentFooter />
    </div>
  );
};

export default AuthContent;
