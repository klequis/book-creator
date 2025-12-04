import { Component, For, createSignal, Show } from "solid-js"
import { useBook } from "~/contexts/BookContext"

export const BookTree: Component = () => {
  const [bookState, , actions] = useBook()
  const [expandedChapters, setExpandedChapters] = createSignal<Set<string>>(new Set())

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => {
      const next = new Set(prev)
      if (next.has(chapterId)) {
        next.delete(chapterId)
      } else {
        next.add(chapterId)
      }
      return next
    })
  }

  const getChapterTitle = (chapterId: string) => {
    const chapter = bookState.book.chapters.find(c => c.id === chapterId)
    if (!chapter) return "Unknown Chapter"
    
    // Find level 1 section (chapter title page)
    const titleSection = chapter.sections.find(s => s.level === 1)
    if (!titleSection) return `Chapter (${chapter.sections.length} sections)`
    
    // Extract title from filePath (e.g., "02-00-00 Chapter Title Page.md")
    const fileName = titleSection.filePath.split('/').pop() || ""
    const match = fileName.match(/\d+-\d+-\d+\s+(.+)\.md/)
    return match ? match[1] : fileName
  }

  const getSectionTitle = (filePath: string) => {
    const fileName = filePath.split('/').pop() || ""
    const match = fileName.match(/\d+-\d+-\d+(?:-\d+)?\s+(.+)\.md/)
    return match ? match[1] : fileName
  }

  return (
    <div style={{ "font-size": "14px" }}>
      <For each={bookState.book.chapters}>
        {(chapter, chapterIndex) => {
          const isExpanded = () => expandedChapters().has(chapter.id)
          const chapterNum = chapterIndex() + 1
          
          return (
            <div style={{ "margin-bottom": "10px" }}>
              {/* Chapter Header */}
              <div
                onClick={() => toggleChapter(chapter.id)}
                style={{
                  padding: "5px",
                  cursor: "pointer",
                  "font-weight": "bold",
                  background: "#f0f0f0",
                  "border-radius": "3px",
                  display: "flex",
                  "align-items": "center",
                  gap: "5px"
                }}
              >
                <span style={{ "font-size": "12px" }}>
                  {isExpanded() ? "▼" : "▶"}
                </span>
                <span>Ch {chapterNum}: {getChapterTitle(chapter.id)}</span>
              </div>

              {/* Sections */}
              <Show when={isExpanded()}>
                <div style={{ "padding-left": "20px", "margin-top": "5px" }}>
                  <For each={chapter.sections}>
                    {(section) => (
                      <div
                        onClick={() => actions.onFileSelect(section.filePath)}
                        style={{
                          padding: "4px 8px",
                          cursor: "pointer",
                          "border-radius": "3px",
                          background: bookState.selectedFile === section.filePath ? "#e3f2fd" : "transparent",
                          "font-weight": bookState.selectedFile === section.filePath ? "500" : "normal"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = bookState.selectedFile === section.filePath ? "#e3f2fd" : "#f5f5f5"}
                        onMouseLeave={(e) => e.currentTarget.style.background = bookState.selectedFile === section.filePath ? "#e3f2fd" : "transparent"}
                      >
                        <span style={{ color: "#666", "margin-right": "5px" }}>
                          L{section.level}
                        </span>
                        {getSectionTitle(section.filePath)}
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </div>
          )
        }}
      </For>
    </div>
  )
}

