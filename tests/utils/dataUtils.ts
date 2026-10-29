import * as fs from 'fs';

// Unique per run; OrangeHRM rejects duplicate IDs and allows max 10 chars
export function uniqueId(): string {
    return Date.now().toString().slice(-8);
}

// Merge new values into a JSON test-data file, keeping the other fields
export function updateJson(file: string, values: Record<string, string>) {
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    Object.assign(data, values);
    fs.writeFileSync(file, JSON.stringify(data, null, 3));
}
