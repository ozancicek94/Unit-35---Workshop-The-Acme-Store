// import the modules 

const {
  client, 
  createTables,
  createUser, 
  createProduct, 
  createFavorite, 
  fetchUsers, 
  fetchProducts, 
  fetchFavorites, 
  deleteFavorite
} = require('./db');

const express = require('express');
const app = express();

// parse the incoming requests from json

app.use(express.json());

// app routes here 

app.get('/api/users', async(req,res,next) => {
  try{
    res.send(await fetchUsers())

  } catch(error) {next(error)}

});

app.get('/api/products', async(req,res,next) => {
  try{
    res.send(await fetchProducts());

  } catch(error) {next(error)}

});

app.get('/api/users/:id/favorites', async(req,res,next) => {
  try{
    res.send(await fetchFavorites(req.params.id));

  } catch(error) {next(error)};

});

app.post('/api/users/:user_id/favorites', async(req,res,next) => {
  try{
    res.status(201).send(await createFavorite({user_id:req.params.user_id, product_id:req.body.product_id}));

  } catch(error) {next(error)}

});

app.delete('/api/users/:user_id/favorites/:id', async(req,res,next) => {
  try{
    await deleteFavorite({id:req.params.id, user_id:req.params.user_id});

    res.sendStatus(204);

  } catch(error) {next(error)}

});

// create the init function

const init = async() => {

  // connect to the database

  await client.connect();
  console.log("Connected to the database");

  // call the createTables() function

  await createTables();

  // seed the tables with sample data 

  const [Ozan, Mari, Simba, Hasan, Serpil, Elif, Luis, Celdy, Gui, Macbook, Ipad, Iphone, Laptop, TV, Panda, Peepad, Airpods] = await Promise.all([
    createUser({username:'Ozan', password:'s3cr3t'}),
    createUser({username:'Mari', password:'s3cr3t'}),
    createUser({username:'Simba', password:'s3cr3t'}),
    createUser({username:'Hasan', password:'s3cr3t'}),
    createUser({username:'Serpil', password:'s3cr3t'}),
    createUser({username:'Elif', password:'s3cr3t'}),
    createUser({username:'Luis', password:'s3cr3t'}),
    createUser({username:'Celdy', password:'s3cr3t'}),
    createUser({username:'Gui', password:'s3cr3t'}),

    createProduct({name:'Macbook'}),
    createProduct({name:'Ipad'}),
    createProduct({name:'Iphone'}),
    createProduct({name:'Laptop'}),
    createProduct({name:'TV'}),
    createProduct({name:'Panda'}),
    createProduct({name:'Peepad'}),
    createProduct({name:'Airpods'}),
  ]);

  const favorites = await Promise.all ([
    createFavorite({user_id:Ozan.id, product_id: Macbook.id}),
    createFavorite({user_id:Ozan.id, product_id: Iphone.id}),
    createFavorite({user_id:Mari.id, product_id: TV.id}),
    createFavorite({user_id:Elif.id, product_id: Airpods.id}),
    createFavorite({user_id:Luis.id, product_id: Ipad.id}),
    createFavorite({user_id:Gui.id, product_id: Laptop.id}),
    createFavorite({user_id:Simba.id, product_id: Panda.id}),
    createFavorite({user_id:Simba.id, product_id: Peepad.id}),
  ])

  // console.log fetchUsers() and fetchProducts()

  console.log(fetchUsers());
  console.log(fetchProducts());


  // create port and listen

  const port = process.env.PORT || 3000;

  app.listen(port, () => {console.log(`listening on port ${port}`)})

};

// call the init function

init();

