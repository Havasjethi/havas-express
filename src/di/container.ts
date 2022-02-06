import { Container } from 'inversify';
import { ExpressCoreRoutable } from '../classes';
import { ComposableTreeCreator, ControllerTreeCreator } from './controller_tree';
import readDir from 'recursive-readdir';

export const mainContainer = new Container({
  skipBaseClassChecks: true,
});

/**
 * @deprecated - Use `mainContainer` instead
 */
export const main_container = mainContainer;
export const MainControllerTree = new ControllerTreeCreator(); //;new ComposableTreeCreator(ControllerTreeNode);

/**
 * Recursive by default is true
 */
export type FolderRead = {
  kind: 'folder',
  folder: string,
  // recursive?: boolean,
  ignoredFiles?: string | string[],
};

export type Custom = {
  kind: 'custom',
  getFiles: () => Promise<string[]>,
};

export type None = { kind: 'none' };

/**
 * TODO :: Add pattern matching for files
 */
export type ReadType = 'none' | 'folder' | 'custom';

type ReadTypeObject = FolderRead | Custom | None;

export const initializeControllerTree = async (
  readType: ReadTypeObject,
  initializeControllers: boolean,
): Promise<ExpressCoreRoutable[]> => {
  const filesToImport: string[] = await (getReaderMethod(readType)());

  filesToImport.forEach((file) => import(file));

  const initializedRouters = [];
  if (initializeControllers) {
    initializedRouters.push(...MainControllerTree.initialize(mainContainer));
  }

  return initializedRouters;
};

const getReaderMethod = (readType: ReadTypeObject): (() => Promise<string[]>) => {
  // TODO :: Add Folder  find logic
  switch (readType.kind) {
    case "folder":
      return () => syncFileReader(readType)
    case "custom":
      return readType.getFiles;
    case "none":
    default:
      return () => Promise.resolve([]);
  }
};

/**
 * @throws Error
 */
const syncFileReader = async ({folder, ignoredFiles: rawIgnoredFiles}: FolderRead): Promise<string[]> => {
  const ignoredFiles = rawIgnoredFiles === undefined ? [] : typeof rawIgnoredFiles === 'string' ? [rawIgnoredFiles] : rawIgnoredFiles;

  // const folderItems: string[] = [];
  // ((error, files) => {
  //     if (error) {
  //       throw error;
  //     }
  //     console.log('files::', files);
  //     folderItems.push(...files);
  //   })
  return readDir(folder, ignoredFiles);
};
