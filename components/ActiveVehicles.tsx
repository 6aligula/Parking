// components/ActiveVehicles.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { VehicleEntry } from '../types';

interface ActiveVehiclesProps {
  vehicles: VehicleEntry[];
  onCheckout: (id: string) => void;
}

export function ActiveVehicles({ vehicles, onCheckout }: ActiveVehiclesProps) {
  const activeVehicles = vehicles.filter((v) => v.status === 'active');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vehículos Activos</Text>
      {activeVehicles.map((vehicle) => (
        <View style={styles.vehicleItem} key={vehicle.id}>
          <View style={styles.leftSide}>
            {/* Icono de "reloj" en MaterialIcons es "access-time" */}
            <Icon name="local-parking" size={32} color="#fff" />
            
            <View>
              <Text style={styles.plateText}>{vehicle.plate}</Text>
              <Text style={styles.spotText}>Plaza: {vehicle.parkingSpot}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => onCheckout(vehicle.id)}
            style={styles.exitButton}
          >
            <Text style={styles.exitButtonText}>Salida</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  vehicleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
    elevation: 1,
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plateText: {
    fontWeight: '500',
  },
  spotText: {
    fontSize: 12,
    color: '#555',
  },
  exitButton: {
    backgroundColor: '#ef4444', // red-500
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  exitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
