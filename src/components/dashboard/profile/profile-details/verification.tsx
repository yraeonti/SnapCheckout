"use client";

import { FormModal } from "@/components/modals/form-modal";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { KYBFormSchema } from "@/lib/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { VerifiedIcon } from "lucide-react";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";

export const BusinessVerification = () => {
  const [openModal, setOpenModal] = useState(false);
  const form = useForm<z.infer<typeof KYBFormSchema>>({
    resolver: zodResolver(KYBFormSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: z.infer<typeof KYBFormSchema>) => {
    console.log(data);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Brand Verification</CardTitle>
      </CardHeader>
      <CardContent>
        We will verify your brand information and and give you a verified tag.
        <VerifiedIcon className=" font-bold fill-black text-white" />
      </CardContent>

      <CardFooter>
        <Button onClick={() => setOpenModal(true)} className="w-full">
          Verify Business
        </Button>
      </CardFooter>

      <FormModal
        title="Verify Your Brand"
        openModal={openModal}
        setOpenModal={() => setOpenModal(false)}
      >
        <div className="w-full max-w-2xl mx-auto p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your brand name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your store's public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessRN"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Registration Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your registration number"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your store's public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cacRegDocument"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CAC REG DOC</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            field.onChange(e.target.files[0]); // Manually set the file
                          }
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your store's public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="utilityBill"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Utility Bill</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            field.onChange(e.target.files[0]); // Manually set the file
                          }
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your store's public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="houseAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>House Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your house address"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your store's public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          </Form>
        </div>
      </FormModal>
    </div>
  );
};
