export type LoginCredentials = {
  email: string;
  password: string;
};

export type ForgotPasswordCredentials = Pick<LoginCredentials, "email">;

export type GoogleLoginCredentials = {
  idToken: string;
};

export type LoginResponse = {
  "access-token": string;
  "refresh-token": string;
};

export type RefreshResponse = {
  "access-token": string;
  "refresh-token": string;
};

export type MeResponse = {
  id: string;
  email: string;
  emailVerified: boolean;
  status: string;
  roles: string[];
  providerType: string;
  birthDate: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
};
