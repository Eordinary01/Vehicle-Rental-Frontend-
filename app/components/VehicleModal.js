"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";

const VehicleModal = ({
  vehicle,
  isOpen,
  onClose,
  onSave,
  vehicleTypes = [],
  fuelTypeOptions = [],
  transmissionOptions = [],
  wheelCountOptions = [],
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      type: "",
      image: "",
      pricePerDay: "",
      wheelCount: "",
      description: "",
      features: "",
      available: "true",
      fuelType: "",
      transmission: "",
      capacity: "",
      year: "",
    },
  });

  useEffect(() => {
    if (vehicle && isOpen) {
      form.reset({
        name: vehicle.name || "",
        type: vehicle.type || "",
        image: vehicle.image || "",
        pricePerDay: vehicle.pricePerDay || "",
        wheelCount: vehicle.wheelCount?.toString() || "",
        description: vehicle.description || "",
        features: Array.isArray(vehicle.features)
          ? vehicle.features.join(", ")
          : vehicle.features || "",
        available: vehicle.available?.toString() || "true",
        fuelType: vehicle.fuelType || "",
        transmission: vehicle.transmission || "",
        capacity: vehicle.capacity?.toString() || "",
        year: vehicle.year?.toString() || "",
      });
    }
  }, [vehicle, isOpen, form]);

  const handleFormSubmit = (data) => {
    setIsSubmitting(true);
    
    const processedData = {
      ...vehicle,
      ...data,
      wheelCount: parseInt(data.wheelCount),
      capacity: parseInt(data.capacity),
      year: parseInt(data.year),
      pricePerDay: parseFloat(data.pricePerDay),
      features: data.features.split(",").map((item) => item.trim()),
      available: data.available === "true",
    };
    
    onSave(processedData);
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-6xl bg-background">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <DialogHeader className="px-6 pt-6 pb-2">
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-2xl font-bold text-primary">
                    Edit Vehicle
                  </DialogTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 rounded-full"
                  >
                    <X size={18} />
                  </Button>
                </div>
                <Separator className="mt-2" />
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                  <div className="p-6">
                    {/* Main information section - split into 3 columns */}
                    <div className="grid grid-cols-3 gap-8">
                      {/* Left column */}
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {vehicleTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="image"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="pricePerDay"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price per day</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Middle column */}
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="wheelCount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Wheel Count</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select wheel count" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {wheelCountOptions.map((count) => (
                                    <SelectItem key={count} value={count.toString()}>
                                      {count}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="fuelType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fuel Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select fuel type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {fuelTypeOptions.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="transmission"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Transmission</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select transmission" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {transmissionOptions.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="features"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Features (comma-separated)</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Right column */}
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="capacity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Capacity</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="year"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Year</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="available"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Availability</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select availability" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="true">Available</SelectItem>
                                  <SelectItem value="false">Not Available</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  className="resize-none"
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <DialogFooter className="px-6 py-4 border-t">
                    <div className="flex gap-3 w-full justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </DialogFooter>
                </form>
              </Form>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default VehicleModal;