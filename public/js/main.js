const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable and assigning it to a selection of all elements with a class .fa-trash
const item = document.querySelectorAll('.item span') //creating a variable and assigning it to a selection of span tags inside of a parent that has a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable and assigning it to a selection of spans with a class of 
                                                                        //"completed" inside of a parent with a class of "item"


Array.from(deleteBtn).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) //add an event listener to the current item that waits for a click
                                                   //and then calls a function called deleteItem
}) //closes the loop

Array.from(item).forEach((element)=>{ //creating an array and starting a loop
    element.addEventListener('click', markComplete) //add an event listener to the current item that waits for a click and then calls a function called markComplete
}) //closes the loop

Array.from(itemCompleted).forEach((element)=>{ //creating an array and starting a loop 
    element.addEventListener('click', markUnComplete) //add an event listener to the current item that waits for a click and then calls a function called markUnComplete
}) //closes the loop

async function deleteItem(){ //declaring an asynchronous function because it will allow us to change the flow of execution (can have it so it waits for other tasks to be completed, 
                            // wait for other responses to arrive)
    
    const itemText = this.parentNode.childNodes[1].innerText //selecting some text (innerText - text inside of an element) 
                                                             //looks inside of the list item and grabs only the inner tet within the list span
    
    try{ //starting a try block
        
        //fetch gets data from somehwere
        const response = await fetch('deleteItem', { //creates a response variable that waits on a fetch to get data from the result of deleteItem route
            method: 'delete', //setting the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected which is JSON
            body: JSON.stringify({ //(body - declares the message content being passed, and stringify that content) 
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) //closing the body
          }) //closing the object
        
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //Log the data to the console
        location.reload() //Refreshes the page to update whats being displayed

    }catch(err){ //if an error occurs pass the error into the catch block 
        console.log(err) //Log the error into the console
    } //closes the catch block
} //ends the function

async function markComplete(){ //declare an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ //starting a try block to do something
        const response = await fetch('markComplete', { //creates a response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put', //setting the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected which is JSON
            body: JSON.stringify({ //(body - declares the message content being passed, and stringify that content)
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) //closes out the body
          }) //closes out the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //Log the data to the console
        location.reload() //Refreshes the page to update what is being displayed

    }catch(err){ //catch block created for if there is an error in the application
        console.log(err) //logs that error detected to the console
    } //closes the catch block
}// closes the function

async function markUnComplete(){ //declares an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ //creates a try block
        const response = await fetch('markUnComplete', { //waiting on JSON from the response to be converted
            method: 'put', //setting the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected which is JSON
            body: JSON.stringify({ //(body - declares the message content being passed, and stringify that content)
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) //closes the body tag
          }) //closes the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //Logs the data to the console
        location.reload() //Refreshers the page to display updated data

    }catch(err){ //catch block that is created in the event an error occurs in the application
        console.log(err) // Logs the console to the data
    } //closes the catch block
} //closes the function
