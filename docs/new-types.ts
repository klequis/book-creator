/**
 * Types derived from notation.md
 */

interface Section {
    id: string; // 8-byte hex: xxxx-xxxx-xxxx-xxxx
    level: 1 | 2 | 3 | 4;
    filePath: string;
    parentId?: string;
    order: number;
}

interface Introduction {
    id: string; // 8-byte hex: xxxx-xxxx-xxxx-xxxx
    sections: Section[]; // S1 (required), S2, S3, S4 (optional)
}

interface Part {
    id: string; // 8-byte hex: xxxx-xxxx-xxxx-xxxx
    sections: Section[]; // Only S1 (title page). Cannot have S2, S3, S4
    chapters: Chapter[];
}

interface Chapter {
    id: string; // 8-byte hex: xxxx-xxxx-xxxx-xxxx
    sections: Section[]; // S1 (required), S2, S3, S4 (optional)
}

interface Appendix {
    id: string; // 8-byte hex: xxxx-xxxx-xxxx-xxxx
    sections: Section[]; // S1 (required), S2, S3, S4 (optional)
}

interface Book {
    introduction?: Introduction;
    parts?: Part[];
    chapters: Chapter[];
    appendices: Appendix[];
}
