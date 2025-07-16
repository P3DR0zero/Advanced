# Comunicação DTW

  

Antes de começar, certifique-se de ter o [Node.js](https://nodejs.org/) instalado.

  

## 1. Instale as dependências obrigatórias:

* Faça o clone do repositório mas não use ele para testar provavelmente vai dar problema, instale tudo em outra pasta e use os arquivos Keys.js , main.js, comunica.js no seu codigo tudo diferente disso deve ser baixado em sua maquina
### 2. Funcionamento da comunicação:
* No momento a comunicação do ESP32 com o three.js está enviando a mudança da esquerda e direita de 15 em 15 graus, esse envio se fez necessário pois a movimentação e animação está na classe keys.js e ela reconhece o teclado do computador. 


#### Comandos necessários para rodar no terminal do vs code ou do próprio linux



```bash

npm  install  --save  three

npm  install  --save-dev  vite

npx  vite  OBS  ESSE  É  PARA  QUANDO  TUDO  ESTIVER  PRONTO  E  VOCÊ  FOR  TESTAR  O  CODIGO


