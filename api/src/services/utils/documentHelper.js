const getDocumentType = (document) => {
  // Garante que o valor é uma string
  document = document.toString();
    
  // Remove caracteres inválidos do valor
  document = document.replace(/[^0-9]/g, '');

  if (document.length === 11) { return 'CPF'; } 
  if (document.length === 14) { return 'CNPJ'; } 
  return 'INVALID';
}

const formatDocument = (document, shouldFormat) => {
  if (! shouldFormat) {
    return document.replace(/[^0-9]/g, '');
  }

  const documentType = getDocumentType(document);

  if (documentType === 'CPF') {
    document = document.replace(/[^0-9]/g, '');
    return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  if (documentType === 'CNPJ') {
    document = document.replace(/[^0-9]/g, '');
    return document.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1 $2 $3/$4-$5');
  }

  return document;
}

module.exports = { getDocumentType, formatDocument }