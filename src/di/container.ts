import { Container } from 'inversify';
import { ComposableTree, ControllerTreeNode } from './controller_tree';

export const mainContainer = new Container();
export const main_container = mainContainer;
export const MainControllerTree = new ComposableTree(ControllerTreeNode);

export enum ReadType {
  None,
  Folder,
}

export const initializeControllerTree = (readType: ReadType, initializeControllers: boolean) => {
  const fileImporter = getReaderMethod(readType);

  const filesToImport: string[] = fileImporter();

  filesToImport.forEach((file) => import(file));

  if (initializeControllers) {
    MainControllerTree.initialize(mainContainer);
  }
};

const getReaderMethod = (y: ReadType): (() => string[]) => {
  switch (y) {
    case ReadType.Folder:
      return recursiveRead;
    case ReadType.None:
    default:
      return () => [];
  }
};

const recursiveRead = (): string[] => {
  return [];
};
