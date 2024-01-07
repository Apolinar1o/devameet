import { IsArray, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength, ValidateNested, isString, maxLength, minLength,} from "class-validator";
import { createMeetDto } from "./meet.dto";
import { meetMessageHelpers } from "../helpers/meetMessageHelpers";
import { Type } from "class-transformer";

export class updateMeetDto extends createMeetDto {

    @IsArray({message: meetMessageHelpers.UPDATE_OBJECT_NAME_NOT_VALID})
    @Type(() => updateMeetObjectDto)
    @ValidateNested({each: true})
    objects: Array<updateMeetObjectDto>
}

export class updateMeetObjectDto {
    
    @IsNotEmpty({message: meetMessageHelpers.CREATE_NAME_NOT_VALID})
    name: string
    @IsNumber({}, {message: meetMessageHelpers.UPDATE_XY_NOT_VALID})
    @Min(0, {message: meetMessageHelpers.UPDATE_XY_NOT_VALID})
    @Max(8, {message: meetMessageHelpers.UPDATE_XY_NOT_VALID})
    x: number 
    @IsNumber({}, {message: meetMessageHelpers.UPDATE_XY_NOT_VALID})
    @Min(0, {message: meetMessageHelpers.UPDATE_XY_NOT_VALID})
    @Max(8, {message: meetMessageHelpers.UPDATE_XY_NOT_VALID})
    y: number
    @IsNumber({}, {message: meetMessageHelpers.UPDATE_ZINDEX_NOT_VALID})
    zIndex: number
    @IsString({message: meetMessageHelpers.UPDATE_ORIENTATION_NOT_VALID})
    orientation: string
    
}   