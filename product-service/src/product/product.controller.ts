import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @MessagePattern({cmd: 'create_product'})
    async createProduct(data: any) {
        return this.productService.createProduct(data);
    }

    @MessagePattern({cmd: 'find_all_products'})
    async findAllProducts(data: any) {
        return this.productService.findAllProducts();
    }

    @MessagePattern({cmd: 'find_by_id'})
    async findById(prod_id: number) {
        return this.productService.findById(prod_id);
    }

    @MessagePattern({cmd: 'update_product'})
    async updateProduct(data: any) {
        return this.productService.updateProduct(data);
    }

    @MessagePattern({cmd: 'delete_product'})
    async deleteProduct(data: any) {
        return this.productService.deleteProduct(data);
    }

    @MessagePattern({cmd: 'add_review'})
    async addReview(data: any) {
        return this.productService.addReview(data);
    }

    @MessagePattern({cmd: 'get_avg_rating'})
    async getAverageRating(prod_id: number) {
        return this.productService.getAverageRating(prod_id);
    }
}
