import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'reservationInterval', async: false })
export class ReservationInterval implements ValidatorConstraintInterface {
  validate(endsAt: unknown, args: ValidationArguments): boolean {
    const { startsAt } = args.object as { startsAt?: unknown };
    // A partial update may supply only one endpoint. PostgreSQL validates the
    // resulting stored interval against the endpoint already in the record.
    if (startsAt === undefined || endsAt === undefined) return true;
    if (typeof startsAt !== 'string' || typeof endsAt !== 'string')
      return false;
    const start = Date.parse(startsAt);
    const end = Date.parse(endsAt);
    return Number.isFinite(start) && Number.isFinite(end) && end > start;
  }

  defaultMessage(): string {
    return 'endsAt debe ser posterior a startsAt';
  }
}
