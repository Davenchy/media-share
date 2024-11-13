import * as MediaAPI from "@/lib/api/media_api"
import { Controller, useForm } from "react-hook-form"
import type {
  Control,
  FieldErrors,
  SubmitHandler,
  UseFormRegister,
} from "react-hook-form"
import { FieldErrorView } from "./FieldErrorView"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { Textarea } from "./ui/textarea"
import { useUser } from "@/hooks/use-user"
import { useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { OK, ValidationError } from "@/lib/api/api"
import type { IMedia } from "@/lib/api/api"

interface IMediaEditForm {
  caption: string
  isPrivate: boolean
}

function MediaEditForm({
  register,
  errors,
  control,
}: {
  control: Control<IMediaEditForm>
  register: UseFormRegister<IMediaEditForm>
  errors: FieldErrors<IMediaEditForm>
}) {
  return (
    <div className="py-2 px-4 mx-auto w-full max-w-screen-md space-y-4">
      <div className="space-y-2">
        <div className="space-x-2 flex items-center">
          <Label htmlFor="private">Is Private Moment:</Label>
          <Controller
            name="isPrivate"
            control={control}
            render={({ field }) => (
              <Switch
                id="private"
                checked={field.value || false}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
        <FieldErrorView error={errors.isPrivate?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="caption">Caption</Label>
        <Textarea
          id="caption"
          placeholder="Describe the moment"
          {...register("caption", {
            maxLength: {
              value: 300,
              message: "Caption is too long, maximum is 300",
            },
          })}
        />
        <FieldErrorView error={errors.caption?.message} />
      </div>
    </div>
  )
}

export function MediaEditDialog({
  media,
  children,
}: { media: IMedia; children: React.ReactNode }) {
  const { token } = useUser()
  const { toast } = useToast()
  const [isDialogOpened, setDialogOpenState] = useState(false)
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<IMediaEditForm>({
    values: { caption: media.caption, isPrivate: media.isPrivate },
  })

  const onSubmit: SubmitHandler<IMediaEditForm> = async data => {
    const res = await MediaAPI.updateMedia(
      token,
      media.id,
      data.caption,
      data.isPrivate,
    )

    if (res instanceof ValidationError) {
      for (const [key, message] of res.toPairs())
        control.setError(key, { message })
      return
    }

    const isUpdated = res instanceof OK
    if (isUpdated) {
      await queryClient.refetchQueries({ queryKey: ["media"] })
      setDialogOpenState(false)
    }

    toast({
      title: isUpdated ? "Moment updated" : "Moment update failed",
      description: isUpdated
        ? "Your moment has been saved"
        : "Something went wrong!",
      duration: 3000,
      variant: isUpdated ? "success" : "destructive",
    })
  }

  return (
    <Dialog open={isDialogOpened} onOpenChange={setDialogOpenState}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit your moment</DialogTitle>
          <DialogDescription>
            Missed expressing your moment last time? No problem – you can do it
            now!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <MediaEditForm
            control={control}
            register={register}
            errors={errors}
          />
          <DialogFooter className="mt-4">
            <Button type="submit" disabled={isSubmitting}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
