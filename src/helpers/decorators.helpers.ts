/** @format */

import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

const Match = (property: string, validationOptions?: ValidationOptions) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
};

@ValidatorConstraint({ name: 'Match' })
class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${relatedPropertyName} and ${args.property} don't match`;
  }
}

const NotMatch = (property: string, validationOptions?: ValidationOptions) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: NotMatchConstraint,
    });
  };
};

@ValidatorConstraint({ name: 'NotMatch' })
class NotMatchConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value !== relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${relatedPropertyName} and ${args.property} can not be the same`;
  }
}

// const IsOtp = (length = 4, validationOptions?: ValidationOptions) => {
//   //eslint-disable-next-line @typescript-eslint/no-explicit-any
//   return (object: any, propertyName: string) => {
//     registerDecorator({
//       target: object.constructor,
//       propertyName,
//       options: validationOptions,
//       constraints: [length],
//       validator: IsOtpConstraint,
//     });
//   };
// };

// @ValidatorConstraint({ name: 'IsOtp' })
// class IsOtpConstraint implements ValidatorConstraintInterface {
//   validate(value: number, args: ValidationArguments) {
//     return (
//       typeof value === 'number' && `${value}`.length === args.constraints[0]
//     );
//   }

//   defaultMessage(args: ValidationArguments) {
//     if (`${args.value}`.length !== args.constraints[0]) {
//       return `${args.property} must be a ${args.constraints[0]} numbers`;
//     }
//     return `${args.property} must be a number`;
//   }
// }

export { Match, MatchConstraint, NotMatch };
