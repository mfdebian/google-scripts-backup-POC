# Google Sheets Backup & Restore POC

A proof-of-concept Google Apps Script for creating and restoring spreadsheet
backups with header validation.

## Features

- **Create Backup**: Saves a timestamped copy of your spreadsheet, then
  clears all data except headers
- **Restore from Backup**: Restores headers from the latest backup of the day
- **Recreate Sheet**: Rebuilds a sheet from a predefined configuration with
  values and styles

## Prerequisites

1. **Parent Folder**: Create a folder named `alpi-google-scripts-tests` in
  your Google Drive
2. **Sheet Format**: Your spreadsheet must have the following headers in row 1:
   - A1: `header one`
   - B1: `header two`
   - C1: `header three`

## Installation

1. Open your Google Sheet
2. Go to **Extensions > Apps Script**
3. Create three files with the provided code:
   - `main.gs`
   - `backup.gs`
   - `restore.gs`
4. Save and refresh your spreadsheet
5. A "Backup & Restore" menu will appear in the toolbar

## How It Works

### Backup Process
1. Validates the sheet has correct headers
2. Creates a date-based folder (format: `YYYY-MM-DD`) inside `alpi-google-scripts-tests`
3. Saves a copy with timestamp (format: `HH-MM-sheetname`)
4. Clears all data except the three headers

### Restore Process
1. Finds today's backup folder
2. Selects the latest backup based on timestamp
3. Validates the backup has correct headers
4. Restores the headers to the current sheet

### Recreate Sheet Process
1. Reads sheet configurations from `config.gs`
2. Shows a dialog with available sheet configurations
3. Clears the selected sheet
4. Applies configured cell values and ranges
5. Applies shared styles and cell-specific style overrides

## Backup Structure
```
alpi-google-scripts-tests/
└── 2025-11-24/
    ├── 11-15-expenses
    ├── 14-30-expenses
    └── 16-45-expenses
```
