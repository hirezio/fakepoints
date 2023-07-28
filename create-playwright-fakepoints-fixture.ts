import { PlaywrightTestArgs, TestFixture } from '@playwright/test';
import { MockServiceWorker } from 'playwright-msw';
import {
  setupFakepointsFactory,
  type SetupFakepointsFn
} from '../fakepoints/create-fakepoints-fixture';
import { type FakeDb } from '../fakepoints/fake-db';

export type FakepointsFixture = () => [
  TestFixture<SetupFakepointsFn, PlaywrightTestArgs & { msw: MockServiceWorker; fakeDb: FakeDb }>,
  { scope: 'test'; auto: boolean }
];

export const createFakepointsFixture: FakepointsFixture = () => [
  async ({ msw, fakeDb }, use) => {
    await use(setupFakepointsFactory(msw, fakeDb));
  },
  { scope: 'test', auto: false }
];
