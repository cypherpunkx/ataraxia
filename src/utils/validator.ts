import * as v from 'valibot';

class Validator {
  static validate<T extends v.ObjectSchema<never, never>>(
    schema: T,
    data: v.InferOutput<T>
  ) {
    return v.parse(schema, data);
  }
}

export default Validator;
