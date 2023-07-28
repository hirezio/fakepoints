import { TestContext } from 'vitest';

import {
  SetupFakepointsFn,
  setupFakepointsFactory,
  type OriginalMockServiceWorker
} from '../fakepoints/create-fakepoints-fixture';
import { type FakeDb } from '../fakepoints/fake-db';

export type FakepointsFixture = () => (
  context: {
    msw: OriginalMockServiceWorker;
    fakeDb: FakeDb;
  } & TestContext,
  use: (fixture: SetupFakepointsFn) => Promise<void>
) => Promise<void>;

export const createFakepointsFixture: FakepointsFixture =
  () =>
  async ({ msw, fakeDb }, use) => {
    await use(setupFakepointsFactory(msw, fakeDb));
  };
