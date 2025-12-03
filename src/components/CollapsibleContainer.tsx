import { Component, JSX, createSignal, Show } from 'solid-js';
import { ChevronRight, ChevronDown } from 'lucide-solid';

interface CollapsibleContainerProps {
  icon?: JSX.Element;
  label: string;
  children: JSX.Element;
  defaultExpanded?: boolean;
  onClick?: () => void;
}

export const CollapsibleContainer: Component<CollapsibleContainerProps> = (props) => {
  const [isExpanded, setIsExpanded] = createSignal(props.defaultExpanded ?? true);

  const handleHeaderClick = (e: MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded());
    if (props.onClick) {
      props.onClick();
    }
  };

  return (
    <div class="collapsible-container">
      <div class="collapsible-header" onClick={handleHeaderClick}>
        <button 
          class="collapse-toggle" 
          aria-label={isExpanded() ? 'Collapse' : 'Expand'}
        >
          {isExpanded() ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        <div class="header-content">
          {props.icon && <span class="header-icon">{props.icon}</span>}
          <span class="header-label">{props.label}</span>
        </div>
      </div>
      <Show when={isExpanded()}>
        <div class="collapsible-content">
          {props.children}
        </div>
      </Show>
    </div>
  );
};
