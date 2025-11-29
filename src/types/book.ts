/**
 * Type definitions for book structure
 * Based on VS Code extension types
 */

export interface SectionMetadata {
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

export interface ChapterMetadata {
  folderPath: string;
  folderName: string;
  chapterNum: string;
  title: string;
  sections: SectionMetadata[];
}

export interface PartMetadata {
  folderPath: string;
  folderName: string;
  partNum: string;
  title: string;
  chapters: ChapterMetadata[];
}

export interface BookStructure {
  introduction?: ChapterMetadata;
  parts: PartMetadata[];
  appendices: ChapterMetadata[];
  rootPath: string;
}
