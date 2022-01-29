import {
  App,
  Component,
  Controller,
  initializeControllerTree,
  MainController,
  ReadType,
  Router,
  UseMiddleware,
} from '../../index';
import { ExpressCoreRoutable } from '../../src/classes';
import { Constructor } from '../../src/util';

@Component()
class Dependency {
  public testMethod() {}
}

@UseMiddleware(() => {})
@MainController
class AMainController extends App {
  constructor(public testDependency: Dependency) {
    super();
  }
}

@Controller(AMainController)
class SubController_1 extends Router {}

@Controller(AMainController)
class SubController_2 extends Router {}

@Controller(SubController_2)
class SubController_2_1 extends Router {}

@Controller()
class SubController_Indirect_1 extends Router {}

const expectIndexExists = () => {};
describe('Testing auto building & Creation', () => {
  const initializedItems = initializeControllerTree(ReadType.None, true);
  const findIndex = (list: ExpressCoreRoutable[], cls: Constructor<ExpressCoreRoutable>) =>
    list.findIndex(
      (e) =>
        e.constructor.name === cls.name || e.constructor.name === cls?.prototype?.constructor?.name,
    );

  const mainNodeIndex = findIndex(initializedItems, AMainController);
  const mainNode = initializedItems[mainNodeIndex];
  test('Main node found', () => {
    expect(mainNodeIndex).toBeGreaterThan(-1);
  });

  test('Correct Main Children number', () => {
    expect(mainNode).not.toBeUndefined();
    expect(mainNode?.children?.length).toBe(3);
  });

  test('Correct childrend', () => {
    expect(mainNode).not.toBeUndefined();

    const mainsChildren = mainNode.children;

    expect(findIndex(mainsChildren, SubController_1)).toBeGreaterThan(-1);
    expect(findIndex(mainsChildren, SubController_2)).toBeGreaterThan(-1);
    expect(findIndex(mainsChildren, SubController_Indirect_1)).toBeGreaterThan(-1);
  });

  test('Sub-Sub controller', () => {
    const instance_SubController_2 =
      mainNode.children[findIndex(mainNode.children, SubController_2)];
    expect(instance_SubController_2).not.toBeUndefined();
    expect(instance_SubController_2.children.length).toBe(1);
    expect(findIndex(instance_SubController_2.children, SubController_2_1)).toBeGreaterThan(-1);
  });
});
