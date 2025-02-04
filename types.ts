// types.ts
export interface ParkingSpot {
    id: string;
    number: string;
    isOccupied: boolean;
    type: 'disabled' | 'electric' | 'standard';
    currentVehicle?: string;  // id del vehículo actual si está ocupado
  }
  
  export interface VehicleEntry {
    id: string;
    plate: string;
    vehicleType: 'car' | 'motorcycle' | 'van';
    entryTime: Date;
    exitTime?: Date;
    status: 'active' | 'completed';
    parkingSpot: string;
  }
  