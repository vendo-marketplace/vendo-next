import React from "react";

const ForgotPassword = () => {
  return (
    <div className="size-120 bg-red-400 mx-auto my-auto flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-neutral-950 text-[24px] leading-7.5 font-semibold">
          Забули свій пароль?
        </h1>
        <p className="text-neutral-400 text-[16px] leading-6 font-normal">
          Введіть свою електронну пошту, і ми надішлемо вам посилання для
          скидання пароля.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
