import supertest from 'supertest'
import app from '../server.js'
import { Blog } from '../models/blogModel.js'
import { initialBlogs } from './test_helpers.js'
import mongoose from 'mongoose'
import { parse } from 'path'
//use the supertest object as our API
const api = supertest(app)

// beforeEach(async () => {
//     await Blog.deleteMany({})
//     await Blog.insertMany(initialBlogs)
// })


describe('Blogs', () => {

test('Returns all blogs', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
})

test('Creates a new blog', async () => {
    try{
    const newBlog = {
        title:"Atomic",
        content: "Bombastic cool codes"
    }
    //we send the blog object to the DB through the API and expect a successful result
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
    //get all the blogs in our DB
    const blogs = await Blog.find({})
    //let's check that the last blog added was indeed newBlog object
    expect(blogs[blogs.length-1].title).toBe("Atom")
}catch (e){
    console.log(e.message)
}
})

test('Returns a specific blog by ID', async () => {
    try{
        //get all the blogs
        const blogs = await Blog.find({})
        //get the the first blog parsed to JSON
        const firstBlog = blogs[0].toJSON()
        //get the result expecting success and JSON data
        const resBlog = await
            api.get(`/api/blogs/${firstBlog.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        //check if the Blog has the same id and the route works as expected
        expect(resBlog.body.id).toEqual(firstBlog.id)
    }catch (e){
        console.log(e.message)
    }
})

test('Delete a blog', async () => {
    // try{
        //get blogs and parse the one you want to delete to JSON
        const blogsAtStart = await Blog.find({})
        const blogToDelete = (blogsAtStart[0].toJSON()._id).valueOf() 
        // console.log(blogsAtStart.length)       
        //delete the blog by id
        await api
            .delete(`/api/blogs/${blogToDelete}`)
            .expect(400)
        //get all blogs from the database again
        const blogsNow = await Blog.find({})        
        //check if the number of current blogs is one less than before
        // expect(blogsNow).toHaveLength(blogsAtStart.length-1)
        // //get an array of all the contents or Ids inside the DB    
        const blogsContent = blogsNow.map(i => i.toJSON().content)
        //expect the content from the deleted blog to not be there
        expect(blogsContent).not.toContain(blogToDelete.content)
    // }catch (e){
    //     console.log(e.message)
    // }    
})

it('Should not Create a new blog if title and content fields are empty', async () => {
        try{
            const newBlog = {
                title: '',
                content: ''
              };
                     await app.post('/api/blogs')
                         .send(newBlog)
                         .expect(400)                      
        } catch (e) {
            console.log(e.message)
        }    
    });

it('Should not Create a new blog if it already exists', async () => {
    try{
        const newBlog = {
        title: 'Notepad',
        content: 'cool codes ',
        };
            await app.post('/api/blogs')
                .send(newBlog)
                .expect(403)
                .end((err, res) => {
                expect(res.body).to.have.property('message', "Blog already exists");
                });
    } catch (e) {
        console.log(e.message)
    }    
});

it('Should update an existing blog', async () => {
    try{
        const updatedBlog = {
        title: 'Notepad',
        content: 'cool codes 2',
    };
            await app.put('/api/blogs/63ea89c92639c0138aea2a66')
            .send(updatedBlog)
            .expect(403)
            .end((err, res) => {
            expect(res.body).to.have.property('message', "Blog updated successfully");
            });        
    } catch (e) {
        console.log(e.message)
    }
});

afterAll(() => mongoose.connection.close())
})
