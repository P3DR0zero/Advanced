import mqtt from 'mqtt';
import { Keys } from './keys.js';
var espKey;

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
      const isPressed = (data.action==='pressed');
      Keys.pressed[data.key] = isPressed;
      espKey=data;
      console.log('📦 Recebido:', espKey);
    } catch (err) {
      console.error("Erro ao processar MQTT:", err);
    }
  });
    }
}