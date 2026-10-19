import { GenderEnum, ProviderEnum, RoleEnum } from "./enums"

export interface IUser {
  _id: string
  id?: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone?: string
  dateOfBirth?: string
  gender?: GenderEnum
  provider: ProviderEnum
  role: RoleEnum
  profilePicture?: string
  profileCoverPictures: string[]
  profileVisits?: number
  friends?: IUser[] | string[]
  twoFactorVerified: boolean
  emailConfirmedAt?: string
  createdAt: string
  updatedAt: string
}

export interface IPublicUser {
  _id: string
  firstName: string
  lastName: string
  fullName?: string
  profilePicture?: string
  profileVisits?: number
}

export interface AuthCredentials {
  access_token: string
  refresh_token: string
}

export interface LoginResponseData {
  access_token?: string
  refresh_token?: string
  twoFactorRequired?: boolean
}

export interface SignupDto {
  firstName: string
  lastName: string
  email: string
  password?: string
  confirmPassword?: string
  phone: string
  dateOfBirth: string // YYYY-MM-DD
  gender: GenderEnum
}

export interface LoginDto {
  email: string
  password?: string
  fcmToken?: string
}

export interface ConfirmEmailDto {
  email: string
  otp: string
}

export interface ResendConfirmEmailDto {
  email: string
}

export interface ForgotPasswordDto {
  email: string
  method?: "otp" | "link"
}

export interface VerifyOtpDto {
  email: string
  otp: string
}

export interface ResetPasswordDto {
  resetToken: string
  password?: string
  confirmPassword?: string
}

export interface ChangePasswordDto {
  oldPassword?: string
  newPassword?: string
  confirmNewPassword?: string
}

export interface LoginConfirmDto {
  email: string
  otp: string
}

export interface Enable2faDto {
  otp: string
}
