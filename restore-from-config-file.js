const novedades = {
  'A1:D1': 'THE HAT MADRID',
  E1: new Date(),
  A2: 'ORDEN',
  B2: 'NOVEDAD',
  C2: 'FECHA',
  D2: 'HORA',
  E2: 'INFO',
  F1: '',
  F2: '',
};

function reCreateSheet() {
  const hoja =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName('NOVEDADES');

  if (!hoja) {
    SpreadsheetApp.getUi().alert('La hoja "NOVEDADES" no existe.');
    return;
  }

  // recreate the sheet
  hoja.clear(); // Clear existing content

  // Set headers and initial values based on the config
  for (const range in novedades) {
    const cellRange = hoja.getRange(range);
    let value = novedades[range];

    // Check if this is a range (contains ':') that needs merging
    if (range.includes(':')) {
      cellRange.merge();
    }

    // Format Date objects as day/month/year
    if (value instanceof Date) {
      value = Utilities.formatDate(
        value,
        Session.getScriptTimeZone(),
        'dd/MM/yyyy'
      );
    }

    cellRange.setValue(value);

    // Apply styling
    cellRange
      .setBackground('#000000')
      .setFontColor('#FFFFFF')
      .setFontFamily('Comfortaa')
      .setFontWeight('bold')
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');
  }

  SpreadsheetApp.getUi().alert(
    'La hoja "NOVEDADES" ha sido recreada correctamente.'
  );
}
