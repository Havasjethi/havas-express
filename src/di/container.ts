import { Container } from 'inversify';
import { ExpressCoreRoutable } from '../classes/express_core_routable';
import { ComposableTreeCreator, ControllerTreeCreator } from './controller_tree';

export const mainContainer = new Container({
  skipBaseClassChecks: true,
});

/**
 * @deprecated
 */
export const main_container = mainContainer;
export const MainControllerTree = new ControllerTreeCreator(); //;new ComposableTreeCreator(ControllerTreeNode);

export enum ReadType {
  None,
  Folder,
  NameMatch,
}

export const initializeControllerTree = (
  readType: ReadType,
  initializeControllers: boolean,
): ExpressCoreRoutable[] => {
  const fileImporter = getReaderMethod(readType);

  const filesToImport: string[] = fileImporter();

  filesToImport.forEach((file) => import(file));

  const initializedRouters = [];
  if (initializeControllers) {
    initializedRouters.push(...MainControllerTree.initialize(mainContainer));
  }

  return initializedRouters;
};

const getReaderMethod = (y: ReadType): (() => string[]) => {
  // TODO :: Add Folder  find logic
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
