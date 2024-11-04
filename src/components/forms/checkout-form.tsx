"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { checkoutItemSchema } from "@/lib/form-schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import { useCategoryMutation } from "@/hooks/mutations/category-mutations";
import { IClient } from "@/types/client.dto";
import { useGetStoreItems } from "@/hooks/mutations/store-mutations";
import { addCheckoutItemMutation } from "@/hooks/mutations/clients-mutations";

interface CheckoutItemFormProps {
  closeModal: () => void;
  client: IClient;
}

export const CheckoutForm = ({ closeModal, client }: CheckoutItemFormProps) => {
  const { data: products, isLoading } = useGetStoreItems();
  const { mutate, isPending } = addCheckoutItemMutation(closeModal);
  const form = useForm<z.infer<typeof checkoutItemSchema>>({
    resolver: zodResolver(checkoutItemSchema),
    mode: "onChange",
    defaultValues: {
      client_id: client.id,
      product_id: "",
      quantity: 1,
    },
  });

  const onSubmit = async (data: z.infer<typeof checkoutItemSchema>) => {
    mutate(data);
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
              name="product_id"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormControl>
                    <div className="w-full space-y-1">
                      <Label htmlFor="type">
                        Product
                        <span className="text-red">*</span>
                      </Label>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger id="product_id">
                          <SelectValue placeholder="Select Product" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoading ? (
                            <p className="p-3 text-center">Loading...</p>
                          ) : (
                            products?.length &&
                            products?.map((product) => (
                              <SelectItem
                                key={product?.id}
                                value={product?.id ?? ""}
                              >
                                {product.item_name}
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

            <FormField
              control={form.control}
              name="quantity"
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
