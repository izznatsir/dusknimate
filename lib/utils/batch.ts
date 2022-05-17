interface TasksPools {
  a: (() => void)[];
  b: (() => void)[];
}

const measurements: TasksPools = {
  a: [],
  b: [],
};

const mutations: TasksPools = {
  a: [],
  b: [],
};

let activePoolKey: keyof TasksPools = 'a';
let bufferPoolKey: keyof TasksPools = 'b';

let isScheduled = false;
let isProcessing = false;

/**
 * Separately batch DOM measurements
 * and mutations to minimize layout trashing.
 */
export const batch = {
  measure(fn: () => void) {
    if (isProcessing) {
      measurements[activePoolKey].push(fn);
    } else {
      measurements[bufferPoolKey].push(fn);
    }

    schedule();
  },
  mutate(fn: () => void) {
    if (isProcessing) {
      mutations[activePoolKey].push(fn);
    } else {
      mutations[bufferPoolKey].push(fn);
    }

    schedule();
  },
};

function schedule() {
  if (!isScheduled) {
    isScheduled = true;
    requestAnimationFrame(runTasks);
  }
}

function runTasks() {
  isScheduled = false;

  if (isProcessing) {
    schedule();
    return;
  }

  isProcessing = true;

  const activeMeasurementsPool = measurements[activePoolKey];
  const activeMutationsPool = mutations[activePoolKey];

  while (activeMeasurementsPool.length > 0) {
    const fn = activeMeasurementsPool.shift();
    fn!();
  }

  while (activeMutationsPool.length > 0) {
    const fn = activeMutationsPool.shift();
    fn!();
  }

  const _bufferPoolKey = bufferPoolKey;
  bufferPoolKey = activePoolKey;
  activePoolKey = _bufferPoolKey;

  isProcessing = false;
}
