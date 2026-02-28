import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

type ExcelRow = Record<string, string | number | null | undefined>;

interface ExcelExportOptions {
    headers?: Record<string, string>;
    columnWidths?: number[];
}

export const exportarExcel = (
    fileName: string,
    sheetName: string,
    rows: ExcelRow[],
    options?: ExcelExportOptions
) => {
    const exportRows = options?.headers
        ? rows.map((row) => {
            const mapped: ExcelRow = {};
            Object.entries(options.headers || {}).forEach(([key, label]) => {
                mapped[label] = row[key];
            });
            return mapped;
        })
        : rows;

    const worksheet = XLSX.utils.json_to_sheet(exportRows);

    if (options?.columnWidths?.length) {
        worksheet['!cols'] = options.columnWidths.map((wch) => ({ wch }));
    }

    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
    worksheet['!autofilter'] = {
        ref: XLSX.utils.encode_range({ s: { c: 0, r: 0 }, e: { c: range.e.c, r: 0 } })
    };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportarPdf = (
    title: string,
    fileName: string,
    columns: string[],
    rows: Array<Array<string | number>>
) => {
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.setFontSize(14);
    doc.text(title, 14, 15);
    doc.setFontSize(9);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 22);

    autoTable(doc, {
        head: [columns],
        body: rows,
        startY: 28,
        styles: {
            fontSize: 8,
            cellPadding: 2
        },
        headStyles: {
            fillColor: [35, 75, 170]
        }
    });

    doc.save(`${fileName}.pdf`);
};
