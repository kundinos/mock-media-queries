import { it, expect, afterEach, jest } from '@jest/globals';

import * as MockMediaQueries from './index';

afterEach(() => {
  MockMediaQueries.cleanup();
});

it('Must have correct exports functions', () => {
  expect(typeof MockMediaQueries.cleanup).toBe('function');
  expect(typeof MockMediaQueries.fireEvent).toBe('function');
  expect(typeof MockMediaQueries.getListeners).toBe('function');
  expect(typeof MockMediaQueries.startMock).toBe('function');
});

it('Must return correct object when start mocking', () => {
  MockMediaQueries.startMock();

  expect(typeof window.matchMedia).toBe('function');

  const mql = window.matchMedia('screen');

  expect(typeof mql).toBe('object');
  expect(typeof mql.matches).toBe('boolean');
  expect(typeof mql.addListener).toBe('function');
  expect(typeof mql.addEventListener).toBe('function');
  expect(typeof mql.removeListener).toBe('function');
  expect(typeof mql.removeEventListener).toBe('function');
  expect(typeof mql.dispatchEvent).toBe('function');
  expect(mql.media).toBe('screen');
});

it('Must be correctly add/remove event listeners (deprecated)', () => {
  const addListener = jest.fn();
  const removeListener = jest.fn();
  const handleChange = jest.fn();

  MockMediaQueries.startMock({
    addListener: addListener,
    removeListener: removeListener,
  });

  const mql = window.matchMedia('screen');

  // Add listener
  mql.addListener(handleChange);

  expect(addListener).toBeCalledTimes(1);
  expect(removeListener).toBeCalledTimes(0);
  expect(handleChange).toBeCalledTimes(0);
  expect(typeof MockMediaQueries.getListeners()).toBe('object');
  expect(Object.keys(MockMediaQueries.getListeners()).length).toBe(1);
  expect(typeof MockMediaQueries.getListeners().screen).toBe('function');

  // Fire event
  MockMediaQueries.fireEvent({ media: 'screen', matches: true });

  expect(addListener).toBeCalledTimes(1);
  expect(removeListener).toBeCalledTimes(0);
  expect(handleChange).toBeCalledTimes(1);

  // Fire more events
  MockMediaQueries.fireEvent({ media: 'screen', matches: true });
  MockMediaQueries.fireEvent({ media: 'screen', matches: false });

  expect(handleChange).toBeCalledTimes(3);

  // Remove listener
  mql.removeListener(handleChange);

  expect(addListener).toBeCalledTimes(1);
  expect(removeListener).toBeCalledTimes(1);
  expect(handleChange).toBeCalledTimes(3);
  expect(typeof MockMediaQueries.getListeners()).toBe('object');
  expect(Object.keys(MockMediaQueries.getListeners()).length).toBe(0);
  expect(MockMediaQueries.getListeners().screen).toBeUndefined();

  // Fire events when no listeners
  MockMediaQueries.fireEvent({ media: 'screen', matches: true });

  expect(addListener).toBeCalledTimes(1);
  expect(removeListener).toBeCalledTimes(1);
  expect(handleChange).toBeCalledTimes(3);
});

it('Must be correctly add/remove event listeners', () => {
  const addEventListener = jest.fn();
  const removeEventListener = jest.fn();
  const handleChange = jest.fn();

  MockMediaQueries.startMock({
    addEventListener: addEventListener,
    removeEventListener: removeEventListener,
  });

  const mql = window.matchMedia('screen');

  // Add listener
  mql.addEventListener('change', handleChange);

  expect(addEventListener).toBeCalledTimes(1);
  expect(removeEventListener).toBeCalledTimes(0);
  expect(handleChange).toBeCalledTimes(0);
  expect(typeof MockMediaQueries.getListeners()).toBe('object');
  expect(Object.keys(MockMediaQueries.getListeners()).length).toBe(1);
  expect(typeof MockMediaQueries.getListeners().screen).toBe('function');

  // Fire event
  MockMediaQueries.fireEvent({ media: 'screen', matches: true });

  expect(addEventListener).toBeCalledTimes(1);
  expect(removeEventListener).toBeCalledTimes(0);
  expect(handleChange).toBeCalledTimes(1);

  // Fire more events
  MockMediaQueries.fireEvent({ media: 'screen', matches: true });
  MockMediaQueries.fireEvent({ media: 'screen', matches: false });

  expect(addEventListener).toBeCalledTimes(1);
  expect(removeEventListener).toBeCalledTimes(0);
  expect(handleChange).toBeCalledTimes(3);

  // Remove listeners
  mql.removeEventListener('change', handleChange);

  expect(addEventListener).toBeCalledTimes(1);
  expect(removeEventListener).toBeCalledTimes(1);
  expect(handleChange).toBeCalledTimes(3);
  expect(typeof MockMediaQueries.getListeners()).toBe('object');
  expect(Object.keys(MockMediaQueries.getListeners()).length).toBe(0);
  expect(MockMediaQueries.getListeners().screen).toBeUndefined();

  // Fire event when no listeners
  MockMediaQueries.fireEvent({ media: 'screen', matches: true });

  expect(addEventListener).toBeCalledTimes(1);
  expect(removeEventListener).toBeCalledTimes(1);
  expect(handleChange).toBeCalledTimes(3);
});

it('Must be correctly fire events', () => {
  const handleChangeScreen = jest.fn();
  const handleChangeTv = jest.fn();

  MockMediaQueries.startMock();

  window.matchMedia('screen').addEventListener('change', handleChangeScreen);
  window.matchMedia('tv').addEventListener('change', handleChangeTv);

  expect(handleChangeScreen).toBeCalledTimes(0);
  expect(handleChangeTv).toBeCalledTimes(0);

  MockMediaQueries.fireEvent({ media: 'screen', matches: true });
  expect(handleChangeScreen).toBeCalledTimes(1);
  expect(handleChangeTv).toBeCalledTimes(0);

  MockMediaQueries.fireEvent({ media: 'tv', matches: true });
  expect(handleChangeScreen).toBeCalledTimes(1);
  expect(handleChangeTv).toBeCalledTimes(1);

  MockMediaQueries.fireEvent({ media: 'screen', matches: false });
  MockMediaQueries.fireEvent({ media: 'tv', matches: false });
  expect(handleChangeScreen).toBeCalledTimes(2);
  expect(handleChangeTv).toBeCalledTimes(2);

  MockMediaQueries.fireEvent({ media: 'random', matches: true });
  expect(handleChangeScreen).toBeCalledTimes(2);
  expect(handleChangeTv).toBeCalledTimes(2);
});

it('Must be correctly cleanup', () => {
  MockMediaQueries.startMock();

  window.matchMedia('screen').addEventListener('change', jest.fn());

  expect(typeof window.matchMedia).toBe('function');
  expect(Object.keys(MockMediaQueries.getListeners()).length).toBe(1);

  MockMediaQueries.cleanup();

  expect(typeof window.matchMedia).toBe('undefined');
  expect(Object.keys(MockMediaQueries.getListeners()).length).toBe(0);
});
