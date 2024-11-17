import React, { useRef, useState } from "react";
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
import { IBrandDetails } from "@/types/profile.dto";
import Image from "next/image";
import { Trash2Icon } from "lucide-react";
import { useProfileMutation } from "@/hooks/mutations/profile-mutation";

interface BrandFromProps {
  brandDetails?: IBrandDetails;
  closeModal?: () => void;
}

export default function Brand({ brandDetails, closeModal }: BrandFromProps) {
  const { mutate, isPending } = useProfileMutation();
  const docRef = useRef<HTMLInputElement>(null);
  const [selectedDoc, setSelectedDoc] = useState<File | undefined>();
  const form = useForm<z.infer<typeof brandFormSchema>>({
    resolver: zodResolver(brandFormSchema),
    mode: "onChange",
    defaultValues: {
      brand_name: brandDetails?.brand_name || "",
      brand_logo: undefined,
    },
  });

  const handleRemoveDoc = () => {
    form.setValue("brand_logo", undefined);
    setSelectedDoc(undefined);
  };

  const onSubmit = async (data: z.infer<typeof brandFormSchema>) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value as any);
    }

    mutate(formData);
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
              name="brand_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name</FormLabel>
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

            <div className="w-full p-4 border space-y-3 rounded-lg">
              <FormField
                control={form.control}
                name="brand_logo"
                render={({
                  field: { value, ref, onChange, ...fieldProps },
                }) => (
                  <FormItem>
                    <FormControl>
                      <div className="rounded-xl border border-dashed border-[#F3A847] p-10">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <Image
                            src="/image-add.svg"
                            width={50}
                            height={50}
                            alt="doc icon"
                          />
                          <div className="space-x-1 text-center flex items-center text-sm ">
                            <p className="font-medium">
                              Drop your image here, or
                            </p>
                            <Button
                              size="sm"
                              variant="link"
                              className=" text-[#F3A847]"
                              type="button"
                              onClick={() => docRef.current?.click()}
                            >
                              Browse
                            </Button>
                          </div>

                          <input
                            type="file"
                            ref={docRef}
                            {...fieldProps}
                            className="hidden"
                            accept=".png, .jpg, .jpeg, .webp"
                            onChange={(e) => {
                              if (e.target.files) {
                                setSelectedDoc(e.target.files[0]);
                                onChange(e.target.files[0]);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedDoc && (
                <div className="space-y-1 pt-2">
                  <div className="rounded-xl border border-neutral-200 px-3 py-2">
                    <div className="flex items-start justify-between space-x-3 text-sm text-neutral-500">
                      <div className="flex items-center space-x-2">
                        <Image
                          src={"/image-add.svg"}
                          width={40}
                          height={40}
                          alt="doc icon"
                        />
                        <div className="text-sm">
                          <p className="w-80 truncate font-medium">
                            {selectedDoc.name}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveDoc}
                        className="mt-2"
                      >
                        <Trash2Icon className="h-4 w-4 text-neutral-500" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
