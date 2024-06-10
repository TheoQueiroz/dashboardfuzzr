const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

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

// Dados de exemplo
const data = [
  '12/06/2024', 'EDUARDO', 100, 20, 30, 10, 10, 30, 5, 10, 15, 30
];

addDataToSheet(data);
