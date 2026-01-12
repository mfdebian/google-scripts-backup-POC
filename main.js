function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Backup & Restore')
      .addItem('Create Backup', 'createBackup')
      .addItem('Restore from Backup', 'restoreFromBackup')
      .addItem('reCreate Sheet', 'showReCreateSheetDialog')
      .addToUi();
}
