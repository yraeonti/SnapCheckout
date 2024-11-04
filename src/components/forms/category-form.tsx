"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { categorySchema } from "@/lib/form-schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { useRef, useState } from "react";

import { useCategoryMutation } from "@/hooks/mutations/category-mutations";

interface CategoryFormProps {
  closeModal: () => void;
}

export const CategoryForm = ({ closeModal }: CategoryFormProps) => {
  const { mutateAsync, isPending } = useCategoryMutation();
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    mode: "onChange",
    defaultValues: {
      category: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof categorySchema>) => {
    mutateAsync(data).then(() => closeModal());
  };

  return (
    <Form {...form}>
      <form
        className="mt-4 rounded-xl bg-white p-3 sm:p-5 font-workSans"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col lg:flex-row justify-between w-full gap-12">
          <div className="w-full space-y-4 p-4 border rounded-lg">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      name="category"
                      type="text"
                      className="w-full"
                      required
                      placeholder="construction"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="mt-4 flex  justify-end">
          <Button type="submit" disabled={isPending}>
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
};
