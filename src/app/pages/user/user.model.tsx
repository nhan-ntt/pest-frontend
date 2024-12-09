export type UserModel = {
  _id: string;
  code: string;
  fullName: string;
  username: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  state: string;
  dateOfBirth: string;
  encryptedPrivateKey: string;
  role: object;
  gender: string;
  isActive: boolean;
  isBanned: boolean;
};
