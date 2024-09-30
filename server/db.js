// import the packages

const pg = require('pg');
const express = require('express');
const app = express();
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_store_db');
const {v4: uuid} = require('uuid');
const bcrypt = require('bcrypt');
const { deleteUserSkill } = require('../../AcmeTalentAgency/server/db');

// create tables for users, products, and favorites

const createTables = async() => {

  let SQL = `
  DROP TABLE IF EXISTS favorites;
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS products;

  CREATE TABLE users(
  id UUID PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
  );

  CREATE TABLE products(
  id UUID PRIMARY KEY,
  name VARCHAR(50) NOT NULL
  );

  CREATE TABLE favorites(
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  CONSTRAINT unique_favorite UNIQUE (product_id, user_id)
  );
  `;

  await client.query(SQL);

}

//create methods createUser, createProduct, and createFavorite

const createUser = async({username, password}) => {

  const SQL = `
  INSERT INTO users (id, username, password) VALUES ($1, $2, $3) RETURNING *
  `;

  const response = await client.query(SQL, [uuid(), username, await bcrypt.hash(password, 5)]);

  return response.rows[0];

};

const createProduct = async({name}) => {

  const SQL = `
  INSERT INTO products (id, name) VALUES ($1, $2) RETURNING *
  `;

  const response = await client.query(SQL, [uuid(), name]);

  return response.rows[0];

};

const createFavorite = async({user_id, product_id}) => {

  const SQL = `
  INSERT INTO favorites (id, user_id, product_id) VALUES ($1, $2, $3) RETURNING *
  `;

  const response = await client.query(SQL, [uuid(), user_id, product_id]);

  return response.rows[0];

};



// create methods fetchUsers, fetchProducts, and fetchFavorites 

const fetchUsers = async() => {

  const SQL = `
  SELECT * FROM users
  `;

  const response = await client.query(SQL);

  return response.rows;

};

const fetchProducts = async() => {

  const SQL = `
  SELECT * FROM products
  `;

  const response = await client.query(SQL);

  return response.rows;

};

const fetchFavorites = async(id) => {

  const SQL = `
  SELECT * FROM favorites
  WHERE user_id = $1
  `;

  const response = await client.query(SQL, [id]);

  return response.rows;

};

// create method destroyFavorite 

const deleteFavorite = async({id, user_id}) => {

  const SQL = `
  DELETE FROM favorites 
  WHERE id=$1 AND user_id=$2
  `;

  await client.query(SQL, [id, user_id])

}

// export the modules

module.exports = {
  client, 
  createTables,
  createUser, 
  createProduct, 
  createFavorite, 
  fetchUsers, 
  fetchProducts, 
  fetchFavorites, 
  deleteFavorite
}