"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tailspin } from "ldrs/react";
import "ldrs/react/Tailspin.css";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreatePlaylist } from "@/hooks/user/create-playlist";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const createPlaylistSchema = z.object({
  name: z.string().min(1, "Playlist name is required"),
  description: z.string().optional(),
});

type CreatePlaylistFormValues = z.infer<typeof createPlaylistSchema>;

export default function CreatePlaylist() {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const createPlaylist = useCreatePlaylist();

  const handleCloseDialog = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setTimeout(() => router.back(), 300);
    }
  };

  const form = useForm<CreatePlaylistFormValues>({
    resolver: zodResolver(createPlaylistSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(values: CreatePlaylistFormValues) {
    createPlaylist.mutate(values, {
      onSuccess: () => {
        handleCloseDialog(false);
      },
      onError: (error) => {
        form.setError("root", {
          message: error.message || "Failed to create playlist",
        });
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="w-sm">
        <DialogHeader>
          <DialogTitle>Create Playlist</DialogTitle>
          <DialogDescription>
            Give your playlist a name and optional description.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center items-center h-full">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full  space-y-4"
          >
            <FieldSet>
              <FieldTitle className="sr-only text-2xl text-center">
                Create Playlist
              </FieldTitle>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <FieldContent>
                    <Input
                      className="border-none"
                      id="name"
                      disabled={createPlaylist.isPending}
                      placeholder="My Playlist"
                      {...form.register("name")}
                      aria-invalid={!!form.formState.errors.name}
                    />
                  </FieldContent>
                  <FieldError>{form.formState.errors.name?.message}</FieldError>
                </Field>

                <Field>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <FieldContent>
                    <Input
                      className="border-none"
                      id="description"
                      disabled={createPlaylist.isPending}
                      placeholder="Optional description"
                      {...form.register("description")}
                    />
                  </FieldContent>
                  <FieldDescription>Optional</FieldDescription>
                </Field>
              </FieldGroup>
            </FieldSet>

            {form.formState.errors.root && (
              <p className="text-sm text-center text-red-500 font-medium p-3 bg-red-500/10 rounded-md">
                {form.formState.errors.root.message}
              </p>
            )}

            <Button
              type="submit"
              disabled={createPlaylist.isPending}
              className="w-full"
            >
              {createPlaylist.isPending ? (
                <>
                  Creating...
                  <Tailspin size="15" stroke="3" speed="1" color="black" />
                </>
              ) : (
                "Create Playlist"
              )}
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              disabled={createPlaylist.isPending}
              onClick={() => handleCloseDialog(false)}
            >
              Cancel
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
