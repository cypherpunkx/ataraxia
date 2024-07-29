import * as v from 'valibot';

class Validator {
  static validate<T extends v.ObjectSchema<any, any>>(
    schema: T,
    data: v.InferOutput<T>
  ) {
    return v.parse(schema, data);
  }
}

export default Validator;
