import { logger } from "./logger";

const getColumnCount = (rows: unknown[][]): number => {
    const maxColumns = rows.reduce((max, row) => Math.max(max, row.length), 0);
    return Math.max(1, maxColumns);
}

const toCellValue = (value: unknown): string => {
    if (value === null || value === undefined || value === '') {
        return '<br>';
    }

    return String(value);
}

const toFixedColumnRow = (row: unknown[], columnCount: number): string[] => {
    const cells = row.slice(0, columnCount).map(toCellValue);

    while (cells.length < columnCount) {
        cells.push('<br>');
    }

    return cells;
}

const createColGroup = (columnCount: number): string => {
    const columnWidth = (100 / columnCount).toFixed(4);
    return `<colgroup>${Array.from({ length: columnCount }, () => `<col style="width: ${columnWidth}%;">`).join('')}</colgroup>`;
}

const createRow = (row: unknown[], columnCount: number, isHeader: boolean): string => {
    const cells = toFixedColumnRow(row, columnCount)
        .map(cell => isHeader ? `<td><strong>${cell}</strong></td>` : `<td>${cell}</td>`)
        .join('');

    return `<tr>${cells}</tr>`;
}

type ObjectiveSection = {
    header: string[];
    data: unknown[][];
};

export const createObjective = (...sections: ObjectiveSection[]) => {
    if (sections.length === 0) {
        throw new Error('createObjective requires at least one section');
    }

    const rows: unknown[][] = sections.flatMap(section => [section.header, ...section.data]);
    const columnCount = getColumnCount(rows);
    const body = sections
        .map(section => {
            const sectionRows = [
                createRow(section.header, columnCount, true),
                ...section.data.map(row => createRow(row, columnCount, false))
            ];

            return sectionRows.join('');
        })
        .join('');

    const table = `<table style="width: 50%; margin: auto; border-width: 1px; border-style: solid;">${createColGroup(columnCount)}<tbody>${body}</tbody></table>`;

    logger.info('Objective table created successfully');

    return table;
}
