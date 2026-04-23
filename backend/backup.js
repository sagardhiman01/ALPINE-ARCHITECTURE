const fs = require('fs');
const path = require('path');

// Simple Backup Script (Backups & Recovery Layer)
const DB_FILE = path.join(__dirname, 'database.json');
const BACKUP_DIR = path.join(__dirname, 'backups');

if (!fs.existsSync(BACKUP_DIR)){
    fs.mkdirSync(BACKUP_DIR);
}

const timestamp = new Date().toISOString().replace(/:/g, '-');
const backupFile = path.join(BACKUP_DIR, `database_backup_${timestamp}.json`);

fs.copyFile(DB_FILE, backupFile, (err) => {
    if (err) {
        console.error('Error creating database backup:', err);
    } else {
        console.log(`Database successfully backed up to ${backupFile}`);
    }
});
