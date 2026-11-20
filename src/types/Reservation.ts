export interface Reservation {
    id: number;
    name: string;
    email: string;
    startDate: Date;
    guests: number;
}

export type ReservationCreateInfo = Omit<Reservation, 'id'>;
export type ReservationDTO = { [k in keyof ReservationCreateInfo]?: string }

export type ValidationError = [keyof ReservationCreateInfo, string]

export type ToCreateInfoSuccess = [ReservationCreateInfo, never];
export type ToCreateInfoFail = [never, ValidationError[]];
export type ToCreateInfoResult = ToCreateInfoFail | ToCreateInfoSuccess;

export function toCreateInfo(dto: ReservationDTO): ToCreateInfoResult {
    const errors: ValidationError[] = [];
    // NOTE(vd) this is fine as long as we only return this when there are no errors
    const createInfo = {} as ReservationCreateInfo;

    // TODO(vd): might want to trim these
    // TODO(vd): max length(100)
    dto.name = dto.name?.trim();
    if (!dto.name) errors.push(['name', 'cannot be empty']);
    else if (dto.name.length > 100) errors.push(['name', 'too long']);
    else createInfo.name = dto.name;

    dto.email = dto.email?.trim();
    if (!dto.email) errors.push(['email', 'cannot be empty']);
    else if (!/^.+@.+$/.test(dto.email)) errors.push(['email', 'not a valid email address']);
    else if (dto.email.length > 100) errors.push(['email', 'too long']);
    else createInfo.email = dto.email;

    if (!dto.startDate) errors.push(['startDate', 'cannot be empty']);
    else {
        const d = new Date(dto.startDate);
        if (isNaN(d.getTime())) errors.push(['startDate', 'not a valid date']);
        else if (d < new Date()) errors.push(['startDate', 'cannot be in the past']);
        else createInfo.startDate = d;
    }

    if (!dto.guests) errors.push(['guests', 'cannot be empty']);
    else {
        const n = +dto.guests;
        if (isNaN(n)) errors.push(['guests', 'not a valid number']);
        else if (n > 10 || n < 1) errors.push(['guests', 'not in the range of [1; 10]']);
        else if (n != Math.floor(n)) errors.push(['guests', 'not an integral number']);
        else createInfo.guests = n;
    }

    return errors.length ? [undefined as never, errors] : [createInfo, undefined as never];
}
