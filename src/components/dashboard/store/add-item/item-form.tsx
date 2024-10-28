"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { IStore } from "@/types/store.dto";
import { storeItemSchema } from "@/lib/form-schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRef, useState } from "react";
import { Trash2Icon, UploadIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCategories } from "@/hooks/mutations/category-mutations";
import { useStoreMutation } from "@/hooks/mutations/store-mutations";

export const ItemForm = ({ item }: { item?: IStore }) => {
  const { data: categories, isLoading } = useGetCategories();
  const { mutate, isPending } = useStoreMutation();
  const docRef = useRef<HTMLInputElement>(null);
  const [selectedDoc, setSelectedDoc] = useState<File | undefined>();
  const form = useForm<z.infer<typeof storeItemSchema>>({
    resolver: zodResolver(storeItemSchema),
    mode: "onChange",
    defaultValues: {
      item_name: item?.item_name || "",
      description: item?.description || "",
      item_price: item?.item_price || "",
      item_quantity: item?.item_quantity || 0,
      image: item?.image || undefined,
    },
  });

  const handleRemoveDoc = () => {
    form.setValue("image", undefined);
    setSelectedDoc(undefined);
  };

  const onSubmit = async (data: z.infer<typeof storeItemSchema>) => {
    const formData = new FormData();

    // Append all form fields to FormData
    formData.append("item_name", data.item_name);
    formData.append("description", data.description);
    formData.append("item_price", data.item_price.toString());
    formData.append("item_quantity", data.item_quantity.toString());
    formData.append("category_id", data.category);

    // Handle file upload
    if (selectedDoc) {
      formData.append("image", selectedDoc);
    }

    // If editing, append the ID
    // if (item?.id) {
    //   formData.append("id", item.id);
    // }

    // Send the FormData through the mutation
    mutate(formData);
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
              name="item_name"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      name="name"
                      type="text"
                      className="w-full"
                      required
                      placeholder="Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="item_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      name="1000"
                      type="string"
                      className="w-full"
                      required
                      placeholder="Price"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="item_quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => field.onChange(+e.target.value)}
                      name="item_quantity"
                      type="number"
                      className="w-full"
                      required
                      placeholder="Quantity"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      name="description"
                      className="w-full"
                      required
                      placeholder="Description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormControl>
                    <div className="w-full space-y-1">
                      <Label htmlFor="type">
                        Category
                        <span className="text-red">*</span>
                      </Label>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoading ? (
                            <p className="p-3 text-center">Loading...</p>
                          ) : (
                            categories?.length &&
                            categories?.map((category) => (
                              <SelectItem
                                key={category?.id}
                                value={category.id}
                              >
                                {category.category}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full p-4 border space-y-3 rounded-lg">
            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, ref, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormControl>
                    <div className="rounded-xl border border-dashed border-[#F3A847] p-10">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <Image
                          src="/image-add.svg"
                          width={100}
                          height={100}
                          alt="doc icon"
                        />
                        <div className="space-x-1 text-center flex items-center text-sm ">
                          <UploadIcon className="text-[#F3A847]" />
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
                        <p className="text-neutral-400">
                          Supported formats are JPG and PNG
                        </p>

                        <input
                          type="file"
                          ref={docRef}
                          {...fieldProps}
                          className="hidden"
                          accept=".png, .jpg, .jpeg,"
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
        </div>

        <div className="mt-4 flex  justify-end">
          <Button disabled={isPending} type="submit">
            {item ? "Update " : "Create"} Item
          </Button>
        </div>
      </form>
    </Form>
  );
};
