export * from './directives';
export * from './utils';
export * from './value';

export interface Directive<Expression = () => void> {
  (context: {
    element: Element;
    elements: Record<string, Element>;
    modifiers?: string[];
    expression?: Expression extends (...args: any[]) => any
      ? Expression
      : undefined;
  }): any;
}

type Bindings<
  Data extends Record<
    string,
    number | string | boolean | Array<number | string | boolean> | Data
  >,
  Methods extends (...args: any[]) => void,
  Directives extends Record<string, Directive>
> = {
  [Key: string]: {
    [Key in keyof Directives]?: Parameters<Directives[Key]>[0]['expression'];
  } & ThisType<Data & Methods>;
};

type Scope<
  Data extends Record<
    string,
    number | string | boolean | Array<number | string | boolean> | Data
  >,
  Methods extends (...args: any[]) => void,
  Directives extends Record<string, Directive>
> = {
  mount: (bindings?: Bindings<Data, Methods, Directives>) => void;
  unmount: () => void;
};

export function createScope<
  Data extends Record<
    string,
    number | string | boolean | Array<number | string | boolean> | Data
  >,
  Methods extends (...args: any[]) => void,
  Directives extends Record<string, Directive>
>(
  name: string,
  config?: {
    data?: Data;
    methods?: Methods & ThisType<Data & Methods>;
    directives?: Directives;
  }
): Scope<Data, Methods, Directives> {
  const domRoot = document.querySelector(`[x-scope=${name}]`);

  if (!domRoot) {
    throw new Error(`There is no DOM element binded to '${name}' scope.`);
  }

  let elements: Record<string, Element> = {};

  domRoot.querySelectorAll('[x-bind]').forEach((element) => {
    const name = element.getAttribute('x-bind');

    if (!name) return;

    elements[name] = element;
  });

  const cloakedElementsList = domRoot.querySelectorAll('[x-cloak]');

  return {
    mount(bindings) {
      cloakedElementsList.forEach((element) => {
        (element as HTMLElement).style.display = '';
      });

      if (!config || !config.directives) return;

      // Traverse the bindings and execute all its directives.
      for (const name in bindings) {
        const directives = bindings[name];
        const element = elements[name];

        for (const nameAndModifiers in directives) {
          const expression =
            typeof directives[nameAndModifiers] === 'function'
              ? directives[nameAndModifiers]
              : undefined;

          const [name, ...modifiers] = nameAndModifiers.split('|');

          const directive = config.directives[name];

          if (!directive) continue;

          directive({ element, elements, modifiers, expression });
        }
      }
    },
    unmount() {},
  };
}
