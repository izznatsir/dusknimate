import { batch, createScope, inScroll, interpolate } from '../lib';

const figmaScope = createScope('figma', {
  directives: {
    inscroll: inScroll,
  },
});

figmaScope.mount({
  scrolled: {
    ['inscroll|0.25|0.25'](scrolled, elements) {
      const c1 = elements.c1 as SVGCircleElement;
      const c2 = elements.c2 as SVGCircleElement;
      const c3 = elements.c3 as SVGCircleElement;
      const c4 = elements.c4 as SVGCircleElement;
      const c5 = elements.c5 as SVGCircleElement;
      const c6 = elements.c6 as SVGCircleElement;
      const c7 = elements.c7 as SVGCircleElement;
      const c8 = elements.c8 as SVGCircleElement;
      const c9 = elements.c9 as SVGCircleElement;

      const radius1 = interpolate([0, 1], [0, 2400]);
      const radius2 = interpolate([0.1, 1], [0, 2400]);
      const radius3 = interpolate([0.2, 1], [0, 2400]);
      const radius4 = interpolate([0.3, 1], [0, 2400]);
      const radius5 = interpolate([0.4, 1], [0, 2400]);
      const radius6 = interpolate([0.5, 1], [0, 2400]);
      const radius7 = interpolate([0.6, 1], [0, 2400]);
      const radius8 = interpolate([0.7, 1], [0, 2400]);
      const radius9 = interpolate([0.8, 1], [0, 2400]);

      batch.mutate(() => {
        c1.setAttribute('r', radius1(scrolled).toString());
        c2.setAttribute('r', radius2(scrolled).toString());
        c3.setAttribute('r', radius3(scrolled).toString());
        c4.setAttribute('r', radius4(scrolled).toString());
        c5.setAttribute('r', radius5(scrolled).toString());
        c6.setAttribute('r', radius6(scrolled).toString());
        c7.setAttribute('r', radius7(scrolled).toString());
        c8.setAttribute('r', radius8(scrolled).toString());
        c9.setAttribute('r', radius9(scrolled).toString());
      });
    },
  },
});
