import { z } from "zod"
import { GenderEnum } from "@/lib/types"

// 1. Regular Expressions & Helper Functions

// Password regex: 8-30 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,30}$/

// Egyptian mobile phone regex: +20 or 0 prefix optional, starts with 10, 11, 12, or 15, followed by 8 digits
export const EGYPTIAN_PHONE_REGEX = /^(?:\+20|0)?1[0125]\d{8}$/

// One word Unicode letters, apostrophes or hyphens
export const SINGLE_WORD_NAME_REGEX = /^[\p{L}'-]+$/u

export function calculateAge(birthDate: Date): number {
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

// 2. Reusable General Fields

export const emailField = z
  .string()
  .trim()
  .email("Please enter a valid email address")

export const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(30, "Password must be at most 30 characters")
  .regex(
    PASSWORD_REGEX,
    "Password must be 8-30 characters with uppercase, lowercase, number, and special character"
  )

export const confirmPasswordField = z
  .string()
  .min(1, "Please confirm your password")

export const otpField = z
  .string()
  .length(6, "Code must be exactly 6 digits")
  .regex(/^\d+$/, "Code must contain numbers only")

export const egyptianPhoneField = z
  .string()
  .trim()
  .regex(
    EGYPTIAN_PHONE_REGEX,
    "Please enter a valid Egyptian mobile number (e.g. 01012345678)"
  )

export const nameField = (fieldName: string) =>
  z
    .string()
    .trim()
    .min(2, `${fieldName} must be at least 2 characters`)
    .max(50, `${fieldName} is too long`)
    .regex(SINGLE_WORD_NAME_REGEX, `${fieldName} must be a single word`)

export const birthDateField = z
  .string()
  .min(1, "Date of birth is required")
  .refine(
    (val) => {
      const date = new Date(val)
      return !isNaN(date.getTime()) && date <= new Date() && date >= new Date("1900-01-01")
    },
    { message: "Please enter a valid past birth date" }
  )
  .refine(
    (val) => {
      const date = new Date(val)
      return calculateAge(date) >= 13
    },
    { message: "You must be at least 13 years old to join Fakebook" }
  )

// 3. Feature Schemas

export const LoginSchema = z.object({
  email: emailField,
  password: z
    .string()
    .min(1, "Password is required")
    .regex(
      PASSWORD_REGEX,
      "Password must be 8-30 characters with uppercase, lowercase, number, and special character"
    ),
})

export const SignupSchema = z
  .object({
    firstName: nameField("First name"),
    lastName: nameField("Last name"),
    email: emailField,
    phone: egyptianPhoneField,
    dateOfBirth: birthDateField,
    gender: z.enum([GenderEnum.Male, GenderEnum.Female], {
      message: "Please select a gender",
    }),
    password: passwordField,
    confirmPassword: confirmPasswordField,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const ConfirmEmailSchema = z.object({
  email: emailField,
  otp: otpField,
})

export const ForgotPasswordSchema = z.object({
  email: emailField,
  method: z.enum(["otp", "link"]),
})

export const VerifyOtpSchema = z.object({
  email: emailField,
  otp: otpField,
})

export const ResetPasswordSchema = z
  .object({
    resetToken: z.string().min(1, "Reset token is missing or invalid"),
    password: passwordField,
    confirmPassword: confirmPasswordField,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const LoginConfirmSchema = z.object({
  email: emailField,
  otp: otpField,
})

// 4. Inferred Type Exports

export type LoginSchemaType = z.infer<typeof LoginSchema>
export type SignupSchemaType = z.infer<typeof SignupSchema>
export type ConfirmEmailSchemaType = z.infer<typeof ConfirmEmailSchema>
export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>
export type VerifyOtpSchemaType = z.infer<typeof VerifyOtpSchema>
export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>
export type LoginConfirmSchemaType = z.infer<typeof LoginConfirmSchema>
