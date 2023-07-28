import { TestContext } from 'vitest';

import { type FakeDb } from '../fakepoints/fake-db';
import {
  SetupFakepointsFn,
  setupFakepointsFactory,
  type OriginalMockServiceWorker
} from './create-fakepoints-fixture';

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
