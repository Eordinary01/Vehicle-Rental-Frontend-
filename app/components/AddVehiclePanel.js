"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';

const AddVehiclePanel = ({ 
  isVisible, 
  onClose, 
  onSubmit, 
  formData = {}, 
  loading = false, 
  vehicleTypes = [], 
  fuelTypeOptions = [], 
  transmissionOptions = [], 
  wheelCountOptions = [] 
}) => {
  const form = useForm({
    defaultValues: {
      name: formData.name || '',
      type: formData.type || '',
      image: formData.image || '',
      pricePerDay: formData.pricePerDay || '',
      wheelCount: formData.wheelCount || '',
      description: formData.description || '',
      fuelType: formData.fuelType || '',
      transmission: formData.transmission || '',
      capacity: formData.capacity || '',
      year: formData.year || new Date().getFullYear(),
      available: formData.available || 'true'
    }
  });

  const handleFormSubmit = (values) => {
    onSubmit({
      ...values,
      pricePerDay: parseFloat(values.pricePerDay),
      wheelCount: parseInt(values.wheelCount),
      capacity: parseInt(values.capacity),
      year: parseInt(values.year),
      available: values.available === 'true'
    });
  };

  const panelVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 100, 
        damping: 20 
      } 
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      <motion.div 
        className="fixed top-0 left-0 h-full w-full md:w-2/5 lg:w-1/3"
        variants={panelVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <Card className="h-full border-none rounded-none md:rounded-r-xl bg-background/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold text-primary">
                Add New Vehicle
              </CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="h-8 w-8 rounded-full"
                aria-label="Close panel"
              >
                <X size={18} />
              </Button>
            </div>
            <Separator className="mt-2" />
          </CardHeader>
          
          <ScrollArea className="h-[calc(100vh-10rem)]">
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-5 py-2">
                  <div className="grid gap-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter vehicle name" {...field} />
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
                          <FormLabel>Vehicle Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select vehicle type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {vehicleTypes.map(type => (
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
                            <Input placeholder="Enter image URL" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="pricePerDay"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price per Day</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
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
                                  <SelectValue placeholder="Select wheels" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {wheelCountOptions.map(count => (
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
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter vehicle description" 
                              className="min-h-[120px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
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
                                {fuelTypeOptions.map(fuel => (
                                  <SelectItem key={fuel} value={fuel}>
                                    {fuel}
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
                                {transmissionOptions.map(trans => (
                                  <SelectItem key={trans} value={trans}>
                                    {trans}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="capacity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Capacity</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" placeholder="Number of passengers" {...field} />
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
                            <FormLabel>Manufacturing Year</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1900" 
                                max={new Date().getFullYear()} 
                                placeholder="Year" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
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
                  </div>
                  
                  <CardFooter className="flex justify-end p-0 pt-4">
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? "Adding Vehicle..." : "Add Vehicle"}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </ScrollArea>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AddVehiclePanel;