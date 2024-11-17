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
import { Instagram, Twitter, Facebook } from "lucide-react";
import { socialsFormSchema } from "@/lib/form-schemas";
import { ISocialLinks } from "@/types/profile.dto";
import { useProfileMutation } from "@/hooks/mutations/profile-mutation";

interface SocialFormProps {
  socialLinks?: ISocialLinks;
  closeModal?: () => void;
}
export default function Socials({ socialLinks, closeModal }: SocialFormProps) {
  const { mutate, isPending } = useProfileMutation();
  const form = useForm({
    resolver: zodResolver(socialsFormSchema),
    defaultValues: {
      instagram: socialLinks?.instagram || "",
      twitter: socialLinks?.twitter || "",
      facebook: socialLinks?.facebook || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof socialsFormSchema>) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(values)) {
      formData.append(key, value as any);
    }

    mutate(formData);
  };

  const socialFields = [
    {
      name: "instagram",
      label: "Instagram Profile",
      placeholder: "https://instagram.com/yourusername",
      description: "Enter your Instagram profile URL",
      icon: <Instagram className="h-4 w-4" />,
    },
    {
      name: "twitter",
      label: "Twitter Profile",
      placeholder: "https://twitter.com/yourusername",
      description: "Enter your Twitter profile URL",
      icon: <Twitter className="h-4 w-4" />,
    },
    {
      name: "facebook",
      label: "Facebook Profile",
      placeholder: "https://facebook.com/yourusername",
      description: "Enter your Facebook profile URL",
      icon: <Facebook className="h-4 w-4" />,
    },
  ] as const;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Social Media Links</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {socialFields.map((field) => (
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
                      <Input placeholder={field.placeholder} {...formField} />
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
