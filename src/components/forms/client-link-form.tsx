"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { clientLinkSchema } from "@/lib/form-schemas";
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

import { useGetClientLink } from "@/hooks/mutations/clients-mutations";

interface ClientFormProps {
  client_link: string;
}

export const ClientLinkForm = ({ client_link }: ClientFormProps) => {
  const { mutate, isPending } = useGetClientLink();
  const form = useForm<z.infer<typeof clientLinkSchema>>({
    resolver: zodResolver(clientLinkSchema),
    mode: "onChange",
    defaultValues: {
      client_link: client_link,
      name: "",
      phone: "",
      email: "",
      location: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof clientLinkSchema>) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form
        className="mt-4 mx-auto max-w-md w-full rounded-xl bg-white p-3 sm:p-5 font-workSans"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col lg:flex-row justify-between w-full gap-12">
          <div className="w-full space-y-4 p-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel> Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      name="name"
                      type="text"
                      className="w-full"
                      placeholder="Victor Bello"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel> Email Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      name="email"
                      type="text"
                      className="w-full"
                      required
                      placeholder="bellovictorr@gmail.com"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel> Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      name="phone"
                      type="text"
                      className="w-full"
                      placeholder="09134453323"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Your Location </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      name="location"
                      type="text"
                      className="w-full"
                      required
                      placeholder="5BC, Lekki"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="mt-4 w-full">
          <Button type="submit" className="w-full" disabled={isPending}>
            Proceed to checkout
          </Button>
        </div>
      </form>
    </Form>
  );
};
