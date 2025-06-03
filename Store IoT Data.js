async function sendData(sensorValue) {
  await addDoc(collection(db, "iot_data"), {
    value: sensorValue,
    timestamp: Date.now()
  });
}