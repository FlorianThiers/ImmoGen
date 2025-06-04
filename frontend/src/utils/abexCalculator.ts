import { abexIndex } from './data/abexIndex';

export function getAbexValue(year: number | string, month: 'january' | 'july'): number {
    const yearNum = Number(year);
    console.log(`Fetching ABEX value for year: ${yearNum}, month: ${month}`);
    const index = abexIndex.find((entry) => entry.year === yearNum);
    console.log(`Found ABEX index: ${JSON.stringify(index)}`);
    if (!index) {
        throw new Error(`ABEX index not found for year ${yearNum}`);
    }
    return index[month];
}

export function calculateAbex(
    constructionYear: number,
    currentYear: number,
    abexAtConstruction: number,
    abexCurrent: number
): number {
    console.log(`Calculating ABEX for construction year: ${constructionYear}, current year: ${currentYear}`);
    if (constructionYear > currentYear) {
        throw new Error("Construction year cannot be in the future.");
    }

    console.log(`ABEX at construction: ${abexAtConstruction}, ABEX current: ${abexCurrent}`);
    const yearsSinceConstruction = currentYear - constructionYear;

    console.log(`Years since construction: ${yearsSinceConstruction}`);
    const abexYear = Number(abexCurrent); // of construction_year
    const abexValue = getAbexValue(abexYear, "july");

    return (abexValue / abexAtConstruction) * abexCurrent * (1 + yearsSinceConstruction * 0.01);
}