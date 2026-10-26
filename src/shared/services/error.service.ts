import { Injectable } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { I18nContext } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';
import { NodeEnv } from '@core/enum';
import * as _ from 'lodash';

@Injectable()
export class ErrorService {
  constructor(private readonly configService: ConfigService) {}
  message(err: string | object, i18n: I18nContext, stackTrace: any) {
    const error = (
      typeof err === 'object' && err !== null ? err : { message: err }
    ) as { message?: unknown; error?: string };
    const errorMessage = _.isArray(error.message)
      ? String(error.message[0])
      : String(error.message ?? '');
    switch (error.error) {
      case 'Bad Request':
        return this.combine(errorMessage, i18n);
      case 'Forbidden':
        return this.combine(errorMessage, i18n);
      case 'Internal Server Error':
        if (this.configService.get('NODE_ENV') == NodeEnv.DEVELOPMENT) {
          return this.combineDev(errorMessage, i18n, stackTrace);
        }
        return this.combine(errorMessage, i18n);
      case 'Not Found':
        return this.combine(errorMessage, i18n);
      case 'Unauthorized':
        return this.combine(errorMessage, i18n);
      case 'Unprocessable Entity':
        return this.handleUnprocessEntity(err, i18n);
      default:
        return this.combine(errorMessage, i18n);
    }
  }

  private handleUnprocessEntity(error: string | object, i18n: I18nContext) {
    const normalizedError = (
      typeof error === 'object' && error !== null ? error : { message: error }
    ) as { message?: unknown };
    const validationErrors = Array.isArray(normalizedError.message)
      ? (normalizedError.message as ValidationError[])
      : [];
    const transformedError = this.transform(validationErrors, i18n).flat();

    return this.combine('CUS-0401', i18n, transformedError);
  }

  private transform(errors: ValidationError[], i18n: I18nContext) {
    if (!i18n || !i18n.t) {
      return errors;
    }
    const transformedError = errors.map((err: ValidationError) => {
      return Object.values(err.constraints || {}).map((value: string) => {
        const res = i18n.t(`errors.${value}`, {
          args: { property: err.property },
        });
        const base =
          typeof res === 'object' && res !== null
            ? res
            : { message: res || value };
        return Object.assign(base, { field: err.property });
      });
    });

    return transformedError;
  }

  private combine(err_msg: string, i18n: I18nContext, errors: object[] = []) {
    if (!i18n || !i18n.t) {
      return {
        message: err_msg,
        errors,
      };
    }
    const res = i18n.t(`errors.${err_msg}`);
    return typeof res === 'object' && res !== null
      ? Object.assign(res, {})
      : { message: res || err_msg };
  }

  private combineDev(err_msg: string, i18n: I18nContext, stackTrace: any) {
    if (!i18n || !i18n.t) {
      return {
        message: err_msg,
        details: stackTrace,
      };
    }
    const res = i18n.t(`errors.${err_msg}`);
    const base =
      typeof res === 'object' && res !== null
        ? res
        : { message: res || err_msg };
    return Object.assign(base, {
      details: stackTrace,
    });
  }
}
