import { Component, createSignal, Show, For, createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';
import { invoke } from '@tauri-apps/api/core';
import './ResourcesNode.css';

interface ResourcesNodeProps {
  folderPath: string;
  onFileSelect: (filePath: string) => void;
}

interface FileEntry {
  name: string;
  path: string;
  is_dir: boolean;
}

export const ResourcesNode: Component<ResourcesNodeProps> = (props) => {
  const [isExpanded, setIsExpanded] = createSignal(true);
  
  const [entriesState, setEntriesState] = createStore<{
    data: FileEntry[];
    loading: boolean;
    error: boolean;
  }>({
    data: [],
    loading: false,
    error: false
  });

  // Load entries when folderPath changes
  createEffect(async () => {
    const path = props.folderPath;
    
    setEntriesState({ loading: true, error: false });
    
    try {
      const result: Array<{ name: string; is_dir: boolean }> = await invoke('read_directory', {
        path
      });
      const sortedEntries = result.map(entry => ({
        name: entry.name,
        path: `${path}/${entry.name}`,
        is_dir: entry.is_dir
      })).sort((a, b) => {
        // Directories first, then files
        if (a.is_dir === b.is_dir) {
          return a.name.localeCompare(b.name);
        }
        return a.is_dir ? -1 : 1;
      });
      setEntriesState({ data: sortedEntries, loading: false, error: false });
    } catch (err) {
      console.error('Failed to read resources directory:', err);
      setEntriesState({ data: [], error: true, loading: false });
    }
  });

  const toggleExpand = () => {
    setIsExpanded(!isExpanded());
  };

  return (
    <div class="resources-node">
      <div class="resources-header" onClick={toggleExpand}>
        <span class="expand-icon">{isExpanded() ? '▼' : '▶'}</span>
        <span class="folder-icon">📁</span>
        <span class="resources-title">Resources</span>
      </div>
      <Show when={isExpanded()}>
        <div class="resources-content">
          <Show when={entriesState.loading}>
            <div class="loading">Loading...</div>
          </Show>
          <Show when={entriesState.error}>
            <div class="error">Failed to load resources</div>
          </Show>
          <Show when={entriesState.data.length > 0}>
            <For each={entriesState.data}>
              {(entry) => (
                <ResourceEntry 
                  entry={entry} 
                  onFileSelect={props.onFileSelect}
                />
              )}
            </For>
          </Show>
          <Show when={!entriesState.loading && !entriesState.error && entriesState.data.length === 0}>
            <div class="empty">No resources</div>
          </Show>
        </div>
      </Show>
    </div>
  );
};

interface ResourceEntryProps {
  entry: FileEntry;
  onFileSelect: (filePath: string) => void;
}

const ResourceEntry: Component<ResourceEntryProps> = (props) => {
  const [isExpanded, setIsExpanded] = createSignal(false);
  
  const [subEntriesState, setSubEntriesState] = createStore<{
    data: FileEntry[];
  }>({
    data: []
  });

  // Load subdirectories when expanded
  createEffect(async () => {
    const path = props.entry.is_dir && isExpanded() ? props.entry.path : null;
    
    if (!path) {
      setSubEntriesState({ data: [] });
      return;
    }
    
    try {
      const result: Array<{ name: string; is_dir: boolean }> = await invoke('read_directory', {
        path
      });
      const sortedEntries = result.map(entry => ({
        name: entry.name,
        path: `${path}/${entry.name}`,
        is_dir: entry.is_dir
      })).sort((a, b) => {
        if (a.is_dir === b.is_dir) {
          return a.name.localeCompare(b.name);
        }
        return a.is_dir ? -1 : 1;
      });
      setSubEntriesState({ data: sortedEntries });
    } catch (error) {
      console.error('Failed to read subdirectory:', error);
      setSubEntriesState({ data: [] });
    }
  });

  const handleClick = () => {
    if (props.entry.is_dir) {
      setIsExpanded(!isExpanded());
    } else {
      // For now, do nothing when clicking files
      console.log('Resource file clicked:', props.entry.path);
    }
  };

  return (
    <div class="resource-entry">
      <div class="resource-item" onClick={handleClick}>
        <Show when={props.entry.is_dir}>
          <span class="expand-icon">{isExpanded() ? '▼' : '▶'}</span>
        </Show>
        <span class="resource-icon">{props.entry.is_dir ? '📁' : '📄'}</span>
        <span class="resource-name">{props.entry.name}</span>
      </div>
      <Show when={props.entry.is_dir && isExpanded()}>
        <div class="resource-children">
          <For each={subEntriesState.data}>
            {(subEntry) => (
              <ResourceEntry 
                entry={subEntry} 
                onFileSelect={props.onFileSelect}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};
