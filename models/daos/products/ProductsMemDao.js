const path = require('path')
const fs = require('fs')
const ProductsDTO = require('../../dtos/product.dto')
const dataPath = path.resolve(__dirname, "./productsData.txt")


class ProductsMemDAO {
  constructor() {
    this.products = this.readFileDAO()
    this.saveProductsFile = () => {
      fs.writeFileSync(dataPath, JSON.stringify(this.products, null, 3))
    }
  }
  readFileDAO() {
    try {
      this.products = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    } catch (error) {
      throw new Error('While reading file.')
    }
  }
  getAllProducts() {
    try {
      this.readFileDAO()
      return this.products;
    } catch (error) {
      throw error
    }
  };

  getProductById(id) {
    try {
      this.readFileDAO()
      const product = this.products.find((prod) => prod._id === id);
      return product || { error: `el producto ${id} no fué encontrado!` };
    } catch (error) {
      throw error
    }
  };

  async createProduct(productPayload) {
    try {
      this.readFileDAO()
      const newProduct = new ProductsDTO(productPayload)
      this.products.push(newProduct)
      this.saveProductsFile()
      return newProduct;
    } catch (error) {
      throw error
    }
  };

  updateProductById(id, productPayload) {
    try {
      this.readFileDAO()
      const index = this.products.findIndex(product => product._id === id);
      if (index < 0) return { error: `No se encontró un Producto con el id: ${id}!` };
      const updatedProduct = {
        ...this.products[index],
        ...productPayload
      }
      const replacedProduct = new ProductsDTO(updatedProduct)
      this.products[index] = replacedProduct
      this.saveProductsFile()
      return replacedProduct;
    } catch (error) {
      throw error
    }
  };
  deleteProductById(id) {
    try {
      this.readFileDAO()
      const index = this.products.findIndex(product => product._id === id);
      if (index < 0) return { error: `No se encontró un Producto con el id: ${id}!` };
      const newList = this.products.splice(index, 1);
      this.saveProductsFile()
      return newList
    } catch (error) {
      throw error
    }
  };
}

module.exports = ProductsMemDAO;