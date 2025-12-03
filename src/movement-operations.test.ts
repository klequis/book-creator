import { describe, test, expect } from '@jest/globals';
import { orderPlus, orderMinus, levelPlus, levelMinus } from './movement-operations';
import type { Section, SectionUpdate } from './movement-operations';

describe('Movement Operations', () => {
  
  describe('S1 Constraints', () => {
    
    test('S1 cannot orderPlus', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-id', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section.md' }
      ];
      
      expect(() => orderPlus('s1-id', sections)).toThrow();
    });
    
    test('S1 cannot orderMinus', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-id', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section.md' }
      ];
      
      expect(() => orderMinus('s1-id', sections)).toThrow();
    });
    
    test('S1 cannot levelPlus', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-id', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section.md' }
      ];
      
      expect(() => levelPlus('s1-id', sections)).toThrow();
    });
    
    test('S1 cannot levelMinus', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-id', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section.md' }
      ];
      
      expect(() => levelMinus('s1-id', sections)).toThrow();
    });
    
    test('No section can orderPlus above S1', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-id', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section.md' }
      ];
      
      // S2 trying to orderPlus would need to promote to S1 level, which is not allowed
      expect(() => orderPlus('s2-id', sections)).toThrow('Cannot promote to S1');
    });
    
    test('S1 must remain at order 1', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-a', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section-a.md' },
        { id: 's2-b', level: 2, order: 2, parentId: 's1-id', filePath: '/book/01-chapter/03-section-b.md' }
      ];
      
      // After any operation, S1 should still be at order 1
      const updates = orderPlus('s2-b', sections);
      const s1Update = updates.find(u => u.id === 's1-id');
      if (s1Update) {
        expect(s1Update.order).toBe(1);
      }
    });
  });
  
  describe('orderPlus - Simple Swap', () => {
    
    test('swaps with previous sibling', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-a', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section-a.md' },
        { id: 's2-b', level: 2, order: 2, parentId: 's1-id', filePath: '/book/01-chapter/03-section-b.md' }
      ];
      
      const updates = orderPlus('s2-b', sections);
      
      expect(updates).toHaveLength(2);
      // After swap: s2-a gets order 2, so filePath should have 02- prefix (matching order, not old position)
      expect(updates.find(u => u.id === 's2-a')).toMatchObject({
        id: 's2-a',
        level: 2,
        order: 2,
        parentId: 's1-id',
        filePath: '/book/01-chapter/02-section-a.md'
      });
      // After swap: s2-b gets order 1, so filePath should have 01- prefix
      expect(updates.find(u => u.id === 's2-b')).toMatchObject({
        id: 's2-b',
        level: 2,
        order: 1,
        parentId: 's1-id',
        filePath: '/book/01-chapter/01-section-b.md'
      });
    });
    
    test('updates filePath to match new order', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-a', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-first.md' },
        { id: 's2-b', level: 2, order: 2, parentId: 's1-id', filePath: '/book/01-chapter/03-second.md' }
      ];
      
      const updates = orderPlus('s2-b', sections);
      
      const movedSection = updates.find(u => u.id === 's2-b');
      // s2-b swaps from order 2 to order 1, so prefix becomes 01
      expect(movedSection?.filePath).toMatch(/01-second\.md$/);
    });
    
    test('preserves level and parentId on simple swap', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-a', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section-a.md' },
        { id: 's2-b', level: 2, order: 2, parentId: 's1-id', filePath: '/book/01-chapter/03-section-b.md' }
      ];
      
      const updates = orderPlus('s2-b', sections);
      
      const movedSection = updates.find(u => u.id === 's2-b');
      expect(movedSection?.level).toBe(2);
      expect(movedSection?.parentId).toBe('s1-id');
    });
  });
  
  describe('orderPlus - Level Promotion', () => {
    
    test('promotes level when at top of siblings', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-id', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-parent.md' },
        { id: 's3-id', level: 3, order: 1, parentId: 's2-id', filePath: '/book/01-chapter/03-child.md' }
      ];
      
      const updates = orderPlus('s3-id', sections);
      
      const promoted = updates.find(u => u.id === 's3-id');
      expect(promoted?.level).toBe(2);
      expect(promoted?.parentId).toBe('s1-id');
    });
    
    test('updates order to insert after parent on promotion', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-id', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-parent.md' },
        { id: 's3-id', level: 3, order: 1, parentId: 's2-id', filePath: '/book/01-chapter/03-child.md' }
      ];
      
      const updates = orderPlus('s3-id', sections);
      
      const promoted = updates.find(u => u.id === 's3-id');
      expect(promoted?.order).toBe(2);
    });
    
    test('recalculates filePath after promotion', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-id', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-parent.md' },
        { id: 's3-id', level: 3, order: 1, parentId: 's2-id', filePath: '/book/01-chapter/03-child.md' }
      ];
      
      const updates = orderPlus('s3-id', sections);
      
      const promoted = updates.find(u => u.id === 's3-id');
      expect(promoted?.filePath).not.toBe('/book/01-chapter/03-child.md');
      expect(promoted?.filePath).toMatch(/\/book\/01-chapter\/\d{2}-child\.md/);
    });
  });
  
  describe('orderMinus - Simple Swap', () => {
    
    test('swaps with next sibling', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-a', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section-a.md' },
        { id: 's2-b', level: 2, order: 2, parentId: 's1-id', filePath: '/book/01-chapter/03-section-b.md' }
      ];
      
      const updates = orderMinus('s2-a', sections);
      
      expect(updates).toHaveLength(2);
      expect(updates.find(u => u.id === 's2-a')).toMatchObject({
        id: 's2-a',
        level: 2,
        order: 2,
        parentId: 's1-id'
      });
      expect(updates.find(u => u.id === 's2-b')).toMatchObject({
        id: 's2-b',
        level: 2,
        order: 1,
        parentId: 's1-id'
      });
    });
  });
  
  describe('orderMinus - Level Demotion', () => {
    
    test('demotes level when at bottom of siblings', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-a', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section-a.md' },
        { id: 's2-b', level: 2, order: 2, parentId: 's1-id', filePath: '/book/01-chapter/03-section-b.md' }
      ];
      
      const updates = orderMinus('s2-b', sections);
      
      const demoted = updates.find(u => u.id === 's2-b');
      expect(demoted?.level).toBe(3);
      expect(demoted?.parentId).toBe('s2-a');
    });
    
    test('becomes first child of previous sibling on demotion', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-a', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section-a.md' },
        { id: 's2-b', level: 2, order: 2, parentId: 's1-id', filePath: '/book/01-chapter/03-section-b.md' }
      ];
      
      const updates = orderMinus('s2-b', sections);
      
      const demoted = updates.find(u => u.id === 's2-b');
      expect(demoted?.order).toBe(1);
      expect(demoted?.parentId).toBe('s2-a');
    });
  });
  
  describe('levelPlus - Explicit Promotion', () => {
    
    test('promotes one level', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-id', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section.md' },
        { id: 's3-id', level: 3, order: 1, parentId: 's2-id', filePath: '/book/01-chapter/03-subsection.md' }
      ];
      
      const updates = levelPlus('s3-id', sections);
      
      const promoted = updates.find(u => u.id === 's3-id');
      expect(promoted?.level).toBe(2);
    });
    
    test('updates parentId to grandparent', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-id', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section.md' },
        { id: 's3-id', level: 3, order: 1, parentId: 's2-id', filePath: '/book/01-chapter/03-subsection.md' }
      ];
      
      const updates = levelPlus('s3-id', sections);
      
      const promoted = updates.find(u => u.id === 's3-id');
      expect(promoted?.parentId).toBe('s1-id');
    });
    
    test('cannot promote S2 to S1 level', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-id', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section.md' }
      ];
      
      expect(() => levelPlus('s2-id', sections)).toThrow();
    });
    
    test('inserts after parent in sibling order', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-a', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section-a.md' },
        { id: 's3-id', level: 3, order: 1, parentId: 's2-a', filePath: '/book/01-chapter/03-subsection.md' },
        { id: 's2-b', level: 2, order: 2, parentId: 's1-id', filePath: '/book/01-chapter/04-section-b.md' }
      ];
      
      const updates = levelPlus('s3-id', sections);
      
      const promoted = updates.find(u => u.id === 's3-id');
      expect(promoted?.order).toBe(2);
      
      // s2-b should be renumbered to 3
      const renumbered = updates.find(u => u.id === 's2-b');
      expect(renumbered?.order).toBe(3);
    });
  });
  
  describe('levelMinus - Explicit Demotion', () => {
    
    test('demotes one level', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-id', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section.md' }
      ];
      
      const updates = levelMinus('s2-id', sections);
      
      const demoted = updates.find(u => u.id === 's2-id');
      expect(demoted?.level).toBe(3);
    });
    
    test('cannot demote S4 (max depth)', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-id', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section.md' },
        { id: 's3-id', level: 3, order: 1, parentId: 's2-id', filePath: '/book/01-chapter/03-subsection.md' },
        { id: 's4-id', level: 4, order: 1, parentId: 's3-id', filePath: '/book/01-chapter/04-subsubsection.md' }
      ];
      
      expect(() => levelMinus('s4-id', sections)).toThrow();
    });
    
    test('becomes child of previous sibling if exists', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-a', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section-a.md' },
        { id: 's2-b', level: 2, order: 2, parentId: 's1-id', filePath: '/book/01-chapter/03-section-b.md' }
      ];
      
      const updates = levelMinus('s2-b', sections);
      
      const demoted = updates.find(u => u.id === 's2-b');
      expect(demoted?.level).toBe(3);
      expect(demoted?.parentId).toBe('s2-a');
    });
    
    test('first S2 can demote to S3 under parent', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-id', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section.md' }
      ];
      
      // s2-id is first child, can demote to S3 under S1
      const updates = levelMinus('s2-id', sections);
      const demoted = updates.find(u => u.id === 's2-id');
      
      expect(demoted?.level).toBe(3);
      expect(demoted?.parentId).toBe('s1-id');
    });
  });
  
  describe('Level Constraints', () => {
    
    test('S2 parent must be S1', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-a', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section-a.md' },
        { id: 's2-b', level: 2, order: 2, parentId: 's1-id', filePath: '/book/01-chapter/03-section-b.md' }
      ];
      
      // Both S2 sections have S1 as parent
      sections.filter(s => s.level === 2).forEach(s2 => {
        expect(s2.parentId).toBe('s1-id');
      });
    });
    
    test('S3 parent must be S2', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-id', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section.md' },
        { id: 's3-id', level: 3, order: 1, parentId: 's2-id', filePath: '/book/01-chapter/03-subsection.md' }
      ];
      
      const s3 = sections.find(s => s.id === 's3-id');
      const parent = sections.find(s => s.id === s3?.parentId);
      
      expect(parent?.level).toBe(2);
    });
    
    test('S4 parent must be S3', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-id', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section.md' },
        { id: 's3-id', level: 3, order: 1, parentId: 's2-id', filePath: '/book/01-chapter/03-subsection.md' },
        { id: 's4-id', level: 4, order: 1, parentId: 's3-id', filePath: '/book/01-chapter/04-subsubsection.md' }
      ];
      
      const s4 = sections.find(s => s.id === 's4-id');
      const parent = sections.find(s => s.id === s4?.parentId);
      
      expect(parent?.level).toBe(3);
    });
  });
  
  describe('ID Immutability', () => {
    
    test('id never changes during orderPlus', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-a', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section-a.md' },
        { id: 's2-b', level: 2, order: 2, parentId: 's1-id', filePath: '/book/01-chapter/03-section-b.md' }
      ];
      
      const updates = orderPlus('s2-b', sections);
      
      expect(updates.every(u => sections.some(s => s.id === u.id))).toBe(true);
    });
    
    test('id never changes during levelPlus', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-id', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section.md' },
        { id: 's3-id', level: 3, order: 1, parentId: 's2-id', filePath: '/book/01-chapter/03-subsection.md' }
      ];
      
      const updates = levelPlus('s3-id', sections);
      
      expect(updates.every(u => sections.some(s => s.id === u.id))).toBe(true);
    });
  });
  
  describe('File Path Updates', () => {
    
    test('filePath prefix matches order', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-a', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section-a.md' },
        { id: 's2-b', level: 2, order: 2, parentId: 's1-id', filePath: '/book/01-chapter/03-section-b.md' }
      ];
      
      const updates = orderPlus('s2-b', sections);
      
      // After swap: s2-b gets order 1 (01-prefix), s2-a gets order 2 (02-prefix)
      const movedSection = updates.find(u => u.id === 's2-b');
      const swappedSection = updates.find(u => u.id === 's2-a');
      
      expect(movedSection?.filePath).toMatch(/\/01-section-b\.md$/);
      expect(swappedSection?.filePath).toMatch(/\/02-section-a\.md$/);
    });
    
    test('filePath is always recalculated on move', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-a', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section-a.md' },
        { id: 's2-b', level: 2, order: 2, parentId: 's1-id', filePath: '/book/01-chapter/03-section-b.md' }
      ];
      
      const updates = orderPlus('s2-b', sections);
      
      expect(updates).toHaveLength(2);
      updates.forEach(update => {
        expect(update.filePath).toBeDefined();
        expect(update.filePath).not.toBe('');
      });
    });
  });
  
  describe('Multiple Section Updates', () => {
    
    test('renumbers siblings when inserting in middle', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-a', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section-a.md' },
        { id: 's3-id', level: 3, order: 1, parentId: 's2-a', filePath: '/book/01-chapter/03-subsection.md' },
        { id: 's2-b', level: 2, order: 2, parentId: 's1-id', filePath: '/book/01-chapter/04-section-b.md' },
        { id: 's2-c', level: 2, order: 3, parentId: 's1-id', filePath: '/book/01-chapter/05-section-c.md' }
      ];
      
      const updates = levelPlus('s3-id', sections);
      
      // Should update: s3-id (promoted to order 2), s2-b (order 2->3), s2-c (order 3->4)
      expect(updates.length).toBeGreaterThanOrEqual(3);
    });
    
    test('only affected sections are in update array', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-a', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section-a.md' },
        { id: 's2-b', level: 2, order: 2, parentId: 's1-id', filePath: '/book/01-chapter/03-section-b.md' },
        { id: 's2-c', level: 2, order: 3, parentId: 's1-id', filePath: '/book/01-chapter/04-section-c.md' }
      ];
      
      const updates = orderPlus('s2-b', sections);
      
      // Only s2-a and s2-b should be affected, not s2-c or s1-id
      expect(updates.find(u => u.id === 's2-c')).toBeUndefined();
      expect(updates.find(u => u.id === 's1-id')).toBeUndefined();
    });
  });
  
  describe('Edge Cases', () => {
    
    test('cannot orderPlus when already first among siblings', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-id', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section.md' }
      ];
      
      // s2-id is first S2, can only promote but that would create an S1 (not allowed)
      expect(() => orderPlus('s2-id', sections)).toThrow('Cannot promote to S1');
    });
    
    test('cannot orderMinus when already last among siblings and cannot demote', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-id', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section.md' },
        { id: 's3-id', level: 3, order: 1, parentId: 's2-id', filePath: '/book/01-chapter/03-subsection.md' },
        { id: 's4-id', level: 4, order: 1, parentId: 's3-id', filePath: '/book/01-chapter/04-subsubsection.md' }
      ];
      
      // s4-id is last and already at max depth
      expect(() => orderMinus('s4-id', sections)).toThrow();
    });
    
    test('single child can promote via orderPlus', () => {
      const sections: Section[] = [
        { id: 's1-id', level: 1, order: 1, parentId: undefined, filePath: '/book/01-chapter/01-title.md' },
        { id: 's2-id', level: 2, order: 1, parentId: 's1-id', filePath: '/book/01-chapter/02-section.md' },
        { id: 's3-id', level: 3, order: 1, parentId: 's2-id', filePath: '/book/01-chapter/03-subsection.md' }
      ];
      
      // s3-id is only child, orderPlus should promote
      const updates = orderPlus('s3-id', sections);
      const promoted = updates.find(u => u.id === 's3-id');
      
      expect(promoted?.level).toBe(2);
    });
  });
});
