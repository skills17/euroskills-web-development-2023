import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema, values: any) => (schema.safeParse(values) as any)?.error?.errors?.reduce(
  (errors, error) =>
    error.path.reduce((a, b, level) => {
      if (level === error.path.length - 1) {
        a[b] = error.message;

        return errors;
      }

      if (!a[b]) {
        a[b] = {};
      }

      return a[b];
    }, errors),
  {} as { [key: string]: any },
);
