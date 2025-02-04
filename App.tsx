// App.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView
} from 'react-native';
import axios from 'axios';  // <--- Importamos axios
import Icon from 'react-native-vector-icons/MaterialIcons';

import { ParkingSpot, VehicleEntry } from './types';
import { ParkingGrid } from './components/ParkingGrid';
import { VehicleForm } from './components/VehicleForm';
import { ActiveVehicles } from './components/ActiveVehicles';

const initialSpots: ParkingSpot[] = Array.from({ length: 20 }, (_, i) => ({
  id: `spot-${i + 1}`,
  number: `${i + 1}`,
  isOccupied: false,
  type: i < 2 ? 'disabled' : i < 4 ? 'electric' : 'standard'
}));

export default function App() {
  const [spots, setSpots] = useState<ParkingSpot[]>(initialSpots);
  const [vehicles, setVehicles] = useState<VehicleEntry[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);

  // URL de tu API Flask (ajusta a tu localhost:puerto o dominio)
  const API_URL = 'http://192.168.1.180:6000/api/vehicles';
  // En Android Emulator, "localhost" no funciona; se usa "10.0.2.2" para apuntar al host

  const handleVehicleEntry = async (vehicleData: Partial<VehicleEntry>) => {
    if (!selectedSpot) {
      Alert.alert('Por favor seleccione una plaza de parking');
      return;
    }

    // Construimos el objeto VehicleEntry que queremos enviar
    const newVehicle: VehicleEntry = {
      ...vehicleData as VehicleEntry,
      id: vehicleData.id || `vehicle-${Date.now()}`,
      parkingSpot: selectedSpot.number,
    };

    try {
      // 1) Enviamos los datos a tu backend Flask
      const response = await axios.post(API_URL, {
        plate: newVehicle.plate,
        vehicleType: newVehicle.vehicleType,
        entryTime: newVehicle.entryTime,
        status: newVehicle.status,
        parkingSpot: newVehicle.parkingSpot
      });
      console.log('Respuesta del servidor:', response.data);

      // 2) Si todo va bien en el backend, actualizamos el estado local
      setVehicles((prev) => [...prev, newVehicle]);
      setSpots((prev) =>
        prev.map((spot) =>
          spot.id === selectedSpot.id
            ? { ...spot, isOccupied: true, currentVehicle: newVehicle.id }
            : spot
        )
      );
      setSelectedSpot(null);

      Alert.alert('Registro exitoso', '¡El vehículo se registró correctamente!');

    } catch (error) {
      console.error('Error al enviar datos al servidor:', error);
      Alert.alert('Error', 'No se pudo registrar el vehículo en el backend');
    }
  };

  const handleVehicleExit = (vehicleId: string) => {
    // Marcar vehículo como completado
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId
          ? { ...v, status: 'completed', exitTime: new Date() }
          : v
      )
    );

    // Liberar plaza
    setSpots((prev) =>
      prev.map((spot) =>
        spot.currentVehicle === vehicleId
          ? { ...spot, isOccupied: false, currentVehicle: undefined }
          : spot
      )
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="local-parking" size={32} color="#fff" />
        <Text style={styles.headerTitle}>Gestión de Parking</Text>
      </View>

      <ScrollView contentContainerStyle={styles.mainContent}>
        <Text style={styles.sectionTitle}>Estado del Parking</Text>
        <ParkingGrid spots={spots} onSpotClick={setSelectedSpot} />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {selectedSpot && !selectedSpot.isOccupied
              ? `Registrar vehículo - Plaza ${selectedSpot.number}`
              : 'Seleccione una plaza'}
          </Text>
          {selectedSpot && !selectedSpot.isOccupied && (
            <VehicleForm onSubmit={handleVehicleEntry} />
          )}
        </View>

        <ActiveVehicles vehicles={vehicles} onCheckout={handleVehicleExit} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  mainContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 8,
    padding: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
});
