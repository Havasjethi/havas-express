import {
  AMainController,
  App,
  Controller,
  initializeControllerTree,
  ReadType,
  Router,
  UseMiddleware,
} from '../../index';

@AMainController
@UseMiddleware(() => {})
class MainController extends App {}

@Controller()
class SubController_1 extends Router {}

@Controller()
class SubController_2 extends Router {}

@Controller()
class SubController_2_1 extends Router {}

describe('Testing auto building & Creation', () => {
  initializeControllerTree(ReadType.None, true);
  test('In', () => {});
});
