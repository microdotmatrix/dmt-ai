# Document Versioning Evaluation and Implementation Plans

## Current Schema Analysis

### Existing Database Structure

**DocumentTable**:
- Primary key: `(id, createdAt)` composite
- Content stored as `text` field (directly modifiable)
- Links to users and entries
- Token usage tracking (suggests AI/chat interactions)

**Chat System**:
- ChatTable references documents with `(documentId, documentCreatedAt)`
- MessageTable for chat history
- VoteTable for message feedback
- StreamTable for real-time updates

**SuggestionTable**:
- Already tracks `originalText` and `suggestedText`
- References documents by `(documentId, documentCreatedAt)`
- Has `isResolved` status tracking

### Key Observations

**Strengths**:
1. Composite primary key suggests versioning awareness
2. Good referential integrity with foreign keys
3. Existing suggestion system provides foundation for change tracking
4. Token usage tracking indicates AI-driven content modifications

**Challenges for Versioning**:
1. **Direct Content Modification**: Changes are made directly to the `content` field without version history
2. **Composite Key Complexity**: The `(id, createdAt)` primary key makes some versioning operations complex
3. **No Version Relationships**: No explicit parent-child version relationships
4. **Chat Integration**: Need to track which chat interactions caused which changes
5. **Finite Limit**: Need to enforce maximum 3 versions per document

**Current Change Tracking**:
- The system tracks suggestions but not actual document versions
- Chat messages exist but aren't linked to specific content changes
- No mechanism to revert to previous states

## Implementation Plan 1: Snapshot-Based Versioning (Recommended)

### Overview
Create a separate `DocumentVersion` table that stores complete snapshots of the document at each save point. This approach is simpler to implement and manage while providing full version history.

### Schema Changes

```typescript
// New table for document versions
export const DocumentVersionTable = pgTable(
  "document_version",
  {
    id: uuid("id").notNull().defaultRandom(),
    documentId: uuid("document_id").notNull(),
    version: integer("version").notNull(), // 1, 2, 3 (max 3)
    title: text("title").notNull(),
    content: text("content"),
    kind: varchar("kind", { enum: ["obituary", "eulogy"] }).notNull(),
    tokenUsage: integer("token_usage").default(0),
    changeSummary: text("change_summary"), // AI-generated summary of changes
    changedBy: text("changed_by").notNull(), // user_id who made the change
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.documentId, table.version] }),
    foreignKey({
      columns: [table.documentId],
      foreignColumns: [DocumentTable.id],
    }).onDelete("cascade"),
  ]
);

// Modify existing DocumentTable to track current version
export const DocumentTable = pgTable(
  "document",
  {
    id: uuid("id").notNull().defaultRandom(),
    userId: text("user_id").notNull().references(() => UserTable.id),
    entryId: text("entry_id").notNull().references(() => EntryTable.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    content: text("content"),
    kind: varchar("kind", { enum: ["obituary", "eulogy"] }).notNull().default("obituary"),
    currentVersion: integer("current_version").default(1), // Track current version
    tokenUsage: integer("token_usage").default(0),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  },
  (table) => {
    return [
      primaryKey({ columns: [table.id, table.createdAt] }),
    ];
  }
);
```

### Implementation Steps

1. **Database Migration**:
   - Create `DocumentVersionTable`
   - Add `currentVersion` column to `DocumentTable`
   - Migrate existing documents to version 1

2. **Version Management Logic**:
   ```typescript
   // When saving changes
   async function saveDocumentVersion(documentId: string, newContent: string, userId: string) {
     const currentDoc = await getDocumentById(documentId);
     const nextVersion = currentDoc.currentVersion + 1;

     // If we exceed 3 versions, delete the oldest
     if (nextVersion > 3) {
       await deleteOldestVersion(documentId);
       // Shift versions down
       await shiftVersionsDown(documentId);
       nextVersion = 3;
     }

     // Create new version
     await createDocumentVersion({
       documentId,
       version: nextVersion,
       title: currentDoc.title,
       content: newContent,
       kind: currentDoc.kind,
       tokenUsage: currentDoc.tokenUsage,
       changeSummary: await generateChangeSummary(currentDoc.content, newContent),
       changedBy: userId,
     });

     // Update current version pointer
     await updateDocumentCurrentVersion(documentId, nextVersion);
   }
   ```

3. **Revert Functionality**:
   ```typescript
   async function revertToVersion(documentId: string, targetVersion: number, userId: string) {
     const targetVersionData = await getDocumentVersion(documentId, targetVersion);

     // Create a new version with the reverted content
     await saveDocumentVersion(documentId, targetVersionData.content, userId);
   }
   ```

4. **Chat Integration**:
   - Modify chat message handlers to call `saveDocumentVersion` when content changes
   - Link chat messages to specific document versions

### Benefits
- **Simple Implementation**: Straightforward snapshot approach
- **Complete History**: Full content snapshots preserved
- **Easy Revert**: Direct restoration from any version
- **Change Tracking**: AI-generated summaries of what changed
- **Automatic Cleanup**: Maintains exactly 3 versions

### Trade-offs
- **Storage**: Stores full content for each version
- **Complexity**: Version shifting logic when exceeding limit

## Implementation Plan 2: Git-like Diff-Based Versioning

### Overview
Store only the differences (diffs) between versions rather than full snapshots. This approach is more storage-efficient but more complex to implement and manage.

### Schema Changes

```typescript
// Store version metadata
export const DocumentVersionTable = pgTable(
  "document_version",
  {
    id: uuid("id").notNull().defaultRandom(),
    documentId: uuid("document_id").notNull(),
    version: integer("version").notNull(),
    parentVersion: integer("parent_version"), // Reference to previous version
    title: text("title").notNull(),
    contentDiff: text("content_diff").notNull(), // JSON diff or patch
    kind: varchar("kind", { enum: ["obituary", "eulogy"] }).notNull(),
    changeSummary: text("change_summary"),
    changedBy: text("changed_by").notNull(),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.documentId, table.version] }),
    foreignKey({
      columns: [table.documentId],
      foreignColumns: [DocumentTable.id],
    }).onDelete("cascade"),
  ]
);

// Store the current reconstructed content (computed)
export const DocumentTable = pgTable(
  "document",
  {
    id: uuid("id").notNull().defaultRandom(),
    userId: text("user_id").notNull().references(() => UserTable.id),
    entryId: text("entry_id").notNull().references(() => EntryTable.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    content: text("content"), // Reconstructed from diffs
    kind: varchar("kind", { enum: ["obituary", "eulogy"] }).notNull().default("obituary"),
    currentVersion: integer("current_version").default(1),
    tokenUsage: integer("token_usage").default(0),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  },
  (table) => {
    return [
      primaryKey({ columns: [table.id, table.createdAt] }),
    ];
  }
);

// Store version diffs
export const DocumentDiffTable = pgTable(
  "document_diff",
  {
    id: uuid("id").notNull().defaultRandom(),
    documentId: uuid("document_id").notNull(),
    fromVersion: integer("from_version").notNull(),
    toVersion: integer("to_version").notNull(),
    diffData: text("diff_data").notNull(), // JSON diff format
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.documentId, table.fromVersion, table.toVersion] }),
    foreignKey({
      columns: [table.documentId],
      foreignColumns: [DocumentTable.id],
    }).onDelete("cascade"),
  ]
);
```

### Implementation Steps

1. **Diff Calculation**:
   ```typescript
   // Use a diff library like 'diff' or 'jsdiff'
   import { createPatch, applyPatch } from 'diff';

   function calculateContentDiff(oldContent: string, newContent: string): string {
     return createPatch('document', oldContent, newContent);
   }

   function applyContentDiff(originalContent: string, diff: string): string {
     return applyPatch(originalContent, diff);
   }
   ```

2. **Version Management**:
   ```typescript
   async function saveDocumentVersion(documentId: string, newContent: string, userId: string) {
     const currentDoc = await getDocumentById(documentId);
     const currentVersion = currentDoc.currentVersion;

     // Calculate diff from current content
     const diff = calculateContentDiff(currentDoc.content || '', newContent);

     // Create new version
     const nextVersion = currentVersion + 1;
     await createDocumentVersion({
       documentId,
       version: nextVersion,
       parentVersion: currentVersion,
       title: currentDoc.title,
       contentDiff: diff,
       kind: currentDoc.kind,
       changeSummary: await generateChangeSummary(currentDoc.content, newContent),
       changedBy: userId,
     });

     // If we exceed 3 versions, merge oldest diffs
     if (nextVersion > 3) {
       await mergeOldestVersions(documentId);
     }

     // Update document with new content
     await updateDocumentContent(documentId, newContent);
     await updateDocumentCurrentVersion(documentId, nextVersion);
   }
   ```

3. **Content Reconstruction**:
   ```typescript
   async function getDocumentContentAtVersion(documentId: string, targetVersion: number): Promise<string> {
     const versions = await getVersionsUpTo(documentId, targetVersion);
     let content = '';

     // Apply diffs in order
     for (const version of versions) {
       if (version.version === 1) {
         // Version 1 has full content
         content = version.content;
       } else {
         // Apply diff to get to next version
         content = applyContentDiff(content, version.contentDiff);
       }
     }

     return content;
   }
   ```

4. **Revert Logic**:
   ```typescript
   async function revertToVersion(documentId: string, targetVersion: number, userId: string) {
     const contentAtVersion = await getDocumentContentAtVersion(documentId, targetVersion);
     await saveDocumentVersion(documentId, contentAtVersion, userId);
   }
   ```

### Benefits
- **Storage Efficient**: Only stores diffs, not full content
- **Flexible History**: Can reconstruct any version from diffs
- **Fine-grained Changes**: Can show exactly what changed between versions
- **Advanced Features**: Supports branching, merging concepts

### Trade-offs
- **Complexity**: More complex diff calculation and reconstruction logic
- **Performance**: Content reconstruction requires processing multiple diffs
- **Error-prone**: Diff application can fail if diffs become corrupted
- **Maintenance**: More complex cleanup when exceeding version limits

## Recommendation

**Choose Plan 1 (Snapshot-Based)** for your use case because:

1. **Simplicity**: Easier to implement and debug
2. **Reliability**: Full snapshots ensure data integrity
3. **Performance**: Direct access to any version without reconstruction
4. **Limited Scope**: Your 3-version limit makes storage efficiency less critical
5. **Maintenance**: Easier to manage and troubleshoot

The snapshot approach aligns well with your existing composite key design and provides a solid foundation for version control without over-engineering for your specific requirements.

## Next Steps

1. Review this evaluation and choose an implementation plan
2. Create a database migration script
3. Implement version management utilities
4. Update chat handlers to create versions on content changes
5. Add UI components for version history and revert functionality
6. Test the implementation thoroughly with various chat interactions
