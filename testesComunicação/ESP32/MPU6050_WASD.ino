#include <WiFi.h>
#include <Wire.h>
#include <WiFiClient.h>
#include <PubSubClient.h>
#include <MPU6050_tockn.h>

// Wi-Fi e MQTT
const char* ssid = "brisa-1758139";
const char* password = "tsl2lrf6";
const char* mqtt_server = "mqtt.ect.ufrn.br";
const int mqtt_port = 1883;
const char* mqtt_user = "mqtt";
const char* mqtt_pass = "lar_mqtt";

// I2C
#define PINO_SDA 21
#define PINO_SCL 22

WiFiClient espClient;
PubSubClient client(espClient);
MPU6050 mpu6050(Wire);

// Variáveis de tempo
unsigned long tempo_atual = 0;
unsigned long tempo_anterior = 0;
const long intervalo = 200;

// Eixos e controle
float eixo_x, eixo_y, eixo_z;
String ultimaTecla = "";
String ultimoEstado = "";

// Wi-Fi
void setup_wifi() {
  Serial.println("Conectando ao Wi-Fi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi conectado!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

// Reconexão MQTT
void reconnect() {
  while (!client.connected()) {
    Serial.print("Tentando conectar ao broker...");
    if (client.connect("esp32-client", mqtt_user, mqtt_pass)) {
      Serial.println("Conectado ao broker!");
    } else {
      Serial.print("Falha, rc=");
      Serial.print(client.state());
      Serial.println(" tentando novamente em 5s");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(9600);
  Wire.begin(PINO_SDA, PINO_SCL);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  mpu6050.begin();
  mpu6050.calcGyroOffsets(true);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();


  // Evitar uso de delay através do mano millis
  tempo_atual = millis();
  if (tempo_atual - tempo_anterior >= intervalo) {
    tempo_anterior = tempo_atual;

    // Leitura do sensor
    mpu6050.update();
    eixo_z = mpu6050.getAngleZ();
    eixo_y = mpu6050.getAngleX();
    eixo_x = mpu6050.getAngleY();

    String teclaAtual = "";

    // Define direção com base nos ângulos
    if (eixo_y < -15) teclaAtual = "w";
    else if (eixo_y > 15) teclaAtual = "s";
    else if (eixo_x < -15) teclaAtual = "a";
    else if (eixo_x > 15) teclaAtual = "d";

    // Envio de JSON apenas se mudar o estado
    if (teclaAtual != "" && (teclaAtual != ultimaTecla || ultimoEstado != "pressed")) {
      String json = "{\n  \"key\": \"" + teclaAtual + "\",\n  \"action\": \"pressed\"\n}";
      client.publish("R/IOT/CTRL", json.c_str());
      Serial.println(json);

      ultimaTecla = teclaAtual;
      ultimoEstado = "pressed";
    } else if (teclaAtual == "" && ultimoEstado == "pressed") {
      String json = "{\n  \"key\": \"" + ultimaTecla + "\",\n  \"action\": \"release\"\n}";
      client.publish("R/IOT/CTRL", json.c_str());
      Serial.println(json);

      ultimoEstado = "release";
    }
  }
}
