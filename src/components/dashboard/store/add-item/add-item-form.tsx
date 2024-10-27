import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { serviceFormSchema } from "@/lib/form-schemas";
import { Service } from "@/types/service";
import { useServiceMutation } from "@/hooks/mutations/services";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { serviceTypes } from "@/lib/static-data";

export const AddtemForm = ({ service }: { service?: Service }) => {
  const { mutate, isPending } = useServiceMutation();
  const form = useForm<z.infer<typeof serviceFormSchema>>({
    resolver: zodResolver(serviceFormSchema),
    mode: "onChange",
    defaultValues: {
      name: service?.name || "",
      description: service?.description || "",
      iconUrl: service?.iconUrl || undefined,
      startingPrice: service?.startingPrice || undefined,
      type: service?.type || undefined,
      isFeatured: service?.isFeatured || false,
      isPublic: service?.isPublic || false,
      faqs: service?.faqs || [{ question: "", answer: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "faqs",
  });

  const onSubmit = async (data: z.infer<typeof serviceFormSchema>) => {
    const id = service?.id;

    const formData = {
      ...data,
      iconUrl: data.iconUrl !== "" ? data.iconUrl : undefined,
    };

    if (!service) {
      mutate(formData);
    } else {
      mutate({ ...formData, id });
    }
  };

  return (
    <Form {...form}>
      <form
        className="mt-4 w-full max-w-2xl space-y-4 rounded-xl bg-white p-3 sm:p-5"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className=" space-y-3">
          <div className="grid grid-cols-1 gap-4 pr-1 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormControl>
                    <Input
                      {...field}
                      name="name"
                      type="text"
                      label="Name"
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
              name="description"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormControl>
                    <Textarea
                      {...field}
                      name="description"
                      label="Description"
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
              name="startingPrice"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => field.onChange(+e.target.value)}
                      name="startingPrice"
                      type="number"
                      label="Starting Price"
                      className="w-full"
                      required
                      placeholder="Starting Price"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="iconUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      name="iconUrl"
                      type="text"
                      label="Icon URL"
                      className="w-full"
                      placeholder="Icon URL"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormControl>
                    <div className="w-full space-y-1">
                      <Label htmlFor="type">
                        Service Type
                        <span className="text-red">*</span>
                      </Label>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select test type" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceTypes.map((type, index) => {
                            return (
                              <SelectItem key={index} value={type.value}>
                                {type.label}
                              </SelectItem>
                            );
                          })}
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
              name="isFeatured"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-3">
                    <FormControl className="mt-2 flex items-center space-x-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="mt-2 normal-case">
                      Featured?
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-3">
                    <FormControl className="mt-2 flex items-center space-x-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="mt-2 normal-case">Public?</FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold">FAQs</h3>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                <FormField
                  control={form.control}
                  name={`faqs.${index}.question`}
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormControl>
                        <Input
                          {...field}
                          name={`faqs.${index}.question`}
                          type="text"
                          placeholder="FAQ Question"
                          className="w-full"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`faqs.${index}.answer`}
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormControl>
                        <Textarea
                          {...field}
                          name={`faqs.${index}.answer`}
                          placeholder="FAQ Answer"
                          className="w-full"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outlineRed"
                  onClick={() => remove(index)}
                  className="sm:col-span-2"
                >
                  Remove FAQ
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => append({ question: "", answer: "" })}
              variant="outline"
            >
              Add FAQ
            </Button>
          </div>
        </div>
        <div className="mt-4 flex  justify-end">
          <Button type="submit" isLoading={isPending}>
            {service ? "Update " : "Create"} Service
          </Button>
        </div>
      </form>
    </Form>
  );
};
