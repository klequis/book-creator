/**
 * Types derived from notation.md
 */

export interface Section {
    id: string; // 8-byte hex: xxxx-xxxx-xxxx-xxxx
    level: 1 | 2 | 3 | 4;
    filePath: string;
    parentId?: string;
    order: number;
}

export interface Introduction {
    id: string; // 8-byte hex: xxxx-xxxx-xxxx-xxxx
    sections: Section[]; // S1 (required), S2, S3, S4 (optional)
}

export interface Part {
    id: string; // 8-byte hex: xxxx-xxxx-xxxx-xxxx
    sections: Section[]; // Only S1 (title page). Cannot have S2, S3, S4
    chapters: Chapter[];
}

export interface Chapter {
    id: string; // 8-byte hex: xxxx-xxxx-xxxx-xxxx
    sections: Section[]; // S1 (required), S2, S3, S4 (optional)
}

export interface Appendix {
    id: string; // 8-byte hex: xxxx-xxxx-xxxx-xxxx
    sections: Section[]; // S1 (required), S2, S3, S4 (optional)
}

export interface Book {
    introduction?: Introduction;
    parts?: Part[];
    chapters: Chapter[];
    appendices: Appendix[];
}

