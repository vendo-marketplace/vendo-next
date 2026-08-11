import React from "react";

const ForgotPasswordPage = () => {
  return (
    <div className="flex flex-col gap-6 flex-1 justify-center items-center">
      <div className="w-120 space-y-6 ">
        <div className="space-y-1">
          <h1 className="text-[24px] leading-7.5 font-semibold text-neutral-950">
            Забули свій пароль?
          </h1>
          <p className="text-[16px] leading-6 font-normal text-neutral-400">
            Введіть свою електронну пошту, і ми надішлемо вам посилання для
            скидання пароля.
          </p>
        </div>
        <div>form</div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
