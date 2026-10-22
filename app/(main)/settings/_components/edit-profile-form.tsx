"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { User, Loader2, Save } from "lucide-react"

import { IUser, GenderEnum } from "@/lib/types"
import { UpdateProfileSchema, UpdateProfileSchemaType } from "@/lib/schemas/auth.schema"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ErrorComponent } from "@/components/shared/error-component"
import { useUpdateProfile } from "../_hooks/use-update-profile"

interface EditProfileFormProps {
  user: IUser
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const { updateProfile, isUpdating, error } = useUpdateProfile()

  const formattedDob = React.useMemo(() => {
    if (!user.dateOfBirth) return ""
    try {
      return new Date(user.dateOfBirth).toISOString().split("T")[0]
    } catch {
      return ""
    }
  }, [user.dateOfBirth])

  const form = useForm<UpdateProfileSchemaType>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      dateOfBirth: formattedDob,
      gender: user.gender === GenderEnum.Female ? GenderEnum.Female : GenderEnum.Male,
    },
  })

  const onSubmit = (values: UpdateProfileSchemaType) => {
    updateProfile({
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone || undefined,
      dateOfBirth: values.dateOfBirth,
      gender: values.gender,
    })
  }

  return (
    <Card className="border-border shadow-xs">
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="size-5 text-primary" aria-hidden="true" />
          <CardTitle className="text-lg font-bold font-heading text-foreground">
            Personal Details
          </CardTitle>
        </div>
        <CardDescription>
          Update your public profile details, contact information, and demographic info.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-xl" noValidate>
          {/* Names Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-firstName">First Name</Label>
              <Input
                id="edit-firstName"
                placeholder="John"
                disabled={isUpdating}
                className="min-h-11"
                aria-invalid={!!form.formState.errors.firstName}
                aria-describedby={form.formState.errors.firstName ? "edit-firstName-error" : undefined}
                {...form.register("firstName")}
              />
              {form.formState.errors.firstName && (
                <p id="edit-firstName-error" role="alert" className="text-xs font-medium text-destructive">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-lastName">Last Name</Label>
              <Input
                id="edit-lastName"
                placeholder="Doe"
                disabled={isUpdating}
                className="min-h-11"
                aria-invalid={!!form.formState.errors.lastName}
                aria-describedby={form.formState.errors.lastName ? "edit-lastName-error" : undefined}
                {...form.register("lastName")}
              />
              {form.formState.errors.lastName && (
                <p id="edit-lastName-error" role="alert" className="text-xs font-medium text-destructive">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Phone & Date of Birth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-phone">Phone Number (Egyptian)</Label>
              <Input
                id="edit-phone"
                type="tel"
                placeholder="01012345678"
                disabled={isUpdating}
                className="min-h-11"
                aria-invalid={!!form.formState.errors.phone}
                aria-describedby={form.formState.errors.phone ? "edit-phone-error" : undefined}
                {...form.register("phone")}
              />
              {form.formState.errors.phone && (
                <p id="edit-phone-error" role="alert" className="text-xs font-medium text-destructive">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-dob">Date of Birth</Label>
              <Input
                id="edit-dob"
                type="date"
                disabled={isUpdating}
                className="min-h-11"
                aria-invalid={!!form.formState.errors.dateOfBirth}
                aria-describedby={form.formState.errors.dateOfBirth ? "edit-dob-error" : undefined}
                {...form.register("dateOfBirth")}
              />
              {form.formState.errors.dateOfBirth && (
                <p id="edit-dob-error" role="alert" className="text-xs font-medium text-destructive">
                  {form.formState.errors.dateOfBirth.message}
                </p>
              )}
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-gender">Gender</Label>
            <Controller
              control={form.control}
              name="gender"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isUpdating}
                >
                  <SelectTrigger
                    id="edit-gender"
                    className="w-full min-h-11"
                    aria-invalid={!!form.formState.errors.gender}
                    aria-describedby={form.formState.errors.gender ? "edit-gender-error" : undefined}
                  >
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={GenderEnum.Male}>Male</SelectItem>
                    <SelectItem value={GenderEnum.Female}>Female</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.gender && (
              <p id="edit-gender-error" role="alert" className="text-xs font-medium text-destructive">
                {form.formState.errors.gender.message}
              </p>
            )}
          </div>

          {error && <ErrorComponent errorMessage={error.message} />}

          <Button
            type="submit"
            className="w-full sm:w-auto min-h-11 font-semibold cursor-pointer"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" aria-hidden="true" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="size-4 mr-2" aria-hidden="true" />
                Save Details
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
