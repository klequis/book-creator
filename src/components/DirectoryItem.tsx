import { type FileEntry } from "~/lib/files"

type DirectoryItemProps = {
  file: FileEntry
  level: number
  currentFile: () => string | null
  onFileSelect: (file: FileEntry) => void
  onToggle: (file: FileEntry) => void
  isExpanded: boolean
}

export function DirectoryItem(props: DirectoryItemProps) {
  const handleClick = () => {
    console.log('DirectoryItem clicked:', props.file.name, props.file.isDirectory)
    if (props.file.isDirectory) {
      props.onToggle(props.file)
    } else {
      props.onFileSelect(props.file)
    }
  }

  return (
    <div
      style={{
        padding: "5px",
        "padding-left": `${10 + props.level * 15}px`,
        cursor: "pointer",
        "background-color":
          props.currentFile() === props.file.path ? "#e0e0e0" : "transparent",
        "border-radius": "3px"
      }}
      onClick={handleClick}
    >
      {props.file.isDirectory ? (
        props.isExpanded ? "📂" : "📁"
      ) : "📄"}{" "}
      {props.file.name}
    </div>
  )
}
