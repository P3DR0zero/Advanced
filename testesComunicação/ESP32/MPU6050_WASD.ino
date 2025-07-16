#include <WiFi.h>
#include <Wire.h>
#include <WiFiClient.h>
#include <PubSubClient.h>
#include <MPU6050_tockn.h>

// Wi-Fi e MQTT
const char* ssid = "Hel's_doces";
const char* password = "helsdoces123";
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
float eixo_x, eixo_y, eixo_z, giro_x, giro_y, giro_z;
float ponto_referencia = 0; // Ponto de referência que será atualizado
const float limiar_movimento = 15.0; // 15 graus para ativar movimento
String ultimaTecla = "";
String ultimoEstado = "";

// Variáveis para controle de estado
bool aguardando_release = false;
unsigned long tempo_press = 0;
const unsigned long delay_release = 500; // 500ms antes do release automático

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

  // Calibração inicial
  mpu6050.update();
  ponto_referencia = mpu6050.getAngleZ();
  Serial.print("Ponto de referência inicial: ");
  Serial.println(ponto_referencia);
}

void enviarTecla(String tecla, String acao) {
  String json = "{\n  \"key\": \"" + tecla + "\",\n  \"action\": \"" + acao + "\"\n}";
  client.publish("R/IOT/CTRL", json.c_str());
  Serial.println(json);
}

void atualizarPontoReferencia(float novo_ponto) {
  ponto_referencia = novo_ponto;
  Serial.print("Novo ponto de referência: ");
  Serial.println(ponto_referencia);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  // Evitar uso de delay através do millis
  tempo_atual = millis();
  if (tempo_atual - tempo_anterior >= intervalo) {
    tempo_anterior = tempo_atual;

    // Leitura do sensor
    mpu6050.update();
    eixo_z = mpu6050.getAngleZ();
    
    // Calcula a diferença em relação ao ponto de referência
    float diferenca = eixo_z - ponto_referencia;
    
    String teclaAtual = "";
    
    // Verifica se houve movimento significativo
    if (diferenca <= -limiar_movimento) {
      teclaAtual = "a"; // Movimento para a esquerda
    } else if (diferenca >= limiar_movimento) {
      teclaAtual = "d"; // Movimento para a direita
    }
    
    // Lógica de envio de teclas
    if (teclaAtual != "" && !aguardando_release) {
      // Envia tecla pressionada
      enviarTecla(teclaAtual, "pressed");
      ultimaTecla = teclaAtual;
      ultimoEstado = "pressed";
      aguardando_release = true;
      tempo_press = tempo_atual;
      
    } else if (aguardando_release && (tempo_atual - tempo_press >= delay_release)) {
      // Envia release após o delay
      enviarTecla(ultimaTecla, "release");
      ultimoEstado = "release";
      aguardando_release = false;
      
      // Atualiza o ponto de referência para a posição atual
      atualizarPontoReferencia(eixo_z);
    }
    
    // Debug - mostra valores atuais
    Serial.print("Eixo Z: ");
    Serial.print(eixo_z);
    Serial.print(" | Referência: ");
    Serial.print(ponto_referencia);
    Serial.print(" | Diferença: ");
    Serial.print(diferenca);
    Serial.print(" | Aguardando release: ");
    Serial.println(aguardando_release ? "SIM" : "NÃO");
  }
}