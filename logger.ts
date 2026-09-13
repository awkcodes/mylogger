import * as readline from 'readline/promises';
import { appendFile, mkdir } from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout 
});

rl.on('SIGINT', () => {
  console.log('\nExiting logger.');
  rl.close();
  process.exit(0);
});

function getFormattedTimestamp(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const month = now.toLocaleString('en-US', { month: 'short' });
  const year = now.getFullYear();

  return `${hours}:${minutes} - ${day} ${month} ${year}`;
}

// Replaces getDailyFileName to parse the timestamp string dynamically
function getFileNameFromTimestamp(timestamp: string): string {
  // Regex to extract DD, MMM, and YYYY (e.g., matches "12 Sep 2026")
  const match = timestamp.match(/(\d{2})\s+([a-zA-Z]{3})\s+(\d{4})/);
  
  if (match) {
    const day = match[1];
    const month = match[2].toLowerCase();
    const year = match[3];
    return `${day}${month}${year}.txt`;
  }

  // Fallback to current date if custom input lacks proper date format
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = now.toLocaleString('en-US', { month: 'short' }).toLowerCase();
  const year = now.getFullYear();
  
  return `${day}${month}${year}.txt`;
}

async function startLogging() {
  const logDir = path.join(os.homedir(), 'logs');
  await mkdir(logDir, { recursive: true });

  while (true) {
    const message = await rl.question('\n> Enter log message: ');
    const useCurrent = await rl.question('> Use current time? (Y/n): ');

    let timestamp: string;

    if (useCurrent.trim().toLowerCase() === 'n') {
      // Must include "DD MMM YYYY" for dynamic file routing to work
      timestamp = await rl.question('> Enter custom time (e.g., 08:00 - 10 Sep 2026): ');
    } else {
      timestamp = getFormattedTimestamp();
    }

    // Pass the finalized timestamp to determine the file name
    const fileName = getFileNameFromTimestamp(timestamp);
    const fullPath = path.join(logDir, fileName);

    await appendFile(fullPath, `${message} | ${timestamp}\n`);
    console.log(`✓ Saved to: ${fullPath}`);
  }
}

startLogging().catch(console.error);
