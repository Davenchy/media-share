import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { z } from "zod"
// import { Switch } from "ui/switch"
import { Input } from "ui/input"
import { Label } from "ui/label"

import * as AuthAPI from "@/lib/api/auth_api"
import * as API from "@/lib/api/api"

import { FieldErrorView } from "@/components/FieldErrorView"
import { FormCard } from "./common"
import { login } from "@/hooks/use-user"

export const LoginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters long"),
})

type ILoginForm = z.infer<typeof LoginSchema>

export function LoginForm({ toggleForm }: { toggleForm: () => void }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { isLoading, errors },
  } = useForm<ILoginForm>({
    resolver: zodResolver(LoginSchema),
  })

  const onSubmit: SubmitHandler<ILoginForm> = data => {
    AuthAPI.login(data.email, data.password).then(res => {
      if (res instanceof API.LoginSuccess) {
        login(res.token)
      } else if (res instanceof API.ValidationError) {
        // use form controller to set validation errors returned by server
        for (const [key, message] of res.toPairs())
          control.setError(key, { message })
      } else if (res instanceof API.InvalidCredentialsError) {
        // indicate credentials error
        control.setError("root", {
          message: "Email or password is incorrect",
        })
      } else if (res instanceof API.UnexpectedError) {
        // indicate server error
        control.setError("root", {
          message: "We have some problems, try again later!",
        })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormCard
        title="Login"
        submitLabel="Login"
        toggleLabel="Create Account"
        toggleAction={toggleForm}
        isLoading={isLoading}
      >
        <FieldErrorView error={errors.root?.message} />
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
        {/* <div className="flex items-center gap-x-4">
          <Label htmlFor="remember">Remember me!</Label>
          <Switch id="remember" />
        </div> */}
      </FormCard>
    </form>
  )
}
