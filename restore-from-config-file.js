function showReCreateSheetDialog() {
  const template = HtmlService.createTemplateFromFile('recreate-sheet-dialog');
  template.config = config;

  const htmlOutput = template.evaluate()
    .setWidth(300)
    .setHeight(180);

  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Recrear Hoja');
}

function processReCreateSheet(configKey) {
  const selectedConfig = config[configKey];
  if (selectedConfig) {
    reCreateSheet(selectedConfig.sheetName, selectedConfig);
  }
}

function reCreateSheet(sheetName, config) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

  if (!sheet) {
    SpreadsheetApp.getUi().alert(`La hoja "${sheetName}" no existe.`);
    return;
  }

  // recreate the sheet
  sheet.clear(); // Clear existing content

  // Set headers and initial values based on the config
  for (const range in config.values) {
    const cellRange = sheet.getRange(range);
    let value = config.values[range];

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

    // Apply styling: merge shared styles with cell-specific overrides
    const sharedStyles = config.sharedStyles || {};
    const cellSpecificStyles = (config.cellStyles && config.cellStyles[range]) || {};
    const finalStyles = { ...sharedStyles, ...cellSpecificStyles };

    // Apply each style method
    for (const [methodName, value] of Object.entries(finalStyles)) {
      if (value !== null && value !== undefined) {
        cellRange[methodName](value);
      }
    }
  }

  SpreadsheetApp.getUi().alert(
    `La hoja "${sheetName}" ha sido recreada correctamente.`
  );
}
