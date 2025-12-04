import { For, Show, createSignal, onCleanup, createEffect } from 'solid-js'
import { A, useLocation } from '@solidjs/router'
import { navGroups } from './nav-groups'
import { BreadcrumbChevron } from '~/icons/breadcrumb-chevron'
import Menu from 'lucide-solid/icons/menu';
import ChavronDown from 'lucide-solid/icons/chevron-down';

export function Small() {
  const [isOpen, setIsOpen] = createSignal(false)
  const [activeGroup, setActiveGroup] = createSignal<number | null>(null)
  const location = useLocation()

  const toggleMenu = () => setIsOpen(!isOpen())
  const toggleGroup = (index: number) => {
    setActiveGroup(activeGroup() === index ? null : index)
  }

  // Find active group and link
  const getActiveBreadcrumb = () => {
    const currentPath = location.pathname
    for (const group of navGroups) {
      const activeLink = group.links.find(link => link.href === currentPath)
      if (activeLink) {
        return (
          <>
            {group.displayName}
            <BreadcrumbChevron />
            {activeLink.text}
          </>
        )
      }
    }
    return 'Menu'
  }

  // Close menu when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (isOpen() && !target.closest('.mobile-menu-container')) {
      setIsOpen(false)
    }
  }

  // Add event listener when menu is open
  if (typeof window !== 'undefined') {
    document.addEventListener('click', handleClickOutside)
    onCleanup(() => {
      document.removeEventListener('click', handleClickOutside)
    })
  }

  return (
    <div>
      <button
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <Menu />
        <span >{getActiveBreadcrumb()}</span>
      </button>

      {/* Mobile Menu */}
      <Show when={isOpen()}>
        <div >
          <div >
            <For each={navGroups}>
              {(group, idx) => (
                <div>
                  {/* Group Title */}
                  <button
                    onClick={() => toggleGroup(idx())}
                  >
                    <span>{group.groupName}</span>
                    <ChavronDown />
                  </button>

                  {/* Group Links */}
                  <Show when={activeGroup() === idx()}>
                    <div >
                      <For each={group.links}>
                        {(link) => (
                          <A
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            end
                          >
                            {link.text}
                          </A>
                        )}
                      </For>
                    </div>
                  </Show>
                </div>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  )
}
