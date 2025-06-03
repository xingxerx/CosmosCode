function sendData(sensorValue) {
  set(ref(db, 'iot/sensor1'), {
    value: sensorValue,
    timestamp: Date.now()
  });
}