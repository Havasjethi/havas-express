import { expect } from 'chai';
import 'reflect-metadata';
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
describe('Testing auto building & Creation', async () => {
  const initializedItems = await initializeControllerTree({ kind: 'none' }, true);
  const findIndex = (list: ExpressCoreRoutable[], cls: Constructor<ExpressCoreRoutable>) =>
    list.findIndex(
      (e) =>
        e.constructor.name === cls.name || e.constructor.name === cls?.prototype?.constructor?.name,
    );

  const mainNodeIndex = findIndex(initializedItems, AMainController);
  const mainNode = initializedItems[mainNodeIndex];
  it('Main node found', () => {
    expect(mainNodeIndex).greaterThan(-1);
  });

  it('Correct Main Children number', () => {
    expect(mainNode).to.not.undefined;
    expect(mainNode?.children?.length).equal(3);
  });

  it('Correct children', () => {
    expect(mainNode).to.not.be.undefined;

    const mainsChildren = mainNode.children;

    expect(findIndex(mainsChildren, SubController_1)).greaterThan(-1);
    expect(findIndex(mainsChildren, SubController_2)).greaterThan(-1);
    expect(findIndex(mainsChildren, SubController_Indirect_1)).greaterThan(-1);
  });

  it('Sub-Sub controller', () => {
    const instance_SubController_2 =
      mainNode.children[findIndex(mainNode.children, SubController_2)];
    expect(instance_SubController_2).not.equal(undefined);
    expect(instance_SubController_2.children.length).equal(1);
    expect(findIndex(instance_SubController_2.children, SubController_2_1)).greaterThan(-1);
  });
});
