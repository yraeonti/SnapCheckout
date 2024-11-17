import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Building2, User, CreditCard } from "lucide-react";
import { bankFormSchema } from "@/lib/form-schemas";
import { IAccountDetails } from "@/types/profile.dto";
import { useProfileMutation } from "@/hooks/mutations/profile-mutation";

interface BankInformationFormPros {
  bankInformation?: IAccountDetails;
  closeModal?: () => void;
}
export default function BankInformation({
  bankInformation,
  closeModal,
}: BankInformationFormPros) {
  const { mutate, isPending } = useProfileMutation(closeModal);
  const form = useForm<z.infer<typeof bankFormSchema>>({
    resolver: zodResolver(bankFormSchema),
    defaultValues: {
      account_name: bankInformation?.account_name || "",
      account_number: bankInformation?.account_number || "",
      bank_name: bankInformation?.bank_name || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof bankFormSchema>) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(values)) {
      formData.append(key, value as any);
    }

    mutate(formData);
  };

  const bankFields = [
    {
      name: "account_name" as const,
      label: "Account Holder Name",
      placeholder: "Enter account holder name",
      description: "Name as it appears on your bank account",
      icon: <User className="h-4 w-4" />,
    },
    {
      name: "account_number" as const,
      label: "Account Number",
      placeholder: "Enter account number",
      description: "Your bank account number",
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      name: "bank_name" as const,
      label: "Bank Name",
      placeholder: "Enter bank name",
      description: "Name of your banking institution",
      icon: <Building2 className="h-4 w-4" />,
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Bank Account Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {bankFields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      {field.icon} {field.label}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...formField}
                        placeholder={field.placeholder}
                        type={
                          field.name === "account_number" ? "number" : "text"
                        }
                      />
                    </FormControl>
                    <FormDescription>{field.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <div className="flex gap-4">
              <Button type="submit" className="w-full" disabled={isPending}>
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
