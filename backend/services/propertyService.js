const pool = require('../config/db');

async function findAll({ search, status }) {
    let sql = 'SELECT * FROM properties WHERE 1 = 1';
    const params = [];

    if (search) {
        sql += ' AND (title LIKE ? OR location LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
        sql += ' AND status = ?';
        params.push(status);
    }

    sql += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(sql, params);
    return rows;
}

async function findById(id) {
    const [rows] = await pool.query('SELECT * FROM properties WHERE id = ?', [id]);
    return rows[0] || null;
}

async function create(property) {
    const { title, location, propertyType, price, bedrooms, bathrooms, areaSqft, status } = property;

    const [result] = await pool.query(
        `INSERT INTO properties (title, location, property_type, price, bedrooms, bathrooms, area_sqft, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, location, propertyType, price, bedrooms, bathrooms, areaSqft, status || 'available']
    );

    return findById(result.insertId);
}

async function update(id, property) {
    const { title, location, propertyType, price, bedrooms, bathrooms, areaSqft, status } = property;

    await pool.query(
        `UPDATE properties
         SET title = ?, location = ?, property_type = ?, price = ?, bedrooms = ?, bathrooms = ?, area_sqft = ?, status = ?
         WHERE id = ?`,
        [title, location, propertyType, price, bedrooms, bathrooms, areaSqft, status, id]
    );

    return findById(id);
}

async function remove(id) {
    const [result] = await pool.query('DELETE FROM properties WHERE id = ?', [id]);
    return result.affectedRows > 0;
}

module.exports = { findAll, findById, create, update, remove };
