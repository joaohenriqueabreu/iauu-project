const getDocumentType = (document) => {
  // Garante que o valor é uma string
  document = document.toString();
    
  // Remove caracteres inválidos do valor
  document = document.replace(/[^0-9]/g, '');

  if (document.length === 11) { return 'CPF'; } 
  if (document.length === 14) { return 'CNPJ'; } 
  return 'INVALID';
}

module.exports = { getDocumentType }