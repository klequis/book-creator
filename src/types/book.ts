/**
 * Type definitions for book structure
 * Flat/normalized structure with ID-based relationships
 */

export interface Section {
  id: string;
  chapterId: string;
  filePath: string;
  fileName: string;
  title: string;
  chapterNum: string;
  section2Num: string;
  section3Num: string;
  section4Num: string;
  displayLabel: string;
  level: number; // 0=chapter, 1=section2, 2=section3, 3=section4
}

export interface Chapter {
  id: string;
  bookPartId: string | null; // null = standalone chapter
  folderPath: string;
  folderName: string;
  chapterNum: string;
  title: string;
  isIntroduction: boolean;
  isAppendix: boolean;
}

export interface BookPart {
  id: string;
  folderPath: string;
  folderName: string;
  partNum: string;
  title: string;
}

export interface Book {
  rootPath: string;
  resourcesPath: string | null;
  bookParts: BookPart[];
  chapters: Chapter[];
  sections: Section[];
}
