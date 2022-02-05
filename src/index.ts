export type EventType = keyof MediaQueryListEventMap;

export const listeners = {};

function isCorrectEventType(type: EventType) {
  return type === 'change';
}

export function startMock(mql: Partial<MediaQueryList> = {}) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string): MediaQueryList => {
      const addListener: MediaQueryList['addListener'] = (listener) => {
        listeners[query] = listener;

        if (mql.addListener) mql.addListener(listener);
      };

      const removeListener: MediaQueryList['removeListener'] = (listener) => {
        delete listeners[query];

        if (mql.removeListener) mql.removeListener(listener);
      };

      const addEventListener: MediaQueryList['addEventListener'] = (type, listener, options) => {
        if (!isCorrectEventType(type)) return;

        listeners[query] = listener;

        if (mql.addEventListener) mql.addEventListener(type, listener, options);
      };

      const removeEventListener: MediaQueryList['removeEventListener'] = (
        type,
        listener,
        options,
      ) => {
        if (!isCorrectEventType(type)) return;

        delete listeners[query];

        if (mql.removeEventListener) mql.removeEventListener(type, listener, options);
      };

      const dispatchEvent: MediaQueryList['dispatchEvent'] = (e) => {
        if (mql.dispatchEvent) return mql.dispatchEvent(e);
        return true;
      };

      return {
        matches: false,
        media: query,
        onchange: null,
        addListener,
        removeListener,
        addEventListener,
        removeEventListener,
        dispatchEvent,
      };
    },
  });
}

export function fireEvent(props: Partial<MediaQueryListEvent>) {
  const { media, type, ...restProps } = props;
  const listener = listeners[media];

  if (listener) {
    const event: Partial<MediaQueryListEvent> = {
      media,
      type: type || 'change',
      ...restProps,
    };

    listener(event);
  }
}

export function cleanup() {
  listeners = {};
  delete window.matchMedia;
}
