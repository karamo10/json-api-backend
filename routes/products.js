import express from 'express';
import pool from '../db/conn.js';
import generateUniqueSlug from '../utils/generateSlug.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

// Get product by it Id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json('Product not found');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Get a product by it slug
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    const result = await pool.query('SELECT * FROM products WHERE slug = $1', [
      slug,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json('Product not found');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

// add a new product
router.post('/', async (req, res) => {
  try {
    const { name, price, description, instock } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Product name is required' });
    }

    const slug = await generateUniqueSlug(name);

    const priceValue = Number(price);
    if (isNaN(priceValue)) {
      return res
        .status(400)
        .json({ message: 'Product price most be a number' });
    }

    const defaultDescription =
      description?.trim() || 'No description provided yet for this product';

    console.log('Req Body', req.body);

    const newProduct = await pool.query(
      `
      INSERT INTO products (name, slug, price, description, instock)
      VALUES ($1, $2, $3, $4, $5);`,
      [name, slug, priceValue, defaultDescription, instock]
    );
    res.status(201).json({
      message: 'product successfully created!',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Update product
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { name, price, description, instock } = req.body;

    // Checking if product exists
    const productCheck = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );
    if (productCheck.rows.length === 0) {
      return res.status(404).json({ message: 'product not found' });
    }

    let slug = productCheck.rows[0].slug;
    if (name && name !== productCheck.rows[0].name) {
      slug = await generateUniqueSlug(name);
    }

    const updateProduct = await pool.query(
      `UPDATE products SET name = $1, slug = $2, price = $3, description = $4, instock = $5 WHERE id = $6`,
      [
        name || productCheck.rows[0].name,
        slug,
        price ?? productCheck.rows[0].price,
        description || productCheck.rows[0].description,
        instock ?? productCheck.rows[0].instock,
        id,
      ]
    );

    res.json({ message: 'product successfully updated!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// delete product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // checking if product exists
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'product not found' });
    }

    // delete the product
    await pool.query('DELETE FROM products WHERE id = $1', [id]);

    res.json({ message: 'product successfully deleted!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
