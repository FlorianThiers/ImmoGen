import { abexIndex } from './data/abexIndex';

export function getAbexValue(year: number, month: 'january' | 'july'): number {
    const index = abexIndex.find((entry) => entry.year === year);
    if (!index) {
        throw new Error(`ABEX index not found for year ${year}`);
    }
    return index[month];
}

export function calculateAbex(
    constructionYear: number,
    currentYear: number,
    abexAtConstruction: number,
    abexCurrent: number
): number {
    if (constructionYear > currentYear) {
        throw new Error("Construction year cannot be in the future.");
    }

    const yearsSinceConstruction = currentYear - constructionYear;
    const abexValue = getAbexValue(currentYear, 'july'); // Use July value for current year

    return (abexValue / abexAtConstruction) * abexCurrent * (1 + yearsSinceConstruction * 0.01);
}