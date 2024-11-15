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
import { brandFormSchema } from "@/lib/form-schemas";

export default function Brand() {
  const form = useForm<z.infer<typeof brandFormSchema>>({
    resolver: zodResolver(brandFormSchema),
    mode: "onChange",
    defaultValues: {
      storeName: "",
      logo: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof brandFormSchema>) => {
    try {
      console.log("Form values:", data);
      // Here you would typically send the data to your server
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Brand Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="storeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your store name" {...field} />
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
              name="logo"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Store Logo</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-4">
                      <Input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(e) => {
                          onChange(e.target.files);
                        }}
                        {...field}
                      />
                      {value && value[0] && (
                        <img
                          src={URL.createObjectURL(value[0])}
                          alt="Logo preview"
                          className="w-32 h-32 object-contain"
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload your store logo (max 5MB, formats: JPG, PNG, WebP)
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
      </CardContent>
    </div>
  );
}
