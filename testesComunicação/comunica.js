import mqtt from 'mqtt';
export class comunica{

static connect(){
   // Conecta ao broker MQTT
const client = mqtt.connect("ws://mqtt.ect.ufrn.br:1884/mqtt", {
    username: "mqtt",
    password: "lar_mqtt",
    clientId: "CodigoNossoQueEstasEmC",
    clean: true,
  });
  
  client.on("connect", () => {
    console.log("✅ Conectado ao MQTT");
    client.subscribe("R/IOT/CTRL");
  });
  
  client.on("message", (topic, message) => {
    try {
      const data = JSON.parse(message.toString());
      const toRad = deg => deg * Math.PI / 180;
      targetY = toRad(parseFloat(data.z) || 0);
    } catch (err) {
      console.error("Erro ao processar MQTT:", err);
    }
  });
    }
}