import FooterTopLogo from "@/app/[locale]/(public)/_components/footer/top/logo/FooterTopLogo";
import AuthContentFooter from "./footer/AuthContentFooter";
import { Button } from "@/components/ui/button";

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
          </div>
        </div>
      </div>
      <AuthContentFooter />
    </div>
  );
};

export default AuthContent;
