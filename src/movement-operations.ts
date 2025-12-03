// Movement operations for book sections

export interface Section {
  id: string;
  level: 1 | 2 | 3 | 4;
  filePath: string;
  parentId?: string;
  order: number;
}

export type SectionUpdate = {
  id: string;
  level: 1 | 2 | 3 | 4;
  order: number;
  parentId?: string;
  filePath: string;
}

/**
 * Move section up in outline (smart operation)
 * - Swaps with previous sibling if one exists
 * - Promotes level if at top of siblings
 */
export function orderPlus(sectionId: string, sections: Section[]): SectionUpdate[] {
  const section = sections.find(s => s.id === sectionId);
  if (!section) {
    throw new Error(`Section ${sectionId} not found`);
  }

  // S1 cannot move
  if (section.level === 1) {
    throw new Error('S1 (title page) cannot be moved');
  }

  const siblings = getSiblings(section, sections);
  const sectionIndex = siblings.findIndex(s => s.id === sectionId);
  
  if (sectionIndex === -1) {
    throw new Error('Section not found among siblings');
  }

  // Check if there's a previous sibling
  if (sectionIndex > 0) {
    const prevSibling = siblings[sectionIndex - 1];
    
    // Cannot move above S1
    if (prevSibling.level === 1) {
      throw new Error('Cannot move above S1 (title page)');
    }
    
    // Simple swap with previous sibling
    return swapSiblings(section, prevSibling, sections);
  }

  // At top of siblings - try to promote
  return promoteLevel(section, sections);
}

/**
 * Move section down in outline (smart operation)
 * - Swaps with next sibling if one exists
 * - Demotes level if at bottom of siblings
 */
export function orderMinus(sectionId: string, sections: Section[]): SectionUpdate[] {
  const section = sections.find(s => s.id === sectionId);
  if (!section) {
    throw new Error(`Section ${sectionId} not found`);
  }

  // S1 cannot move
  if (section.level === 1) {
    throw new Error('S1 (title page) cannot be moved');
  }

  const siblings = getSiblings(section, sections);
  const sectionIndex = siblings.findIndex(s => s.id === sectionId);
  
  if (sectionIndex === -1) {
    throw new Error('Section not found among siblings');
  }

  // Check if there's a next sibling
  if (sectionIndex < siblings.length - 1) {
    const nextSibling = siblings[sectionIndex + 1];
    
    // Simple swap with next sibling
    return swapSiblings(section, nextSibling, sections);
  }

  // At bottom of siblings - try to demote
  return demoteLevel(section, sections);
}

/**
 * Promote section one level (explicit operation)
 * Becomes sibling of parent
 */
export function levelPlus(sectionId: string, sections: Section[]): SectionUpdate[] {
  const section = sections.find(s => s.id === sectionId);
  if (!section) {
    throw new Error(`Section ${sectionId} not found`);
  }

  // S1 cannot be promoted
  if (section.level === 1) {
    throw new Error('S1 is already at top level');
  }

  // Cannot promote S2 to S1 (only title page can be S1)
  if (section.level === 2) {
    throw new Error('Cannot promote S2 to S1 - S1 must be title page');
  }

  return promoteLevel(section, sections);
}

/**
 * Demote section one level (explicit operation)
 * Becomes child of previous sibling or stays if no valid parent
 */
export function levelMinus(sectionId: string, sections: Section[]): SectionUpdate[] {
  const section = sections.find(s => s.id === sectionId);
  if (!section) {
    throw new Error(`Section ${sectionId} not found`);
  }

  // S1 cannot be demoted
  if (section.level === 1) {
    throw new Error('S1 cannot be demoted');
  }

  // Cannot demote S4 (max depth)
  if (section.level === 4) {
    throw new Error('S4 is already at maximum depth');
  }

  return demoteLevel(section, sections);
}

// Helper functions

function getSiblings(section: Section, sections: Section[]): Section[] {
  return sections
    .filter(s => s.parentId === section.parentId)
    .sort((a, b) => a.order - b.order);
}

function getParent(section: Section, sections: Section[]): Section | undefined {
  if (!section.parentId) return undefined;
  return sections.find(s => s.id === section.parentId);
}

function swapSiblings(section1: Section, section2: Section, sections: Section[]): SectionUpdate[] {
  const updates: SectionUpdate[] = [];

  // Swap order values
  updates.push({
    id: section1.id,
    level: section1.level,
    order: section2.order,
    parentId: section1.parentId,
    filePath: calculateFilePath(section1.filePath, section2.order)
  });

  updates.push({
    id: section2.id,
    level: section2.level,
    order: section1.order,
    parentId: section2.parentId,
    filePath: calculateFilePath(section2.filePath, section1.order)
  });

  return updates;
}

function promoteLevel(section: Section, sections: Section[]): SectionUpdate[] {
  const parent = getParent(section, sections);
  
  if (!parent) {
    throw new Error('Cannot promote - no parent found');
  }

  const grandparent = getParent(parent, sections);
  const newLevel = (section.level - 1) as 1 | 2 | 3 | 4;
  const newParentId = grandparent?.id;
  
  // Cannot promote to S1 level (S1 must be title page)
  if (newLevel === 1) {
    throw new Error('Cannot promote to S1 - S1 must be title page');
  }
  
  // Insert after parent in grandparent's children
  const newOrder = parent.order + 1;
  
  const updates: SectionUpdate[] = [];

  // Update the promoted section
  updates.push({
    id: section.id,
    level: newLevel,
    order: newOrder,
    parentId: newParentId,
    filePath: calculateFilePath(section.filePath, newOrder)
  });

  // Renumber subsequent siblings of grandparent
  const grandparentSiblings = getSiblings(parent, sections);
  grandparentSiblings
    .filter(s => s.order >= newOrder && s.id !== section.id)
    .forEach(sibling => {
      updates.push({
        id: sibling.id,
        level: sibling.level,
        order: sibling.order + 1,
        parentId: sibling.parentId,
        filePath: calculateFilePath(sibling.filePath, sibling.order + 1)
      });
    });

  return updates;
}

function demoteLevel(section: Section, sections: Section[]): SectionUpdate[] {
  const siblings = getSiblings(section, sections);
  const sectionIndex = siblings.findIndex(s => s.id === section.id);
  
  // First child at level 2 can demote even without previous sibling
  // It becomes first child of parent (S1)
  if (sectionIndex === 0 && section.level === 2) {
    // S2 as first child demotes to S3 under parent (S1)
    const parent = getParent(section, sections);
    if (!parent) {
      throw new Error('Cannot demote - no parent found');
    }
    
    const newLevel = 3 as 1 | 2 | 3 | 4;
    const newOrder = 1;
    
    const updates: SectionUpdate[] = [];
    updates.push({
      id: section.id,
      level: newLevel,
      order: newOrder,
      parentId: parent.id,
      filePath: calculateFilePath(section.filePath, newOrder)
    });
    
    return updates;
  }
  
  // Need a previous sibling to become our parent
  if (sectionIndex === 0) {
    throw new Error('Cannot demote - no previous sibling to become parent');
  }

  const newParent = siblings[sectionIndex - 1];
  const newLevel = (section.level + 1) as 1 | 2 | 3 | 4;
  
  // Become first child of previous sibling
  const childrenOfNewParent = sections.filter(s => s.parentId === newParent.id);
  const newOrder = childrenOfNewParent.length > 0 
    ? Math.max(...childrenOfNewParent.map(c => c.order)) + 1 
    : 1;

  const updates: SectionUpdate[] = [];

  updates.push({
    id: section.id,
    level: newLevel,
    order: newOrder,
    parentId: newParent.id,
    filePath: calculateFilePath(section.filePath, newOrder)
  });

  return updates;
}

function calculateFilePath(currentPath: string, newOrder: number): string {
  // Extract base path and filename from current path
  const pathParts = currentPath.split('/');
  const filename = pathParts[pathParts.length - 1];
  
  // Remove old prefix from filename (e.g., "02-section.md" -> "section.md")
  const nameWithoutPrefix = filename.replace(/^\d{2}-/, '');
  
  // Add new prefix
  const newFilename = `${newOrder.toString().padStart(2, '0')}-${nameWithoutPrefix}`;
  
  // Reconstruct path
  pathParts[pathParts.length - 1] = newFilename;
  return pathParts.join('/');
}
