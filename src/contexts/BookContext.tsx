import { createContext, useContext, ParentComponent } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";
import type { Book } from "~/types";

interface BookState {
  book: Book;
  rootPath: string;
  selectedFile: string | null;
}

interface BookActions {
  onFileSelect: (filePath: string) => void;
}

type BookContextValue = [
  state: BookState,
  setState: SetStoreFunction<BookState>,
  actions: BookActions
];

const BookContext = createContext<BookContextValue>();

export const BookProvider: ParentComponent<{
  book: Book;
  rootPath: string;
  onFileSelect: (filePath: string) => void;
}> = (props) => {
  const [state, setState] = createStore<BookState>({
    book: props.book,
    rootPath: props.rootPath,
    selectedFile: null
  });

  const actions: BookActions = {
    onFileSelect: (filePath: string) => {
      setState("selectedFile", filePath);
      props.onFileSelect(filePath);
    }
  };

  return (
    <BookContext.Provider value={[state, setState, actions]}>
      {props.children}
    </BookContext.Provider>
  );
};

/**
 * Custom hook to access book context.
 * Throws error if used outside BookProvider.
 * 
 * @returns Tuple of [state, setState, actions] for the book store
 * 
 * @example
 * const [bookState, setBookState, bookActions] = useBook();
 * console.log(bookState.rootPath);
 * setBookState("selectedFile", "/path/to/file");
 * bookActions.onFileSelect("/path/to/file");
 */
export function useBook(): BookContextValue {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBook must be used within BookProvider");
  }
  return context;
}
