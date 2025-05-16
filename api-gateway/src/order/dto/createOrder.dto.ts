import { IsArray, IsNotEmpty, IsNumber, ArrayNotEmpty, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class ProductDto {
    @IsNumber()
    @IsNotEmpty()
    productId: number;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;
}

export class CreateOrderDto {
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ProductDto)
    products: ProductDto[];
}
