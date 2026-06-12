# 💡 Dashboard IoT — Monitoramento de Sensores e Controle de LED via MQTT

## 📌 Objetivo
- **Praticar** meus **conhecimentos** em **MQTT** e no framework **React Native**
- **Estruturar** uma aplicação mobile com **React Native** que simula o monitoramento e controle de um **ESP32** em tempo real
- **Implementar** um **Dashboard moderno em Dark Mode** capaz de **enviar comandos para um LED** e **exibir dados de sensores** via protocolo MQTT
- **Simular** o ambiente IoT utilizando **MQTT.fx** como cliente de teste e **HiveMQ** como broker na nuvem

## 🛠️ Tecnologias
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-plain.svg" width="100" height="100"/> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/expo/expo-original.svg" width="100" height="100"/>
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/reactnative/reactnative-original-wordmark.svg" width="100" height="100"/>
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original-wordmark.svg" width="100" height="100"/>
          

> Também utilizado: **MQTT.fx** (simulação do ESP32) · **HiveMQ Cloud** (broker MQTT)

## ❗ Resolução do Problema

Para simular a comunicação com o ESP32, utilizei o **HiveMQ Cloud** como broker MQTT na nuvem, criando um Cluster gratuito que centraliza a troca de mensagens entre o app e o cliente MQTT. No lugar do hardware real, utilizei o **MQTT.fx** para simular o dispositivo ESP32, publicando e assinando tópicos manualmente durante os testes.

No aplicativo, a comunicação foi implementada com a biblioteca **MQTT** conectada ao broker via **WebSocket seguro (WSS)**. O app se inscreve em tópicos de sensores para receber leituras em tempo real e publica em tópicos de controle para acionar o LED. O Dashboard exibe os dados recebidos de forma visual e reativa, com atualização automática a cada nova mensagem recebida pelo broker.

## 🎖️ Demonstração

### Aplicativo Antes da implementação do DashBoard
<div align="center">
  <!-- Substitua pelo link do seu vídeo/GIF após gravar -->
  <video src="https://github.com/user-attachments/assets/ade245f2-02ef-4b33-848e-e2a69b0859ac" controls width="300"/>
</div>

### Aplicativo Após a implementação do DashBoard

## 📂 Estrutura de Pastas do Projeto

```
MyIot-Project/
├── assets/
│   ├── icon.png
│   └── splash-icon.png
├── src/
│   ├── components/
│   │   ├── Gauges.js
│   │   ├── HistoryButton.js
│   │   └── HistoryModal.js
│   │   └── LightControl.js
│   │   └── StatusModal.js
│   ├── services/
│   │   └── mqttService.js
│   └── styles/
│       ├── App.styles.js
│       └── Gauges.styles.js
│       └── HistoryButton.styles.js
│       └── HistoryModal.styles.js
│       └── LightControl.styles.js
│       └── StatusModal.styles.js
├── .env.example
├── .gitignore
├── App.js
├── app.json
├── index.js
├── package.json
└── README.md
```
## 📊 Dashboard de Análise

### Objetivo
O Dashboard foi desenvolvido para oferecer uma visão analítica dos dados históricos coletados dos sensores, permitindo acompanhar a média de tempo e a quantidade de uso/ativação de umidade, temperatura e luz ao longo do tempo.

### Funcionalidades
- **Tempo da Luz (PieChart):** Exibe a proporção de tempo que a luz permaneceu ligada (Ativo) vs desligada (Inativo) durante o período monitorado.
- **Variação da Temperatura (LineChart):** Gráfico de linhas com as últimas 6 leituras de temperatura (°C), mostrando a evolução ao longo do tempo.
- **Variação da Umidade (LineChart):** Gráfico de linhas com as últimas 6 leituras de umidade (%), mostrando a evolução ao longo do tempo.

### Tecnologias Utilizadas
- **react-native-chart-kit** — renderização dos gráficos PieChart e LineChart
- **react-native-svg** — suporte a renderização SVG necessária para os gráficos

## ❔ Como Executar o Projeto

Siga os passos abaixo para configurar e executar o projeto localmente em seu dispositivo móvel.

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/)
- [Expo Go](https://expo.dev/client) no celular
- [Git](https://git-scm.com/)
- [MQTT.fx](https://web.archive.org/web/20210514230412/https://www.jensd.de/apps/mqttfx/1.7.1/mqttfx-1.7.1-windows-x64.exe) *(para simular o ESP32)*
- Uma conta gratuita no [HiveMQ Cloud](https://www.hivemq.com/mqtt-cloud-broker/) *(para o broker MQTT)*

## 🔧 Configurando o Broker MQTT (HiveMQ Cloud)

1. Crie uma conta em [hivemq.com](https://www.hivemq.com/mqtt-cloud-broker/) e gere um **Cluster gratuito**
2. Anote as credenciais fornecidas:
   - **Host** (ex: `xxxxxxxx.s1.eu.hivemq.cloud`)
   - **Porta WebSocket**: `8884`
   - **Usuário e senha** definidos no painel
   - **Path** (/mqtt)
3. Configure essas credenciais no arquivo `.env` do projeto (veja o passo 4 abaixo)

## 🥏 Preparando o Ambiente

1. Clone o Repositório:
   ```bash
   git clone https://github.com/Breno-V/MyIoT-Project
   ```

2. Entre na pasta raíz do projeto:
   ```bash
   cd MyIoT-Project
   ```

3. Instale as dependências necessárias:
   - Usando NPM:
     ```bash
     npm install
     ```
   - Usando Yarn:
     ```bash
     yarn install
     ```
   - Usando pnpm:
     ```bash
     pnpm install
     ```

4. Crie o arquivo `.env` a partir do exemplo:
   ```bash
   cp .env.example .env
   ```
   Preencha com as credenciais do seu cluster HiveMQ:
   ```env
   EXPO_PUBLIC_MQTT_HOST=seu-cluster.hivemq.cloud
   EXPO_PUBLIC_MQTT_PORT=8884
   EXPO_PUBLIC_MQTT_PORT=/mqtt
   EXPO_PUBLIC_MQTT_USERNAME=seu_usuario
   EXPO_PUBLIC_MQTT_PASSWORD=sua_senha
   ```

## 🚀 Executando o Projeto

### Iniciando o App (Expo)

No terminal, na raíz do projeto:

- Se o PC e o celular estiverem na **mesma rede**:
  ```bash
  npx expo start
  ```
- Se estiverem em **redes diferentes**:
  ```bash
  npx expo start --tunnel
  ```
  O `--tunnel` cria um túnel entre o PC e o celular, permitindo rodar a aplicação sem que eles estejam na mesma internet.

### Simulando o ESP32 com MQTT.fx

Com o app rodando, use o **MQTT.fx** para simular o dispositivo ESP32:

1. Configure a conexão no MQTT.fx com as mesmas credenciais do HiveMQ
2. **Simule leituras de sensores** publicando mensagens nos tópicos de sensores (ex: `casa/temp`, `casa/hum`, `casa/luz`)

> 💡 **Dica:** Publique os valores conforme o exemplo abaixo:
> `[casa/luz]: 1 (para acender), 0 (para apagar) | [casa/hum | casa/temp]: 25`
