import slugify from 'slugify';
import pool from '../db/conn.js';

export default async function generateUniqueSlug(name) {
    const baseSlug = slugify(name, { lower: true, strict: true, replacement: "-" });
    let slug = baseSlug;
    let counter = 1; // We'll use counter to add numbers if the slug is already taken

    while (true) { // Start an infinite loop.
        const { rows } = await pool.query("SELECT COUNT(*) FROM products WHERE slug = $1", [slug]); // Ask the db “How many products already have this specific slug?”
        const count = parseInt(rows[0].count); // { count: '1' } // note: it's a string
        // 1. Count take the result from the db (it comes as text) and convert it to a number. // { count: 1 }
        // 2. And then now tells us how many products already have this slug.

        if (count === 0) {
            // If no product has this slug (count === 0), it’s safe to use it.
            break; // exit the loop because we found a unique slug.
        }
        // If the slug already exists, create a new version with a number at the end
        slug = `${baseSlug}-${counter}`
        counter++;
    }

    // Give back the final unique slug to whoever called this function.
    return slug; 
    
}