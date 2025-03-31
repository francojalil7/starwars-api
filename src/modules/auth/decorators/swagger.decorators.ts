import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import {
  ChangePasswordDto,
  LoginUserDto,
  RegisterResponseDto,
  RegisterUserDto,
} from '../dto';
import { LoginResponseDto } from '../dto/login-response.dto';

export function ApiRegisterUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Register a new user',
      description: 'Creates a new user account with the provided credentials',
    }),
    ApiResponse({
      status: 201,
      description: 'User successfully created',
      type: RegisterResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid data or email already exists',
      schema: {
        example: {
          statusCode: 400,
          message: 'Email already exists in the database',
          error: 'Bad Request',
        },
      },
    }),
    ApiBody({
      type: RegisterUserDto,
      description: 'User registration information',
    }),
  );
}

export function ApiChangePassword() {
  return applyDecorators(
    ApiOperation({
      summary: 'Change user password',
      description:
        'Authenticated users can change their password by providing the current and new one.',
    }),
    ApiResponse({
      status: 200,
      description: 'Password changed successfully',
      schema: {
        example: {
          message: 'Password changed successfully',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Validation failed',
      schema: {
        example: {
          statusCode: 400,
          message: [
            'currentPassword must be a string',
            'newPassword must be longer than or equal to 6 characters',
          ],
          error: 'Bad Request',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Missing or invalid credentials',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Invalid current password or not allowed',
      schema: {
        example: {
          statusCode: 403,
          message: 'Current password is incorrect',
          error: 'Forbidden',
        },
      },
    }),
    ApiBody({
      type: ChangePasswordDto,
      description: 'Current and new password payload',
    }),
  );
}

export function ApiLoginUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Login user',
      description: 'Authenticates a user with email and password',
    }),
    ApiResponse({
      status: 200,
      description: 'User successfully logged in',
      type: LoginResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Invalid data',
      schema: {
        example: {
          statusCode: 400,
          message: 'Invalid data',
          error: 'Bad Request',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'email must be an email',
      schema: {
        example: {
          statusCode: 401,
          message: 'email must be an email',
          error: 'Bad Request',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Invalid data',
      schema: {
        example: {
          statusCode: 400,
          message: [
            'The password must have a Uppercase, lowercase letter and a number',
            'password must be shorter than or equal to 50 characters',
            'password must be longer than or equal to 6 characters',
            'password must be a string',
          ],
          error: 'Bad Request',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid credentials',
      schema: {
        example: {
          statusCode: 401,
          message: 'Invalid credentials',
          error: 'Unauthorized',
        },
      },
    }),
    ApiBody({
      type: LoginUserDto,
      description: 'User login information',
    }),
  );
}
