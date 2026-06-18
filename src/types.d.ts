// Minimal type shims to allow compilation when @types/* are not resolved
// These allow the demo to build cleanly in restricted environments.

declare module 'react' {
  const React: any;
  export default React;

  export type ReactNode = any;
  export type Dispatch<A> = (value: A) => void;
  export type SetStateAction<S> = S | ((prevState: S) => S);

  export function useState<S>(initial: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function createElement(type: any, props?: any, ...children: any[]): any;
  export const StrictMode: any;
  export const Fragment: any;
  export type ReactElement = any;
}

declare module 'react-dom/client' {
  export interface Root {
    render(element: any): void;
    unmount(): void;
  }
  export function createRoot(container: Element | DocumentFragment): Root;
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elem: string]: any;
  }
  interface Element extends React.ReactElement<any, any> { }
}
