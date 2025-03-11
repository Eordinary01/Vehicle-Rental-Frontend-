import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Car, 
  Banknote, 
  // Car, 
  ChevronRight, 
  ShoppingCart, 
  Star, 
  Fuel, 
  Heart,
  MoveRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const VehicleCard = ({ vehicle }) => {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Render loading skeleton if no vehicle data
  if (!vehicle) {
    return (
      <Card className="w-full h-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl shadow-lg animate-pulse">
        <div className="h-72"></div>
        <CardContent className="p-6">
          <div className="h-6 bg-slate-300 rounded-md w-2/3 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-slate-300 rounded-lg"></div>
            <div className="h-10 bg-slate-300 rounded-lg"></div>
            <div className="h-10 bg-slate-300 rounded-lg"></div>
            <div className="h-10 bg-slate-300 rounded-lg"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleCardClick = () => {
    router.push(`/vehicle/${vehicle._id}`);
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  // Rating stars component
  const RatingStars = ({ rating = 4.5 }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={16} 
            className={cn(
              "mx-0.5",
              star <= Math.floor(rating) 
                ? "fill-yellow-400 text-yellow-400" 
                : star <= rating 
                  ? "fill-yellow-400/50 text-yellow-400" 
                  : "text-gray-300"
            )}
          />
        ))}
        <span className="text-gray-600 ml-2 text-sm">({rating})</span>
      </div>
    );
  };

  // Detail item component
  const DetailItem = ({ icon, text, tooltip }) => (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl hover:bg-slate-100 transition-colors group cursor-pointer">
            <div className="text-slate-600 group-hover:text-primary transition-colors">
              {icon}
            </div>
            <span className="text-sm font-medium">{text}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const availabilityVariants = {
    available: {
      badge: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
      text: "Available Now"
    },
    unavailable: {
      badge: "bg-rose-100 text-rose-800 hover:bg-rose-200",
      text: "Currently Unavailable"
    }
  };

  const availability = vehicle.available 
    ? availabilityVariants.available 
    : availabilityVariants.unavailable;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ 
        y: -8,
        transition: { 
          type: 'spring', 
          stiffness: 300,
          damping: 15
        }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <Card 
        className={cn(
          "overflow-hidden border-slate-200 transition-all duration-300 h-full flex flex-col",
          isHovered ? "shadow-xl border-primary/20" : "shadow-md"
        )}
        onClick={handleCardClick}
      >
        {/* Vehicle Image Container */}
        <div className="relative h-72 overflow-hidden bg-slate-100">
          <motion.div
            animate={{ 
              scale: isHovered ? 1.05 : 1,
              rotate: isHovered ? 1 : 0
            }}
            transition={{ duration: 0.5 }}
            className="h-full w-full"
          >
            <Image
              src={vehicle.image}
              alt={vehicle.name}
              layout="fill"
              objectFit="cover"
              className="z-0"
            />
          </motion.div>
          
          {/* Overlay elements */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
          
          <div className="absolute top-4 left-4 flex items-center space-x-2 z-20">
            <Badge variant="secondary" className="backdrop-blur-sm bg-white/80 text-slate-800 hover:bg-white/90">
              {vehicle.type}
            </Badge>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleWishlist}
              className={cn(
                "p-2 rounded-full backdrop-blur-sm transition-colors",
                isWishlisted 
                  ? "bg-red-50 text-red-500 border border-red-200" 
                  : "bg-white/80 text-slate-500 border border-slate-200"
              )}
            >
              <Heart className={isWishlisted ? "fill-red-500" : ""} size={18} />
            </motion.button>
          </div>
        </div>
        
        <CardContent className="p-6 flex-grow">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">
              {vehicle.name}
            </h2>
            <RatingStars rating={4.5} />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <DetailItem 
              icon={<Banknote size={18} className="text-emerald-500" />} 
              text={`₹${vehicle.pricePerDay}/day`} 
              tooltip="Daily rental price" 
            />
            <DetailItem 
              icon={<Car size={18} className="text-purple-500" />} 
              text={`${vehicle.wheelCount} Wheels`} 
              tooltip="Number of wheels" 
            />
            <DetailItem 
              icon={<Fuel size={18} className="text-blue-500" />} 
              text={vehicle.fuelType} 
              tooltip="Type of fuel" 
            />
            <DetailItem 
              icon={<Car size={18} className="text-orange-500" />} 
              text={vehicle.transmission} 
              tooltip="Transmission type" 
            />
          </div>
        </CardContent>
        
        <CardFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <Badge variant="outline" className={cn(availability.badge)}>
            {availability.text}
          </Badge>

          <Button 
            size="sm" 
            className="rounded-full gap-2 group"
            onClick={handleCardClick}
          >
            <span>View Details</span>
            <MoveRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default VehicleCard;