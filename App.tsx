// App.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView
} from 'react-native';
// Quita la importación de lucide y usa react-native-vector-icons:
import Icon from 'react-native-vector-icons/MaterialIcons';

import { ParkingSpot, VehicleEntry } from './types';
import { ParkingGrid } from './components/ParkingGrid';
import { VehicleForm } from './components/VehicleForm';
import { ActiveVehicles } from './components/ActiveVehicles';

// Inicializar espacios de estacionamiento
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

  const handleVehicleEntry = (vehicleData: Partial<VehicleEntry>) => {
    if (!selectedSpot) {
      Alert.alert('Por favor seleccione una plaza de parking');
      return;
    }

    const newVehicle: VehicleEntry = {
      ...vehicleData as VehicleEntry,
      id: vehicleData.id || `vehicle-${Date.now()}`,
      parkingSpot: selectedSpot.number,
    };

    setVehicles((prev) => [...prev, newVehicle]);

    setSpots((prev) =>
      prev.map((spot) =>
        spot.id === selectedSpot.id
          ? { ...spot, isOccupied: true, currentVehicle: newVehicle.id }
          : spot
      )
    );

    setSelectedSpot(null);
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
        {/* Icono de parking usando MaterialIcons */}
        <Icon name="local-parking" size={32} color="#fff" />
        <Text style={styles.headerTitle}>Gestión de Parking</Text>
      </View>

      {/* Contenido principal (scroll si deseas) */}
      <ScrollView contentContainerStyle={styles.mainContent}>
        {/* Columna izquierda: Grid de plazas */}
        <View style={styles.leftColumn}>
          <Text style={styles.sectionTitle}>Estado del Parking</Text>
          <ParkingGrid spots={spots} onSpotClick={setSelectedSpot} />
        </View>

        {/* Columna derecha: Form + Activos */}
        <View style={styles.rightColumn}>
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
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // gray-100
  },
  header: {
    backgroundColor: '#2563eb', // blue-600
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
    flexDirection: 'row',
  },
  leftColumn: {
    flex: 2,
    marginRight: 16,
  },
  rightColumn: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
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
