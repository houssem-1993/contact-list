const express = require("express");
const assert = require('assert')
const {MongoClient,ObjectID} = require('mongodb')


const app = express()
app.use(express.json())


const mongoURI = "mongodb+srv://houssem:ltdm100fm@cluster0-95ddg.mongodb.net/test?retryWrites=true&w=majority";
const dataBase = "Contact-List";

MongoClient.connect(mongoURI,{ useUnifiedTopology: true },(err,client) => {
    assert.equal(err,null, 'connexion to database failed')

    const db = client.db(dataBase)
    app.post('/add_contact',(req,res) => {
        let newContact = req.body;
        db.collection('contacts').insertOne(newContact, (err,data) => {
            if (err) console.log('cannot add the contact')
            else res.send(data);
        })
    })

    app.get('/contacts',(req,res) => {
        db.collection('contacts').find().toArray((err,data) => {
            if (err) console.log('cannot get the contact')
            else res.send(data)
        })
    })
    app.delete('/delete-contact/:id',(req,res) => {
        let contact = req.params.id
        db.collection('contacts').findOneAndDelete({_id: ObjectID(contact)},(err,data) => {
            if (err) console.log('cannot delete the contact')
            else res.send('contact deleted')
        })
    
    })
    app.put('/edit-contact/:id',(req,res) => {
        let contact = req.params.id;
        db.collection('contacts').findOneAndUpdate(
        { _id: ObjectID(contact) },
        { $set: req.body },
        (err,data) => {
            if (err) console.log('cannot edit the contact')
            else res.send(data);
        })
    })
})


const port = process.env.PORT || 5000
app.listen(port,(err) => {
    if (err) console.log("cannot connect")
    else console.log(`server is running on port ${port}...`);
});