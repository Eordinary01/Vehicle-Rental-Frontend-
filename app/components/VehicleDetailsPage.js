// import React from 'react';
// import VehicleDetails from '../../components/VehicleDetails';
// import API from '../../utils/api';

// export default async function VehicleDetailsPage({ params }) {
//     console.log("Params received:", params);
//     if (!params || !params.id) {
//       return <div>Invalid vehicle ID</div>;
//     }
  
//     const vehicle = await getVehicleData(params.id);
  
//     if (!vehicle) {
//       return <div>Vehicle not found</div>;
//     }
  
//     return <VehicleDetails vehicle={vehicle} />;
//   }
// //