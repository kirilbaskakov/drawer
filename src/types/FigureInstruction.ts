type GetMethods<O extends object> = keyof {
  [key in keyof O as O[key] extends (...args: unknown[]) => unknown
    ? key
    : never]: O[key];
};

type MethodParams<T extends object> = {
  [K in GetMethods<T>]: T[K] extends (...args: infer A) => unknown
    ? [K, A]
    : never;
}[GetMethods<T>];

type FigureInstruction = MethodParams<CanvasRenderingContext2D>;

export default FigureInstruction;
