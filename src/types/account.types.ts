import {
	IsString,
	MinLength,
	IsEmail,
	ValidationOptions,
	registerDecorator,
	ValidationArguments,
	IsUrl,
	IsOptional,
} from 'class-validator';

// custom validator decorator
const IsMatch = (property: string, validationOptions?: ValidationOptions) => {
	return function (object: Record<string, any>, propertyName: string) {
		registerDecorator({
			name: 'isMatch',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [property],
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					const [relatedPropertyName] = args.constraints;
					const relatedValue = (args.object as any)[relatedPropertyName];
					return value === relatedValue;
				},
				defaultMessage(args: ValidationArguments) {
					const [relatedPropertyName] = args.constraints;
					return `${propertyName} must match ${relatedPropertyName}`;
				},
			},
		});
	};
};

export class LoginParams {
	@IsString()
	@MinLength(3)
	username!: string;

	@IsString()
	password!: string;
}

export class RegisterParams extends LoginParams {
	@IsEmail()
	email!: string;

	@IsString()
	@MinLength(6)
	password!: string;

	@IsString()
	@IsMatch('password', { message: 'Confirm password must match password' })
	cf_password!: string;

	@IsString()
	captcha!: string;
}

export class UpdateAccountParams {
	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@IsString()
	@MinLength(6)
	password?: string;

	@IsOptional()
	@IsUrl()
	avatar?: string;
}
