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

export default function BankInformation() {
  const form = useForm<z.infer<typeof bankFormSchema>>({
    resolver: zodResolver(bankFormSchema),
    defaultValues: {
      accountHolderName: "",
      accountNumber: "",
      bankName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof bankFormSchema>) => {
    try {
      console.log("Form values:", values);
      // Here you would typically send the data to your server
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const bankFields = [
    {
      name: "accountHolderName" as const,
      label: "Account Holder Name",
      placeholder: "Enter account holder name",
      description: "Name as it appears on your bank account",
      icon: <User className="h-4 w-4" />,
    },
    {
      name: "accountNumber" as const,
      label: "Account Number",
      placeholder: "Enter account number",
      description: "Your bank account number",
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      name: "bankName" as const,
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
                          field.name === "accountNumber" ? "number" : "text"
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
              <Button type="submit" className="w-full">
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
