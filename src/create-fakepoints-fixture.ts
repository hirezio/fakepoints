import { setupServer } from 'msw/node';
import { MockServiceWorker as PlaywrightMockServiceWorker } from 'playwright-msw';
import { FakeDb, Fakepoints } from '..';

export type FakepointsClass = new (fakeDb: FakeDb) => Fakepoints;
export type OriginalMockServiceWorker = ReturnType<typeof setupServer>;
export type MockServiceWorker = PlaywrightMockServiceWorker | OriginalMockServiceWorker;

export type SetupFakepointsFn = (
  FakepointsClassOrClasses: FakepointsClass | FakepointsClass[]
) => void;
// {[key: string]: Fakepoints;}

export function setupFakepointsFactory(msw: MockServiceWorker, fakeDb: FakeDb) {
  return async (fakepointsClasses: FakepointsClass | FakepointsClass[]) => {
    if (!Array.isArray(fakepointsClasses)) {
      fakepointsClasses = [fakepointsClasses];
    }
    const fakepointsInstances = fakepointsClasses.map((FakepointsClass) => {
      return new FakepointsClass(fakeDb);
    });
    const handlers = fakepointsInstances.flatMap((fakepoints) => {
      return fakepoints.createFakepoints();
    });
    await msw.use(...handlers);
    // function createFakepointsMap<T extends Fakepoints>(
    //   fakepointsInstances: T[]
    // ): { [key: string]: T } {
    //   const fakepointsMap: { [key: string]: T } = {};
    //   fakepointsInstances.forEach((handler) => {
    //     const handlerClassName = handler.constructor.name;
    //     const transformedName =
    //       handlerClassName.charAt(0).toLowerCase() + handlerClassName.slice(1);
    //     fakepointsMap[transformedName] = handler;
    //   });
    //   return fakepointsMap;
    // }

    // return createFakepointsMap(fakepointsInstances);
  };
}
