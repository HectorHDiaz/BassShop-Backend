const config = require('../config/config');
const DAOSFactory = require('../models/daos/daos.factory');
const ProductSchema = require('../models/schemas/products.schema');


class ProductServices {
  static async #validateProduct(product) {
    try {
      return await ProductSchema.validate(product);
    }
    catch (error) {
      throw new Error('Service Validation Error')
    }
  }

  constructor() {
    DAOSFactory.getDAOS(config.DATA_SOURCE).then((daos) => {
      if (config.DATA_SOURCE.toLowerCase() === 'mongo') {
        this.productDAO = daos.productsDao[config.DATABASE]
      } else {
        this.productDAO = daos.productsDao
      }
    });
  }

  async getAllProductsService() {
    try {
      return await this.productDAO.getAllProducts()
    } catch (error) {
      throw new Error(`Getting all Products. ${error}`)
    }
  }

  async getProductByIdService(id) {
    try {
      return await this.productDAO.getProductById(id)
    } catch (error) {
      throw new Error(`Getting the Product. ${error}`)
    }
  }

  async getProductsByCategoryService(category) {
    try {
      const allProducts = await this.productDAO.getAllProducts()
      const theProducts = allProducts.filter(prod => prod.category === category)

      if (!theProducts) {
        throw new Error(`Category ${id} does not exist`)
      }
      return theProducts
    } catch (error) {
      throw new Error(`Getting the Product. ${error}`)
    }
  }

  async createProductService(product) {
    try {
      const newProduct = {
        ...product
      };
      const validatedProduct = ProductServices.#validateProduct(newProduct);
      return await this.productDAO.createProduct(validatedProduct);
    } catch (error) {
      throw new Error(`Creating the product. ${error}`)
    }
  }

  async updateProductService(id, product) {
    try {
      const idValidation = await this.productDAO.getProductById(id)
      if (!idValidation) {
        throw new Error(`Product with id: ${id} does no exist`)
      }
      const updatedProduct = await this.productDAO.updateProductById(id, product)
      return updatedProduct;
    } catch (error) {
      throw new Error(`Updating the Product. ${error}`)
    }
  }

  async deleteProduct(id) {
    try {
      const idValidation = await this.productDAO.getProductById(id)
      if (!idValidation) {
        throw new Error(`Product with id: ${id} does no exist`)
      }
      const deletedProduct = await this.productDAO.deleteProductById(id)
      return deletedProduct
    } catch (error) {
      throw new Error(`Deleting the Product. ${error}`)
    }
  }
}

module.exports = ProductServices;