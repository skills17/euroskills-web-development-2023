import { DefaultNamingStrategy, Table } from 'typeorm';
import pluralize from 'pluralize';
import { snakeCase } from 'snake-case';

export class LaravelNamingStrategy extends DefaultNamingStrategy {
  tableName(targetName: string, userSpecifiedName: string): string {
    return userSpecifiedName || snakeCase(pluralize(targetName));
  }

  columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
    return customName || snakeCase(propertyName);
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return `${snakeCase(relationName)}_${referencedColumnName}`;
  }
}
