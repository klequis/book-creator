import { createContext, useContext, ParentComponent } from 'solid-js';

interface BookContextValue {
  rootPath: () => string | null;
}

const BookContext = createContext<BookContextValue>();

export const BookProvider: ParentComponent<{ rootPath: () => string | null }> = (props) => {
  const value: BookContextValue = {
    rootPath: props.rootPath
  };

  return (
    <BookContext.Provider value={value}>
      {props.children}
    </BookContext.Provider>
  );
};

export function useBookContext() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBookContext must be used within a BookProvider');
  }
  return context;
}
