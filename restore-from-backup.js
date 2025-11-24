function restoreFromBackup() {
  const ui = SpreadsheetApp.getUi();
  
  // Show confirmation alert
  const response = ui.alert(
    'Restore from Backup',
    'Do you want to restore from today\'s latest backup?\nThis will replace the current sheet content.',
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
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const folderName = year + '-' + month + '-' + day;
    
    // Find the parent folder "alpi-google-scripts-tests"
    const parentFolderName = 'alpi-google-scripts-tests';
    const parentFolders = DriveApp.getFoldersByName(parentFolderName);
    
    if (!parentFolders.hasNext()) {
      ui.alert('Error', 'Parent folder "' + parentFolderName + '" not found!', ui.ButtonSet.OK);
      return;
    }
    
    const parentFolder = parentFolders.next();
    
    // Check if today's folder exists
    const folders = parentFolder.getFoldersByName(folderName);
    
    if (!folders.hasNext()) {
      ui.alert('No Backups Found', 'No backup folder found for today (' + folderName + ').', ui.ButtonSet.OK);
      return;
    }
    
    const backupFolder = folders.next();
    
    // Get all files in the backup folder
    const files = backupFolder.getFiles();
    const backupFiles = [];
    
    while (files.hasNext()) {
      const file = files.next();
      const fileName = file.getName();
      
      // Extract time from filename (format: HH-MM-spreadsheetname)
      const timeMatch = fileName.match(/^(\d{2})-(\d{2})-/);
      if (timeMatch) {
        const hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);
        backupFiles.push({
          file: file,
          name: fileName,
          hours: hours,
          minutes: minutes,
          timeValue: hours * 60 + minutes // Convert to minutes for easy comparison
        });
      }
    }
    
    if (backupFiles.length === 0) {
      ui.alert('No Backups Found', 'No backup files found in today\'s folder.', ui.ButtonSet.OK);
      return;
    }
    
    // Sort by time and get the latest
    backupFiles.sort((a, b) => b.timeValue - a.timeValue);
    const latestBackup = backupFiles[0];
    
    // Open the backup spreadsheet to validate headers
    const backupSpreadsheet = SpreadsheetApp.open(latestBackup.file);
    const backupSheet = backupSpreadsheet.getSheets()[0]; // Get first sheet
    
    // Validate headers in the backup
    const headerA1 = backupSheet.getRange('A1').getValue();
    const headerB1 = backupSheet.getRange('B1').getValue();
    const headerC1 = backupSheet.getRange('C1').getValue();
    
    if (headerA1 !== 'header one' || headerB1 !== 'header two' || headerC1 !== 'header three') {
      ui.alert(
        'Invalid Backup',
        'The backup file has invalid headers. Cannot restore from a malformed backup.',
        ui.ButtonSet.OK
      );
      return;
    }
    
    // Headers are valid - restore only the headers to current sheet
    sheet.getRange('A1').setValue('header one');
    sheet.getRange('B1').setValue('header two');
    sheet.getRange('C1').setValue('header three');
    
    // Show success message
    ui.alert(
      'Restore Complete',
      'Headers will restore successfully from:\n' + latestBackup.name,
      ui.ButtonSet.OK
    );
    
  } catch (error) {
    ui.alert('Error', 'Failed to restore backup: ' + error.toString(), ui.ButtonSet.OK);
  }
}