import { Body, Controller, Inject, Post, UseGuards, UsePipes, ValidationPipe, Request, Get, Param, ParseIntPipe, Patch, Delete, Put } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProductDto } from './dto/createProduct.dto';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { HttpService } from '@nestjs/axios';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('product')
export class ProductController {
    constructor(@Inject('PRODUCT_SERVICE') private readonly productService: ClientProxy, private readonly httpService: HttpService) {}

    @Post()
    @Roles('admin')
    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async create(@Request() req: any, @Body() createProductData: CreateProductDto) {
        try {
            return this.productService.send({cmd: 'create_product'}, createProductData);
        } catch (error) {
            return {error: error}
        }
    }

    @Get()
    async findAllProducts() {
        try {
            return this.productService.send({cmd: 'find_all_products'}, {});
        } catch (error) {
            return {error: error}
        }
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) prod_id: number) {
        try {
            return this.productService.send({cmd: 'find_by_id'}, prod_id);
        } catch (error) {
            return {error: error}
        }
    }

    @Patch(':id')
    @Roles('admin')
    @UseGuards(RolesGuard)
    async updateProduct(@Param('id', ParseIntPipe) prod_id: number, @Body() updateProductData: CreateProductDto) {
        try {
            return this.productService.send({cmd: 'update_product'}, {prod_id, updateProductData});
        } catch (error) {
            return {error: error}
        }
    }

    @Delete(':id')
    @Roles('admin')
    @UseGuards(RolesGuard)
    async deleteProduct(@Param('id', ParseIntPipe) prod_id: number) {
        try {
            return this.productService.send({cmd: 'delete_product'}, prod_id);
        } catch (error) {
            return {error: error}
        }
    }

    @Post(':id/review')
    @UseGuards(AuthGuard)
    async addReview(@Param('id', ParseIntPipe) prod_id: number, @Request() req: any, @Body() review: any) {
        try {
            const userId = req.user.sub;
            const data = {prod_id, userId, review}
            return this.productService.send({cmd: 'add_review'}, data);
        } catch (error) {
            return {error: error}
        }
    }

    @Get(':id/review')
    @UseGuards(AuthGuard)
    async getAverageRating(@Param('id', ParseIntPipe) prod_id: number) {
        try {
            return this.productService.send({cmd: 'get_avg_rating'}, prod_id);
        } catch (error) {
            return {error: error}
        }
    }

    // @Get()
    // async findAllProducts(@Request() req: any) {
    //     try {
    //        const allProducts = await this.httpService.axiosRef.get('http://localhost:8888/product');
    //        console.log(allProducts.data);
    //        return allProducts.data;
    //     } catch (error) {
    //         return {error: error}
    //     }
    // }


}
