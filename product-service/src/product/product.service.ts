import { Injectable } from '@nestjs/common';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
    constructor(@InjectRepository(Product) private productRepository: Repository<Product>) { }

    async createProduct(data: any) {
        try {
            const createNewProduct = await this.productRepository.save(data);
            return {
                message: "Product succefully created",
                result: createNewProduct
            }
        } catch (error) {
            throw error;
        }
    }

    async findAllProducts() {
        const allProds = await this.productRepository.find();
        return allProds;
    }

    async findById(prod_id: number) {
        const product = await this.productRepository.findOne({where: {
            id: prod_id
        }});

        return {
            message: 'Product fetched successfully',
            result: { product },
        }
    }

    async updateProduct(data: any) {
        const product = await this.productRepository.findOne({where: {
            id: data.prod_id
        }});

        if(!product) {
            return "Product missing from invertory";
        }

        const updateProduct = await this.productRepository.update(data.prod_id, data.updateProductData);
        return {
            message: "Your product is updated",
            product: updateProduct
        }
    }

    async deleteProduct(prod_id: any) {
        const product = await this.productRepository.findOne({where: {
            id: prod_id
        }});

        if(!product) {
            return "Product missing from invertory";
        }

        const deleteProd = await this.productRepository.delete(prod_id);
        return "Your product is deleted";
    }

    async addReview(data: any) {
        const productId = data.prod_id;
        const userId = data.userId;
        const product = await this.productRepository.findOne({ where: { id: productId } });

        if (!product) {
            throw new Error('Product not found');
        }

        if (product.userIds.includes(userId)) {
            throw new Error('User has already reviewed this product');
        }

        product.ratings.push(data.review.rating);
        product.comments.push(data.review.comment);
        product.userIds.push(data.userId);
        
        return this.productRepository.save(product);
    }

    async getAverageRating(prod_id: number) {
        const product = await this.productRepository.findOne({ where: { id: prod_id } });
        const result = await this.productRepository.query(
            `SELECT AVG(rating) as averageRating
             FROM unnest($1::int[]) as rating`,
            [product.ratings]
        );

        return {
            [`Average Rating of product with id ${prod_id}`]: result[0].averagerating || 0
        };
    }
}
