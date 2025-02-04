// components/VehicleForm.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { VehicleEntry } from '../types';

interface VehicleFormProps {
  onSubmit: (data: Partial<VehicleEntry>) => void;
}

export function VehicleForm({ onSubmit }: VehicleFormProps) {
  const [plate, setPlate] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleEntry['vehicleType']>('car');

  const handleSubmit = () => {
    // Llamamos a onSubmit con los datos
    onSubmit({
      plate,
      vehicleType,
      entryTime: new Date(),
      status: 'active',
    });
    // Limpiamos
    setPlate('');
    setVehicleType('car');
  };

  return (
    <View style={styles.form}>
      <Text style={styles.label}>Matrícula</Text>
      <TextInput
        style={styles.input}
        value={plate}
        onChangeText={setPlate}
        placeholder="Ej: 1234 ABC"
      />

      <Text style={styles.label}>Tipo de Vehículo</Text>
      {/* Usando Picker de @react-native-picker/picker */}
      <Picker
        selectedValue={vehicleType}
        style={styles.input}
        onValueChange={(itemValue) => setVehicleType(itemValue as VehicleEntry['vehicleType'])}
      >
        <Picker.Item label="Coche" value="car" />
        <Picker.Item label="Moto" value="motorcycle" />
        <Picker.Item label="Furgoneta" value="van" />
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Registrar Entrada</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    padding: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
