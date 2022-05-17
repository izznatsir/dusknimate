import type { Directive } from '..';
import { MotionValue } from '..';
import { batch, clamp } from '../utils';

const scrollHandlers = new Map();

export const inScroll: Directive<
  (scrolled: number, elements: Record<string, Element>) => void
> = ({ element, elements, modifiers, expression }) => {
  if (!expression) return;

  let startOffset = 0;
  let endOffset = 0;

  console.log(modifiers)

  if (modifiers && modifiers.length > 0) {
    startOffset = modifiers[0] ? parseInt(modifiers[0]) : 0;
    endOffset = modifiers[1] ? parseInt(modifiers[1]) : 0;
  }

  const scrolled = new MotionValue(0);

  scrolled.subscribe((current) => {
    expression(current, elements);
  });

  const handleIntersection: IntersectionObserverCallback = (entries, _) => {
    const entry = entries[0];
    const element = entry.target;

    if (!scrollHandlers.has(element)) {
      const viewportHeight = window.innerHeight;
      
      scrollHandlers.set(element, () => {
        batch.measure(() => {
          // Calculate scrolled ratio
          const rect = element.getBoundingClientRect();

          const value = clamp(
            (viewportHeight - rect.y - rect.height * startOffset) /
              (viewportHeight + rect.height * (1 - startOffset - endOffset))
          );

          scrolled.update(value);
        });
      });
    }

    if (entry.isIntersecting) {
      scrollHandlers.get(element)();
      addEventListener('scroll', scrollHandlers.get(element));
    } else {
      removeEventListener('scroll', scrollHandlers.get(element));
      scrollHandlers.get(element)();
    }
  };

  const observer = new IntersectionObserver(handleIntersection);
  observer.observe(element);
};
