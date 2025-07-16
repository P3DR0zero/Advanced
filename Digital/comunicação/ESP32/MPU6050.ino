#include <WiFi.h>
#include <Wire.h>
#include <WiFiClient.h>  
#include <PubSubClient.h>
#include <MPU6050_tockn.h>

// Variáveis Globais e de Tempo
float eixo_z;  // Aqui é o eixo lido pelo mano ESP32 a partir do MPU6050
unsigned long tempo_atual;
unsigned long tempo_anterior;
const long intervalo = 200;

// WiFi & MQTT
const char* ssid = "brisa-1758139";  // NOME DA REDE WIFI
const char* password = "tsl2lrf6"; // SENHA DA REDE WIFI
const char* mqtt_server = "mqtt.ect.ufrn.br"; // AQUI MUDAREMOS PARA O SERVER MQTT DA UFRN
const int mqtt_port = 1883; // PORTA MQTT - MUDAR PARA DA UFRN
const char* mqtt_user = "mqtt";
const char* mqtt_pass = "lar_mqtt";

//PINOS DO PROTOCOLO DE COMUNIÇÃO I2C (LEMBRAR DE ADQUIRIR UNS JUMPERS DE MELHOR QUALIDADE. MAL CONTATO QUEBRA O CÓDIGO TODINHO)
#define PINO_SDA 21
#define PINO_SCL 22

//INICIALIZAÇÃO DO MANO ESP32 COMO CLIENTE E DETERMINAÇÃO DO MPU6050 COM PROTOCOLO I2C
WiFiClient espClient;
PubSubClient client(espClient);
MPU6050 mpu6050(Wire);


// FUNÇÃO CONEXÃO WIFI
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


// FUNÇÃO DE RECONEXÃO BROKER
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

  // MONITOR SERIAL E INICIALIZAÇÃO I2C
  Serial.begin(9600);
  Wire.begin(PINO_SDA, PINO_SCL);

  //INICIA O WIFI
  setup_wifi();
  
  //DETERMINA O MANO ESP32 COMO CLIENTE 
  client.setServer(mqtt_server, mqtt_port);

  //INICIALIZA O MPU6050 E CALIBRA (NÃO MEXER POR 3 SEGUNDOS)
  mpu6050.begin();
  mpu6050.calcGyroOffsets(true);
}

void loop() {

  //RECONEXÃO BROKER
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  //A CADA 200MS ATUALIZA OS DADOS DO MPU6050
  tempo_atual = millis();

  if (tempo_atual - tempo_anterior >= intervalo) {
    tempo_anterior = tempo_atual;

    // A MARAVILHA ACONTECE AQUI: RECEBE O ANGULO DO EIXO Z E ENVIA O JSON PRO BROKER
    mpu6050.update();
    eixo_z = mpu6050.getAngleZ();
    Serial.println(eixo_z);

    char payload[50];
    sprintf(payload, "{\"z\":%.2f}", eixo_z);
    client.publish("R/IOT/CTRL", payload);
  }
}
