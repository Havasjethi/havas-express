import { Container, AsyncContainerModule, ContainerModule } from 'inversify';
import readDir from 'recursive-readdir';
import { ExpressCoreRoutable } from '../classes';
import { ControllerTreeCreator } from './controller_tree';


export const mainContainer = new Container({
  skipBaseClassChecks: true,
});

/**
 * @deprecated - Use `mainContainer` instead
 */
export const main_container = mainContainer;
export const MainControllerTree = new ControllerTreeCreator(); //;new ComposableTreeCreator(ControllerTreeNode);

/**
 * Recursively reads files from the given folder
 */
export type FolderRead = {
  kind: 'folder',
  folder: string,
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

function isArrayType<T>(value: T | Array<T>): value is Array<T> {
    return Array.isArray(value);
}

type moduleType = { asyncModule?: AsyncContainerModule | AsyncContainerModule[], module?: ContainerModule | ContainerModule[] };

export async function initializeControllers (readType: ReadTypeObject, {asyncModule, module}: moduleType = {}): Promise<ExpressCoreRoutable[]> {
  const filesToImport: string[] = await (getReaderMethod(readType)());
  await Promise.all(filesToImport.map(async (file) => import(file)));

  if (asyncModule) {
    await mainContainer.loadAsync(...isArrayType(asyncModule) ? asyncModule : [asyncModule]);
  }

  if (module) {
    mainContainer.load(...isArrayType(module) ? module : [module]);
  }

  return MainControllerTree.initialize(mainContainer);
}

/**
 * @deprecated -- The usage of`initializeControllers`
 */
export const initializeControllerTree = async (
  readType: ReadTypeObject,
  uselessValue: boolean,
): Promise<ExpressCoreRoutable[]> => {
  const result = await initializeControllers(readType);
  return uselessValue ? result : [];
};

const getReaderMethod = (readType: ReadTypeObject): (() => Promise<string[]>) => {
  switch (readType.kind) {
    case 'folder':
      return () => syncFileReader(readType);
    case 'custom':
      return readType.getFiles;
    case 'none':
    default:
      return () => Promise.resolve([]);
  }
};

/**
 * @throws Error
 */
const syncFileReader = async ({
  folder,
  ignoredFiles: rawIgnoredFiles,
}: FolderRead): Promise<string[]> => {
  const ignoredFiles = rawIgnoredFiles === undefined
    ? []
    : typeof rawIgnoredFiles === 'string'
      ? [rawIgnoredFiles]
      : rawIgnoredFiles;

  return readDir(folder, ignoredFiles);
};
