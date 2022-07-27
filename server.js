const express = require('express') //creates an express application
const app = express() 
const MongoClient = require('mongodb').MongoClient //Requires that MongoClient library be imported
const PORT = 2121 //Establishes a (local) part on port 2121

require('dotenv').config() //Allows you to bring in hidden environment variables (should be included in .gitignore)



let db, //creates db
    dbConnectionStr = process.env.DB_STRING,  //// Sets the dbConnectionStr equal to address provided by MongoDB
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//Defines how we connect to MongoDB
//useUnifiedTopology helps ensure that things are returned in a clean manner
    .then(client => {
    //responding on the client side and saying...
        console.log(`Connected to ${dbName} Database`)
        //Will produce a message in the console if the client connected property 
        db = client.db(dbName)
        //Defines the db as 'todo'
    })
    
app.set('view engine', 'ejs') //Determine how we're goiing to use a view (template) engine to render ejs (embedded js) commands for our app
app.use(express.static('public')) //Tells our app to use a folder named "public" for all of our static files (js, css, etc)
app.use(express.urlencoded({ extended: true })) //Call to middleware that cleans up how things are displayed and how our server communicates with our client 
app.use(express.json()) //Tells the app to use express's json method to take the object and turn it into a JSON string


app.get('/',async (request, response)=>{
    //GET stuff to display to users on the client side (in this case index.ejs) using the asynchronous function
    const todoItems = await db.collection('todos').find().toArray()
    //Create a constant called 'todoItems' that goes into our db, create a collection called 'todos' find anything in that db and turn it into an array of objects
    const itemsLeft = await db //creates a constant in our todos collection
        .collection('todos') //Looks at documents in the collection
        .countDocuments({completed: false}) //The .countDocuments method counts the number of documents that have completed status equal to 'false'
    
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    //Sends response that renders the number of documents in our collect and the number renders the number of 
    //documents in our collect and the number of items left
    
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {
//     Adds item to our db via route /addTodo
    db.collection('todos') //Server will go into our collection called 'todos'
        .insertOne({thing: request.body.todoItem, completed: false}) //Insert one 'thing' named todoItem with a status of 
                                                                       //'completed' set to 'false'
        .then(result => {
        //Assuming tht everything went okay...
            console.log('Todo Added') //Print 'Todo added' to the console in the repl for VSCode
            response.redirect('/') //Refreshers index.ejs to show that new thing we added to the db on the page
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true //Add status of 'completed' equal to 'true' to item in our collection (true in updated files maybe)
          }
    },{
        sort: {_id: -1}, //Once a thing has been marked as completed, this sorts the array by descending order by id
        upsert: false //Doesn't create a document for the todo if the item isn't found
    })
    .then(result => {
        // Assuming everything went okay and we got a result..
        console.log('Marked Complete') //Console log 'marked complete'
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    //This route unclicks a thing that you've marked as complete
    //will take away complete status
    db.collection('todos')
        .updateOne({thing: request.body.itemFromJS},{  //look for item from itemFromJS
        $set: {
            completed: false //Undoes what we did with markComplete. It changes 'completed' status to 'false'
          }
    },{
        sort: {_id: -1}, //?
        upsert: false 
    })
    .then(result => {
        //Assuming everything went okay and we got a result...
        console.log('Marked Complete') // console log 'marked complete'
        response.json('Marked Complete') //returns response of 'marked complete' to the fetch in main.js
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {
    //DELETE
    db.collection('todos') //goes in to collection 
        .deleteOne({thing: request.body.itemFromJS}) //Uses deleteOne method and find a thing that matches the name of the thing you clicked on
        .then(result => {
        //Assuming everything went okay...
            console.log('Todo Deleted') //console logo 'todo deleted'
            response.json('Todo Deleted') //returns response of 'todo deleted' to the fetch in main.js
        })
        .catch(error => console.error(error)) //if something broke an error is logged to the console

})

app.listen(process.env.PORT || PORT, ()=>{
    //Tells our server to listen for connections on the PORT we defined as a constant earlier OR process.env.PORT will
    //tell the server to listen on the port of the app 
    console.log(`Server running on port ${PORT}`)
    //Console log in the part number of server is running on 
})
