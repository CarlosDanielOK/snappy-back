import { IsDateString, IsNotEmpty } from "class-validator";

export class subscriptionRangeDTO {
    @IsNotEmpty()
    @IsDateString()
    startDate: string;

    @IsNotEmpty()
    @IsDateString()
    endDate: string;
}
