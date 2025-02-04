// ParkingGrid.tsx - Ejemplo
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ParkingSpot } from '../types';

interface ParkingGridProps {
  spots: ParkingSpot[];
  onSpotClick: (spot: ParkingSpot) => void;
}

export function ParkingGrid({ spots, onSpotClick }: ParkingGridProps) {
  return (
    <View style={styles.grid}>
      {spots.map((spot) => {
        const isOccupied = spot.isOccupied;
        const spotColor = isOccupied ? styles.occupied : styles.free;

        // Ejemplo: icono distinto según el tipo
        let iconName = 'directions-car';
        if (spot.type === 'disabled') iconName = 'block';       // MaterialIcons no tiene exactamente "Ban"
        else if (spot.type === 'electric') iconName = 'ev-station';

        return (
          <TouchableOpacity
            key={spot.id}
            style={[styles.spot, spotColor]}
            onPress={() => onSpotClick(spot)}
          >
            <Icon name={iconName} size={24} color="#000" />
            <Text style={styles.spotNumber}>Plaza {spot.number}</Text>
            <Text style={styles.spotStatus}>
              {isOccupied ? 'Ocupado' : 'Libre'}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  spot: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  occupied: {
    backgroundColor: '#fee2e2', // red-100
  },
  free: {
    backgroundColor: '#d1fae5', // green-100
  },
  spotNumber: {
    fontWeight: '600',
    marginTop: 4,
  },
  spotStatus: {
    fontSize: 12,
    color: '#555',
  },
});
