const ProductsService = require('../services/product.services')

class ProductsController {
  constructor() {
    this.productsService = new ProductsService()
  }

  getAllProducts = async (req, res, next) => {
    try {
      const allProducts = await this.productsService.getAllProductsService()
      return allProducts
    } catch (error) {
      next(error)
    }
  };

  getProductById = async (req, res, next) => {
    try {
      const sessionUser = req.user;
      const productId = req.params.productId;
      const theProduct = await this.productsService.getProductByIdService(productId)
      if (sessionUser) {
        const sessionCart = sessionUser.cart;
        res.render('singleProduct.ejs', {theProduct, sessionCart});
      }else{
        res.render('singleProduct.ejs', {theProduct});
      }
    } catch (error) {
      next(error)
    }
  };

  getProductsByCategory = async (req, res, next) => {
    try {
      const category = req.params.category;
      console.log(category)
      const searchedProduct = await this.productsService.getProductsByCategoryService(category)
      return searchedProduct;
    } catch (error) {
      next(error)
    }
  };

  saveNewProduct = async (req, res, next) => {
    try {
      const { name, desc, image, price, stock } = req.body;
      if (!name || !desc || !image || !price || !stock) return ({ error: 'Todos los campos son obligatorios!' });
      const newProduct = {
        name: req.body.name,
        desc: req.body.desc,
        image: req.body.image,
        price: req.body.price,
        stock: req.body.stock,
        category: req.body.category
      }
      const savedProduct = await this.productsService.createProductService(newProduct)
      return savedProduct
    } catch (error) {
      next(error)
    }
  };

  updateProduct = async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { name, desc, price, image, stock } = req.body;
      const newProduct = { name, desc, price, image, stock };
      if (!name || !desc || !image || !price || !stock) return res.json({ error: 'Todos los campos son obligatorios!' });

      const updatedProduct = await this.productsService.updateProductService(productId, newProduct)
      return updatedProduct
    } catch (error) {
      next(error)
    }
  };

  deleteProduct = (req, res, next) => {
    try {
      const { productId } = req.params
      const deletedProduct = this.productsService.deleteProduct(productId)
      if (deletedProduct.error) return res.status(404).send(deletedProduct.error);
      return productId;
    } catch (error) {
      next(error)
    }
  };
}

module.exports = ProductsController