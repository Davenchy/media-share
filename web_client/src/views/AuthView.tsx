import { LoginForm } from "@/components/auth_forms/LoginForm"
import { RegisterForm } from "@/components/auth_forms/RegisterForm"
import { useState } from "react"

export function AuthView() {
  const [isLoginForm, setIsLoginForm] = useState(true)

  const toggleForm = () => setIsLoginForm(s => !s)

  const form = isLoginForm ? (
    <LoginForm toggleForm={toggleForm} />
  ) : (
    <RegisterForm toggleForm={toggleForm} />
  )

  return (
    <div className="place-content-center h-lvh px-2">
      <div className="md:max-w-screen-sm mx-auto space-y-8">
        <p className="text-primary text-3xl md:text-6xl font-bold text-center">
          MediaShare
        </p>
        {form}
      </div>
    </div>
  )
}
