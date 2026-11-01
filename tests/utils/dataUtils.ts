import * as fs from 'fs';

// Unique per run; OrangeHRM rejects duplicate IDs and allows max 10 chars
export function uniqueId(): string {
    return Date.now().toString().slice(-8);
}

// Random weekday from start up to a week before end, so a leave range never runs past end.
// Random so repeat runs don't hit "Failed to Submit" for overlapping leave; weekday so it has working days.
export function weekdayBetween(start: Date, end: Date): Date {
    const days = Math.floor((end.getTime() - start.getTime()) / 86_400_000) - 7;
    const date = new Date(start);
    date.setDate(date.getDate() + Math.floor(Math.random() * days));
    while (date.getDay() === 0 || date.getDay() === 6) {
        date.setDate(date.getDate() + 1);
    }
    return date;
}

// OrangeHRM shows dates as yyyy-dd-mm
export function parseDate(value: string): Date {
    const [yyyy, dd, mm] = value.split('-').map(Number);
    return new Date(yyyy, mm - 1, dd);
}

export function formatDate(date: Date): string {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    return `${date.getFullYear()}-${dd}-${mm}`;
}

// Merge new values into a JSON test-data file, keeping the other fields
export function updateJson(file: string, values: Record<string, string>) {
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    Object.assign(data, values);
    fs.writeFileSync(file, JSON.stringify(data, null, 3));
}
