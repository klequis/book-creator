// Filesystem operations using Tauri
import { rename, readTextFile, writeTextFile, exists } from '@tauri-apps/plugin-fs';
import type { SectionUpdate } from './movement-operations';

/**
 * Calculate heading prefix from section hierarchy
 * Examples: "1.2.3" for S3, "1.2" for S2, etc.
 */
function calculateHeadingPrefix(update: SectionUpdate, allSections: Array<{id: string, order: number, parentId?: string}>): string {
  const parts: number[] = [update.order];
  
  // Walk up parent chain
  let currentParentId = update.parentId;
  while (currentParentId) {
    const parent = allSections.find(s => s.id === currentParentId);
    if (!parent) break;
    parts.unshift(parent.order);
    currentParentId = parent.parentId;
  }
  
  return parts.join('.');
}

/**
 * Update the heading in a markdown file
 * Replaces the first heading with the correct level and prefix
 */
async function updateHeadingInFile(
  filePath: string,
  level: 1 | 2 | 3 | 4,
  headingPrefix: string
): Promise<void> {
  // Read file content
  const content = await readTextFile(filePath);
  const lines = content.split('\n');
  
  // Find first heading line
  const headingRegex = /^#{1,4}\s+(?:\d+(?:\.\d+)*\s+)?(.+)$/;
  let firstHeadingIndex = -1;
  let originalTitle = '';
  
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(headingRegex);
    if (match) {
      firstHeadingIndex = i;
      originalTitle = match[1];
      break;
    }
  }
  
  if (firstHeadingIndex === -1) {
    throw new Error(`No heading found in ${filePath}`);
  }
  
  // Create new heading
  const hashes = '#'.repeat(level);
  const newHeading = `${hashes} ${headingPrefix} ${originalTitle}`;
  
  // Replace heading
  lines[firstHeadingIndex] = newHeading;
  
  // Write back
  await writeTextFile(filePath, lines.join('\n'));
}

/**
 * Apply filesystem changes for section updates
 * 1. Validates all files exist
 * 2. Renames files
 * 3. Updates headings in files
 */
export async function applyFileSystemChanges(
  updates: SectionUpdate[],
  allSections: Array<{id: string, order: number, parentId?: string}>
): Promise<void> {
  // Track which files have been processed to avoid conflicts
  const processedFiles = new Set<string>();
  
  try {
    // First, validate all files exist
    for (const update of updates) {
      const fileExists = await exists(update.oldFilePath);
      if (!fileExists) {
        throw new Error(`File does not exist: ${update.oldFilePath}. The file may have been moved or deleted outside the application.`);
      }
    }
    
    // Process updates in order
    for (const update of updates) {
      // Skip if already processed (shouldn't happen, but safety check)
      if (processedFiles.has(update.oldFilePath)) {
        continue;
      }
      
      // 1. Rename file if path changed
      if (update.oldFilePath !== update.newFilePath) {
        try {
          await rename(update.oldFilePath, update.newFilePath);
        } catch (error) {
          throw new Error(`Failed to rename ${update.oldFilePath} to ${update.newFilePath}: ${error}`);
        }
      }
      
      // 2. Update heading in file (use new path after rename)
      const targetPath = update.newFilePath;
      try {
        const headingPrefix = calculateHeadingPrefix(update, allSections);
        await updateHeadingInFile(targetPath, update.level, headingPrefix);
      } catch (error) {
        throw new Error(`Failed to update heading in ${targetPath}: ${error}`);
      }
      
      processedFiles.add(update.oldFilePath);
    }
  } catch (error) {
    // TODO: Implement rollback logic
    console.error('Failed to apply filesystem changes:', error);
    throw error;
  }
}

/**
 * Validate that all files in updates exist before making changes
 */
export async function validateFilesExist(updates: SectionUpdate[]): Promise<boolean> {
  try {
    for (const update of updates) {
      // Try to read the file to verify it exists
      await readTextFile(update.oldFilePath);
    }
    return true;
  } catch (error) {
    console.error('File validation failed:', error);
    return false;
  }
}
