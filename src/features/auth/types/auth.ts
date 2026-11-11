export type LoginCredentials = {
  email: string;
  password: string;
};

export type ForgotPasswordCredentials = Pick<LoginCredentials, "email">;

export type ResetPasswordCredentials = {
  code: string;
  password: string;
};

export type AccountCompletionCredentials = {
  fullName: string;
};

export type GoogleLoginCredentials = {
  authCode: string;
};

export type UserRole = "USER" | "ADMIN";

export type MeResponse = {
  id: string;
  email: string;
  emailVerified: boolean;
  status: string;
  roles: UserRole[];
  providerType: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
};
