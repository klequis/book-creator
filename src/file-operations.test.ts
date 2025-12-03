import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import type { SectionUpdate } from './movement-operations';

// Mock Tauri's filesystem plugin
jest.mock('@tauri-apps/plugin-fs', () => ({
  rename: jest.fn(),
  readTextFile: jest.fn(),
  writeTextFile: jest.fn(),
  exists: jest.fn()
}));

import { rename, readTextFile, writeTextFile, exists } from '@tauri-apps/plugin-fs';
import { applyFileSystemChanges, validateFilesExist } from './file-operations';

describe('File Operations', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    // By default, assume files exist (tests can override this)
    (exists as jest.Mock).mockResolvedValue(true);
  });

  describe('applyFileSystemChanges', () => {
    
    test('renames file when path changes', async () => {
      const updates: SectionUpdate[] = [{
        id: 'section-1',
        level: 2,
        order: 1,
        parentId: 's1-id',
        oldFilePath: '/book/chapter/02-section.md',
        newFilePath: '/book/chapter/01-section.md'
      }];

      const allSections = [
        { id: 's1-id', order: 1, parentId: undefined },
        { id: 'section-1', order: 1, parentId: 's1-id' }
      ];

      (readTextFile as jest.Mock).mockResolvedValue('## 1.2 Section Title\n\nContent here');
      (rename as jest.Mock).mockResolvedValue(undefined);
      (writeTextFile as jest.Mock).mockResolvedValue(undefined);

      await applyFileSystemChanges(updates, allSections);

      expect(rename).toHaveBeenCalledWith(
        '/book/chapter/02-section.md',
        '/book/chapter/01-section.md'
      );
    });

    test('does not rename file when path unchanged', async () => {
      const updates: SectionUpdate[] = [{
        id: 'section-1',
        level: 2,
        order: 1,
        parentId: 's1-id',
        oldFilePath: '/book/chapter/01-section.md',
        newFilePath: '/book/chapter/01-section.md'
      }];

      const allSections = [
        { id: 's1-id', order: 1, parentId: undefined },
        { id: 'section-1', order: 1, parentId: 's1-id' }
      ];

      (readTextFile as jest.Mock).mockResolvedValue('## 1.1 Section Title\n\nContent here');
      (writeTextFile as jest.Mock).mockResolvedValue(undefined);

      await applyFileSystemChanges(updates, allSections);

      expect(rename).not.toHaveBeenCalled();
    });

    test('updates heading with correct level and prefix', async () => {
      const updates: SectionUpdate[] = [{
        id: 'section-1',
        level: 2,
        order: 1,
        parentId: 's1-id',
        oldFilePath: '/book/chapter/01-section.md',
        newFilePath: '/book/chapter/01-section.md'
      }];

      const allSections = [
        { id: 's1-id', order: 1, parentId: undefined },
        { id: 'section-1', order: 1, parentId: 's1-id' }
      ];

      (readTextFile as jest.Mock).mockResolvedValue('## 1.2 Old Prefix\n\nContent here');
      (writeTextFile as jest.Mock).mockResolvedValue(undefined);

      await applyFileSystemChanges(updates, allSections);

      expect(writeTextFile).toHaveBeenCalledWith(
        '/book/chapter/01-section.md',
        '## 1.1 Old Prefix\n\nContent here'
      );
    });

    test('updates heading for S3 with multi-level prefix', async () => {
      const updates: SectionUpdate[] = [{
        id: 'section-3',
        level: 3,
        order: 2,
        parentId: 'section-2',
        oldFilePath: '/book/chapter/03-subsection.md',
        newFilePath: '/book/chapter/03-subsection.md'
      }];

      const allSections = [
        { id: 's1-id', order: 1, parentId: undefined },
        { id: 'section-2', order: 1, parentId: 's1-id' },
        { id: 'section-3', order: 2, parentId: 'section-2' }
      ];

      (readTextFile as jest.Mock).mockResolvedValue('### 1.1.1 Subsection\n\nContent');
      (writeTextFile as jest.Mock).mockResolvedValue(undefined);

      await applyFileSystemChanges(updates, allSections);

      expect(writeTextFile).toHaveBeenCalledWith(
        '/book/chapter/03-subsection.md',
        '### 1.1.2 Subsection\n\nContent'
      );
    });

    test('preserves title text when updating heading', async () => {
      const updates: SectionUpdate[] = [{
        id: 'section-1',
        level: 2,
        order: 2,
        parentId: 's1-id',
        oldFilePath: '/book/chapter/01-section.md',
        newFilePath: '/book/chapter/02-section.md'
      }];

      const allSections = [
        { id: 's1-id', order: 1, parentId: undefined },
        { id: 'section-1', order: 2, parentId: 's1-id' }
      ];

      (readTextFile as jest.Mock).mockResolvedValue('## 1.1 Important Section Title\n\nSome content');
      (rename as jest.Mock).mockResolvedValue(undefined);
      (writeTextFile as jest.Mock).mockResolvedValue(undefined);

      await applyFileSystemChanges(updates, allSections);

      expect(writeTextFile).toHaveBeenCalledWith(
        '/book/chapter/02-section.md',
        expect.stringContaining('Important Section Title')
      );
    });

    test('processes multiple updates in sequence', async () => {
      const updates: SectionUpdate[] = [
        {
          id: 'section-1',
          level: 2,
          order: 2,
          parentId: 's1-id',
          oldFilePath: '/book/chapter/01-section.md',
          newFilePath: '/book/chapter/02-section.md'
        },
        {
          id: 'section-2',
          level: 2,
          order: 1,
          parentId: 's1-id',
          oldFilePath: '/book/chapter/02-section.md',
          newFilePath: '/book/chapter/01-section.md'
        }
      ];

      const allSections = [
        { id: 's1-id', order: 1, parentId: undefined },
        { id: 'section-1', order: 2, parentId: 's1-id' },
        { id: 'section-2', order: 1, parentId: 's1-id' }
      ];

      (readTextFile as jest.Mock).mockResolvedValue('## 1.1 Title\n\nContent');
      (rename as jest.Mock).mockResolvedValue(undefined);
      (writeTextFile as jest.Mock).mockResolvedValue(undefined);

      await applyFileSystemChanges(updates, allSections);

      expect(rename).toHaveBeenCalledTimes(2);
      expect(writeTextFile).toHaveBeenCalledTimes(2);
    });

    test('throws error when file has no heading', async () => {
      const updates: SectionUpdate[] = [{
        id: 'section-1',
        level: 2,
        order: 1,
        parentId: 's1-id',
        oldFilePath: '/book/chapter/01-section.md',
        newFilePath: '/book/chapter/01-section.md'
      }];

      const allSections = [
        { id: 's1-id', order: 1, parentId: undefined },
        { id: 'section-1', order: 1, parentId: 's1-id' }
      ];

      (readTextFile as jest.Mock).mockResolvedValue('Just plain text, no heading');

      await expect(applyFileSystemChanges(updates, allSections))
        .rejects.toThrow('No heading found');
    });

    test('throws error when file does not exist', async () => {
      const updates: SectionUpdate[] = [{
        id: 'section-1',
        level: 2,
        order: 1,
        parentId: 's1-id',
        oldFilePath: '/book/chapter/missing.md',
        newFilePath: '/book/chapter/01-section.md'
      }];

      const allSections = [
        { id: 's1-id', order: 1, parentId: undefined },
        { id: 'section-1', order: 1, parentId: 's1-id' }
      ];

      (exists as jest.Mock).mockResolvedValue(false);

      await expect(applyFileSystemChanges(updates, allSections))
        .rejects.toThrow('File does not exist');
    });
  });

  describe('validateFilesExist', () => {
    
    test('returns true when all files exist', async () => {
      const updates: SectionUpdate[] = [
        {
          id: 'section-1',
          level: 2,
          order: 1,
          parentId: 's1-id',
          oldFilePath: '/book/chapter/01-section.md',
          newFilePath: '/book/chapter/02-section.md'
        },
        {
          id: 'section-2',
          level: 2,
          order: 2,
          parentId: 's1-id',
          oldFilePath: '/book/chapter/02-section.md',
          newFilePath: '/book/chapter/01-section.md'
        }
      ];

      (readTextFile as jest.Mock).mockResolvedValue('file content');

      const result = await validateFilesExist(updates);

      expect(result).toBe(true);
      expect(readTextFile).toHaveBeenCalledTimes(2);
    });

    test('returns false when a file does not exist', async () => {
      const updates: SectionUpdate[] = [{
        id: 'section-1',
        level: 2,
        order: 1,
        parentId: 's1-id',
        oldFilePath: '/book/chapter/missing.md',
        newFilePath: '/book/chapter/01-section.md'
      }];

      (readTextFile as jest.Mock).mockRejectedValue(new Error('File not found'));

      const result = await validateFilesExist(updates);

      expect(result).toBe(false);
    });
  });

  describe('heading prefix calculation', () => {
    
    test('S1 has no prefix (just order)', async () => {
      const updates: SectionUpdate[] = [{
        id: 's1-id',
        level: 1,
        order: 1,
        parentId: undefined,
        oldFilePath: '/book/chapter/01-title.md',
        newFilePath: '/book/chapter/01-title.md'
      }];

      const allSections = [
        { id: 's1-id', order: 1, parentId: undefined }
      ];

      (readTextFile as jest.Mock).mockResolvedValue('# Chapter Title\n\nContent');
      (writeTextFile as jest.Mock).mockResolvedValue(undefined);

      await applyFileSystemChanges(updates, allSections);

      expect(writeTextFile).toHaveBeenCalledWith(
        '/book/chapter/01-title.md',
        '# 1 Chapter Title\n\nContent'
      );
    });

    test('S2 has prefix X.Y', async () => {
      const updates: SectionUpdate[] = [{
        id: 'section-2',
        level: 2,
        order: 3,
        parentId: 's1-id',
        oldFilePath: '/book/chapter/03-section.md',
        newFilePath: '/book/chapter/03-section.md'
      }];

      const allSections = [
        { id: 's1-id', order: 1, parentId: undefined },
        { id: 'section-2', order: 3, parentId: 's1-id' }
      ];

      (readTextFile as jest.Mock).mockResolvedValue('## Section Title\n\nContent');
      (writeTextFile as jest.Mock).mockResolvedValue(undefined);

      await applyFileSystemChanges(updates, allSections);

      expect(writeTextFile).toHaveBeenCalledWith(
        '/book/chapter/03-section.md',
        '## 1.3 Section Title\n\nContent'
      );
    });

    test('S4 has prefix W.X.Y.Z', async () => {
      const updates: SectionUpdate[] = [{
        id: 'section-4',
        level: 4,
        order: 2,
        parentId: 'section-3',
        oldFilePath: '/book/chapter/04-subsubsection.md',
        newFilePath: '/book/chapter/04-subsubsection.md'
      }];

      const allSections = [
        { id: 's1-id', order: 1, parentId: undefined },
        { id: 'section-2', order: 2, parentId: 's1-id' },
        { id: 'section-3', order: 1, parentId: 'section-2' },
        { id: 'section-4', order: 2, parentId: 'section-3' }
      ];

      (readTextFile as jest.Mock).mockResolvedValue('#### Deep Section\n\nContent');
      (writeTextFile as jest.Mock).mockResolvedValue(undefined);

      await applyFileSystemChanges(updates, allSections);

      expect(writeTextFile).toHaveBeenCalledWith(
        '/book/chapter/04-subsubsection.md',
        '#### 1.2.1.2 Deep Section\n\nContent'
      );
    });
  });
});
