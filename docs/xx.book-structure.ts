// /**
//  * level: the first level is 1: 1,2,3,4
//  * title: is the title at the top of a .md file
//  * 
//  */

// type Level = 0 | 1 | 2 | 3 | 4;

// type bookElementType = "bookElementPart" | "bookElementIntroduction" | "bookElementChapter" | "bookElementSection" | "bookElementAppendix";

// interface Book {
//     rootPath: string; // /path/to/book
//     resourcesPath: string | null; // /path/to/resources or null
//     introduction?: Introduction;
//     parts?: Part[]; // Optional: book may have parts containing chapters
//     chapters: Chapter[]; // Chapters at book level (if no parts) or standalone
//     appendices: Appendix[];
// }

// interface BookElement {
//     id: string; // 5c2a-8f3b-1d4e-9a7c
//     type: bookElementType;
//     level: Level; // 0, 1, 2, 3, 4
//     title: string; // Title for this book part
//     order: number; // Position among siblings
// }

// interface Part extends BookElement {
//     type: "bookElementPart";
//     level: 0; // 0 # (same level as introduction)
//     order: number; // 1, 2, 3 (Part I, Part II, etc.)
//     chapters: Chapter[]; // Chapters within this part
// }

// interface Introduction extends BookElement {
//     type: "bookElementIntroduction";
//     level: 0; // 0 #
//     folderPath: string; // /path/to/introduction-folder
//     titlePagePath: string; // /path/to/title-page-file.md
//     sections: Section[];
// }

// interface Chapter extends BookElement {
//     type: "bookElementChapter";
//     level: 1; // 1 # 
//     folderPath: string; // /path/to/chapter-folder
//     titlePagePath: string; // /path/to/title-page-file.md
//     partId?: string; // Optional: which part contains this chapter
//     sections: Section[];
// }

// interface Section extends BookElement {
//     type: "bookElementSection";
//     level: 2 | 3 | 4; // 2 ##, 3 ###, 4 ####
//     filePath: string; // /path/to/section-file.md
//     title: string; // Section Title
//     chapterId: string; // Which chapter/intro/appendix owns this
//     parentId?: string; // Which section is parent (optional for level 2)
// }

// interface Appendix extends BookElement {
//     type: "bookElementAppendix";
//     level: 1; // 1 #
//     folderPath: string; // /path/to/appendix-folder
//     titlePagePath: string; // /path/to/title-page-file.md
//     sections: Section[];
// }