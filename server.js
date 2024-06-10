const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Configuração do Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Carregar o arquivo credentials.json
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));

// Configuração do JWT (JSON Web Token)
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

// Função para adicionar dados à planilha
async function addDataToSheet(data) {
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = 'SUA_SPREADSHEET_ID';
  const range = 'Dashboard Fuzzr!A1:K1';

  const valueRangeBody = {
    majorDimension: "ROWS",
    values: [data],
  };

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: valueRangeBody,
    });
    console.log(response.data);
  } catch (err) {
    console.error('Error adding data to sheet:', err);
  }
}

// Rota para receber dados do formulário
app.post('/submit', (req, res) => {
  const { usuario, casasBahia, havan, ponto, caoaCherry, assai, locAcelera, mixAcelera, ajusteAcelera } = req.body;
  
  const totalMateriais = parseInt(casasBahia) + parseInt(havan) + parseInt(ponto) + parseInt(caoaCherry) + parseInt(assai);
  const aceleraGeral = parseInt(locAcelera) + parseInt(mixAcelera) + parseInt(ajusteAcelera);

  const dataAtual = new Date().toLocaleDateString('pt-BR');
  const data = [
    dataAtual, usuario, totalMateriais, casasBahia, havan, ponto, caoaCherry, assai, locAcelera, mixAcelera, ajusteAcelera, aceleraGeral
  ];

  addDataToSheet(data).then(() => {
    res.send('Dados enviados com sucesso!');
  }).catch(err => {
    res.status(500).send('Erro ao enviar os dados.');
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
