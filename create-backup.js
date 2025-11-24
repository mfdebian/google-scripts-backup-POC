function createBackup() {
  const ui = SpreadsheetApp.getUi();
  
  // Show confirmation alert
  const response = ui.alert(
    'Create Backup',
    'Do you want to create a backup of this spreadsheet?',
    ui.ButtonSet.YES_NO
  );
  
  // Check if user clicked Yes
  if (response !== ui.Button.YES) {
    return;
  }
  
  try {
    // Get the active spreadsheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();
    
    // Validate headers
    const headerA1 = sheet.getRange('A1').getValue();
    const headerB1 = sheet.getRange('B1').getValue();
    const headerC1 = sheet.getRange('C1').getValue();
    
    if (headerA1 !== 'header one' || headerB1 !== 'header two' || headerC1 !== 'header three') {
      ui.alert(
        'Malformed Sheet',
        'The sheet headers are not correct. Expected:\nA1: "header one"\nB1: "header two"\nC1: "header three"',
        ui.ButtonSet.OK
      );
      return;
    }
    
    const spreadsheetName = spreadsheet.getName();
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const folderName = year + '-' + month + '-' + day;
    
    // Get current time in HH-MM format
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const timePrefix = hours + '-' + minutes;
    
    // Find the parent folder "alpi-google-scripts-tests"
    const parentFolderName = 'alpi-google-scripts-tests';
    const parentFolders = DriveApp.getFoldersByName(parentFolderName);
    
    if (!parentFolders.hasNext()) {
      ui.alert('Error', 'Parent folder "' + parentFolderName + '" not found!', ui.ButtonSet.OK);
      return;
    }
    
    const parentFolder = parentFolders.next();
    
    // Check if today's folder exists inside parent folder, if not create it
    const folders = parentFolder.getFoldersByName(folderName);
    let backupFolder;
    
    if (folders.hasNext()) {
      backupFolder = folders.next();
    } else {
      backupFolder = parentFolder.createFolder(folderName);
    }
    
    // Create the backup file name
    const backupFileName = timePrefix + '-' + spreadsheetName;
    
    // Make a copy of the spreadsheet (this is synchronous)
    const file = DriveApp.getFileById(spreadsheet.getId());
    const backup = file.makeCopy(backupFileName, backupFolder);
    
    // BACKUP IS NOW COMPLETE - Safe to clear the sheet
    
    // Clear all cells except A1, B1, and C1
    const lastRow = sheet.getMaxRows();
    const lastColumn = sheet.getMaxColumns();
    
    // Clear from D1 to the last column in row 1 (if there are columns beyond C)
    if (lastColumn > 3) {
      sheet.getRange(1, 4, 1, lastColumn - 3).clear();
    }
    
    // Clear from A2 to the last column and last row (everything below row 1)
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, lastColumn).clear();
    }
    
    // Show success message
    ui.alert('Backup Created', 'Backup saved successfully as:\n' + backupFileName + '\n\nSheet will be cleared.', ui.ButtonSet.OK);
    
  } catch (error) {
    ui.alert('Error', 'Failed to create backup: ' + error.toString(), ui.ButtonSet.OK);
  }
}
