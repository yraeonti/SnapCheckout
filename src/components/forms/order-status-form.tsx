"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { orderStatusSchema } from "@/lib/form-schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import { IOrder } from "@/types/order.dto";

import { useEditOrderStatusMutation } from "@/hooks/mutations/orders-mutations";

interface OrderStatusFormProps {
  closeModal: () => void;
  order: IOrder;
}

export const OrderStatusForm = ({
  closeModal,
  order,
}: OrderStatusFormProps) => {
  const { mutate, isPending } = useEditOrderStatusMutation(closeModal);
  const form = useForm<z.infer<typeof orderStatusSchema>>({
    resolver: zodResolver(orderStatusSchema),
    mode: "onChange",
    defaultValues: {
      order_id: order?.id,
      status: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof orderStatusSchema>) => {
    mutate(data);
  };

  const statusOptions = ["PENDING", "ONGOING", "COMPLETED", "FAILED"];

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
              name="status"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormControl>
                    <div className="w-full space-y-1">
                      <Label htmlFor="type">
                        Status
                        <span className="text-red">*</span>
                      </Label>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </SelectContent>
                      </Select>
                    </div>
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
