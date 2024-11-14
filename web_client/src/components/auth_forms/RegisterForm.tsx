import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { Input } from "ui/input"
import { Label } from "ui/label"
import { z } from "zod"

import { LoginSchema } from "./LoginForm"
import { FormCard } from "./common"
import { FieldErrorView } from "@/components/FieldErrorView"

import * as AuthAPI from "@/lib/api/auth_api"
import * as API from "@/lib/api/api"
import { useToast } from "@/hooks/use-toast"

const RegisterSchema = LoginSchema.extend({
  username: z
    .string({ message: "Username is required" })
    .min(3, "Username must be at least 3 characters long")
    .max(50, "Username must be at most 50 characters long"),
  password2: z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters long"),
})

type IRegisterForm = z.infer<typeof RegisterSchema>

export function RegisterForm({ toggleForm }: { toggleForm: () => void }) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    control,
    formState: { isLoading, errors },
  } = useForm<IRegisterForm>({
    resolver: zodResolver(RegisterSchema),
  })

  const onSubmit: SubmitHandler<IRegisterForm> = data => {
    if (data.password !== data.password2) {
      return control.setError("password2", {
        message: "Doesn't match with password",
      })
    }

    AuthAPI.register(data.username, data.email, data.password).then(res => {
      if (res instanceof API.OK) {
        toast({
          description: "Your account is ready, start sharing",
          title: "Registered Successfully",
          variant: "success",
        })
        toggleForm()
      } else if (res instanceof API.ValidationError) {
        // use form controller to set validation errors returned by the server
        for (const [key, message] of res.toPairs())
          control.setError(key, { message })
      } else if (res instanceof API.InvalidCredentialsError) {
        // set root error to indicated invalid credentials
        control.setError("root", {
          message: "Email or password is incorrect",
        })
      } else if (res instanceof API.EmailIsTaken) {
        // set root error to indicate server error
        control.setError("email", {
          message: "This email address is already taken",
        })
      } else if (res instanceof API.UnexpectedError) {
        // set root error to indicate server error
        control.setError("root", {
          message: "Having some problems, try again later!",
        })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormCard
        title="Register a new account"
        submitLabel="Register"
        toggleLabel="Already have an account?"
        toggleAction={toggleForm}
        isLoading={isLoading}
      >
        <FieldErrorView error={errors.root?.message} />
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            type="name"
            id="username"
            autoFocus
            {...register("username")}
          />
          <FieldErrorView error={errors.username?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" {...register("email")} />
          <FieldErrorView error={errors.email?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" {...register("password")} />
          <FieldErrorView error={errors.password?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password2">Repeat Password</Label>
          <Input type="password" id="password2" {...register("password2")} />
          <FieldErrorView error={errors.password2?.message} />
        </div>
      </FormCard>
    </form>
  )
}
