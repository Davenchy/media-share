import { FieldErrorView } from "@/components/FieldErrorView"
import { ImageUp } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import type {
  Control,
  FieldErrors,
  SubmitHandler,
  UseFormRegister,
} from "react-hook-form"
import { Button } from "ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "ui/drawer"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import { Textarea } from "../ui/textarea"

import * as MediaAPI from "@/lib/api/media_api"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/hooks/use-user"

interface IUploaderForm {
  media: File[]
  caption: string
  isPrivate: boolean
}

function MediaUploaderContent({
  control,
  register,
  errors,
}: {
  control: Control<IUploaderForm>
  register: UseFormRegister<IUploaderForm>
  errors: FieldErrors<IUploaderForm>
}) {
  return (
    <div className="py-2 px-4 mx-auto w-full max-w-screen-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="media">Media</Label>
        <Input
          id="media"
          type="file"
          accept="image/png,image/jpg,image/jpeg,video/mp4"
          {...register("media", { required: "pick a media file first" })}
        />
        <p className="text-sm text-gray-500">
          Supported Files: Images(png, jpg, jpeg), Videos(mp4). Maximum Size:
          20MB
        </p>
        <FieldErrorView error={errors.media?.message} />
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
    </div>
  )
}

export function MediaUploader() {
  const [isOpen, setIsOpen] = useState(false)
  const { token } = useUser()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<IUploaderForm>()

  const onSubmit: SubmitHandler<IUploaderForm> = async data => {
    const files = data.media as File[]
    await MediaAPI.upload(token, files[0] as File, data.caption, data.isPrivate)
    setIsOpen(false)
    queryClient.refetchQueries({ queryKey: ["media"] })
    toast({
      description: "Media uploaded successfully",
      title: "Success",
      variant: "success",
      duration: 2000,
    })
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button className="fixed bottom-4 right-4 rounded-full" size="icon">
          <ImageUp />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Upload Media</DrawerTitle>
          <DrawerDescription>Share your moment</DrawerDescription>
        </DrawerHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <MediaUploaderContent
            register={register}
            errors={errors}
            control={control}
          />
          <DrawerFooter className="flex flex-row-reverse">
            <DrawerClose asChild>
              <Button variant="outline" disabled={isSubmitting}>
                Close
              </Button>
            </DrawerClose>
            <Button type="submit" disabled={isSubmitting}>
              Share
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
