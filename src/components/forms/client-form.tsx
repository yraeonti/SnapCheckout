"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { clientSchema } from "@/lib/form-schemas";
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
import { IClient } from "@/types/client.dto";
import { useClientMutation } from "@/hooks/mutations/clients-mutations";

interface ClientFormProps {
  closeModal: () => void;
  client?: IClient;
}

export const ClientForm = ({ closeModal, client }: ClientFormProps) => {
  const { mutate, isPending } = useClientMutation(client?.id, closeModal);
  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    mode: "onChange",
    defaultValues: {
      name: client?.name || "",
      phone: client?.phone || "",
      email: client?.email || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof clientSchema>) => {
    const id = client?.id;

    if (!client) {
      mutate(data);
    } else {
      mutate({ ...data, id });
    }
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
              name="name"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      name="name"
                      type="text"
                      className="w-full"
                      required
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
                  <FormLabel>Client Email Address</FormLabel>
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
                  <FormLabel>Client Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      name="phone"
                      type="text"
                      className="w-full"
                      required
                      placeholder="09134453323"
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
          <Button disabled={isPending} type="submit">
            {client ? "Update " : "Create"} Client
          </Button>
        </div>
      </form>
    </Form>
  );
};
