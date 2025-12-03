import { Component, For, Show, createSignal } from 'solid-js';
import { getErrors, clearError, clearAllErrors, getIsErrorPanelOpen, closeErrorPanel } from '../stores/errorStore';
import { X, AlertCircle, ChevronDown, ChevronUp } from 'lucide-solid';
import './ErrorPanel.css';

export const ErrorPanel: Component = () => {
  const errors = getErrors;
  const isOpen = getIsErrorPanelOpen;
  const [expandedErrors, setExpandedErrors] = createSignal<Set<string>>(new Set());

  const toggleErrorExpanded = (id: string) => {
    setExpandedErrors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const handleClose = () => {
    if (errors().length === 0) {
      closeErrorPanel();
    }
  };

  return (
    <Show when={isOpen()}>
      <div class="error-panel">
        <div class="error-panel-header">
          <div class="error-panel-title">
            <AlertCircle size={18} />
            <span>Errors ({errors().length})</span>
          </div>
          <div class="error-panel-actions">
            <button 
              class="error-panel-btn"
              onClick={clearAllErrors}
              disabled={errors().length === 0}
              title="Clear all errors"
            >
              Clear All
            </button>
            <button 
              class="error-panel-btn error-panel-close"
              onClick={handleClose}
              disabled={errors().length > 0}
              title={errors().length > 0 ? "Clear all errors before closing" : "Close error panel"}
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        <div class="error-panel-content">
          <Show 
            when={errors().length > 0}
            fallback={
              <div class="error-panel-empty">
                <AlertCircle size={32} />
                <p>No errors to display</p>
                <button class="error-panel-btn" onClick={handleClose}>
                  Close Panel
                </button>
              </div>
            }
          >
            <For each={errors()}>
              {(error) => {
                const isExpanded = () => expandedErrors().has(error.id);
                const hasDetails = () => error.stack || error.context;
                
                return (
                  <div class="error-entry">
                    <div class="error-entry-header">
                      <div class="error-entry-main">
                        <AlertCircle size={16} class="error-icon" />
                        <div class="error-entry-content">
                          <div class="error-message">{error.message}</div>
                          <div class="error-timestamp">{formatTimestamp(error.timestamp)}</div>
                        </div>
                      </div>
                      <div class="error-entry-actions">
                        <Show when={hasDetails()}>
                          <button
                            class="error-panel-btn-small"
                            onClick={() => toggleErrorExpanded(error.id)}
                            title={isExpanded() ? "Hide details" : "Show details"}
                          >
                            {isExpanded() ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </Show>
                        <button
                          class="error-panel-btn-small"
                          onClick={() => clearError(error.id)}
                          title="Clear this error"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <Show when={isExpanded() && hasDetails()}>
                      <div class="error-entry-details">
                        <Show when={error.context}>
                          <div class="error-detail-section">
                            <div class="error-detail-label">Context:</div>
                            <div class="error-detail-value">{error.context}</div>
                          </div>
                        </Show>
                        <Show when={error.stack}>
                          <div class="error-detail-section">
                            <div class="error-detail-label">Stack Trace:</div>
                            <pre class="error-stack-trace">{error.stack}</pre>
                          </div>
                        </Show>
                      </div>
                    </Show>
                  </div>
                );
              }}
            </For>
          </Show>
        </div>
      </div>
    </Show>
  );
};
