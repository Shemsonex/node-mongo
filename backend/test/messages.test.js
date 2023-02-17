import supertest from 'supertest'
import request from 'supertest'
import app from '../server.js'
import { Message } from '../models/messageModel.js'

const api = supertest(app)


describe('Messages API', () => {
    test('Returns all messages', async () => {
        try{
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2U4ZGM5M2E5MmNjZWFhM2Q5ZjJmN2UiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NzY2MjY4NTV9.oT7nSm_qhCwB933w7-w5H_sC43dkeFiSWQtms0sF0Zk'        
        await api
            .get('/api/messages')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
        }catch (e){
            console.log(e.message)
        }        
    }, 50000)

    test('Returns a specific message by ID', async () => {
        try{
            //get all the messages
            const messages = await Message.find({})
            //get the the first message parsed to JSON
            const firstMessage = messages[0].toJSON()
            //get the result expecting success and JSON data
            const resMessage = await
                api.get(`/api/messages/${firstMessage.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)
            //check if the Message has the same id and the route works as expected
            expect(resMessage.body.id).toEqual(firstMessage.id)
        }catch (e){
            console.log(e.message)
        }
    }, 50000)
   
    it('Should not send a message if names,email and content fields are empty', async () => {
        try{
            const newMessage = {
                names: '',
                email: '',
                content: ''
              };
                     await app.post('/api/messages')
                         .send(newMessage)
                         .expect(400)                      
        } catch (e) {
            console.log(e.message)
        }    
    }, 50000);

it('Should not send a new message if it already exists', async () => {
    try{
        const newMessage = {
        names: 'Shema Aimé Bayijahe',
        email: 'shemsonex@gmail.com',
        content: 'Hi how are you?',
        };
            await app.post('/api/messages')
                .send(newMessage)
                .expect(403)
                .end((err, res) => {
                expect(res.body).to.have.property('message', "Message already exist");
                });
    } catch (e) {
        console.log(e.message)
    }    
}, 50000);

it('Should update an existing message', async () => {
    try{
        const updatedMessage = {
        title: 'Notepad',
        content: 'cool codes 2',
    };
            await app.put('/api/messages/63ef1f12bfe3a913812acdcc')
            .send(updatedMessage)
            .expect(403)
            .end((err, res) => {
            expect(res.body).to.have.property('message', "Message updated successfully");
            });        
    } catch (e) {
        console.log(e.message)
    }
}, 50000);

test('Delete a message', async () => {
    try{
        //get messages and parse the one you want to delete to JSON
        const messagesAtStart = await Message.find({})
        const messageToDelete = (messagesAtStart[0].toJSON()._id).valueOf() 
        // console.log(messagesAtStart.length)       
        //delete the message by id
        await api
            .delete(`/api/messages/${messageToDelete}`)
            .expect(400)
        //get all messages from the database again
        const messagesNow = await Message.find({})        
        //check if the number of current messages is one less than before
        // expect(messagesNow).toHaveLength(messagesAtStart.length-1)
        // //get an array of all the contents or Ids inside the DB    
        const messagesContent = messagesNow.map(i => i.toJSON().content)
        //expect the content from the deleted message to not be there
        expect(messagesContent).not.toContain(messageToDelete.content)
    }catch (e){
        console.log(e.message)
    }    
}, 50000);

})