/**
 * @swagger
 * components:
 *   schemas:
 *     send:
 *       type: object
 *       required:
 *         - names
 *         - email
 *         - message
 *       properties:
 *         names:
 *           type: string
 *           description: The name of client
 *         email:
 *           type: string
 *           description: The email of client
 *         content:
 *           type: string
 *           description: Message or query
 *       example:
 *         names: Shema Aimé Bayijahe
 *         email: shemsonex@mail.com
 *         content: Hi how are you?
 *     sent:
 *       type: object
 *       required:
 *         - code
 *       properties:
 *         code:
 *           type: integer
 *           description: The http code of response
 *         content:
 *           type: string
 *           description: The message of response
 *         MessageSent:
 *           type: string
 *           description: The message which was sent
 *       example:
 *         code: 201
 *         message: Message Sent
 *         MessageSent: {}
 * 
 *     getMessages:
 *        type: object
 *        properties:
 *          code:
 *            type: integer
 *            description: The http code of response
 *          message:
 *            type: string
 *            description: The response message
 *        example:
 *          code: 200
 *          message: Messages found
 *          Messages: {}
 *     getMessage:
 *        type: object
 *        properties:
 *          code:
 *            type: integer
 *            description: The http code of response
 *          message:
 *            type: string
 *            description: The response message
 *        example:
 *          {
 *            "message": "Hi, How are you?"
 *          }
 *     Messagenotfound:
 *        type: object
 *        properties:
 *          code:
 *            type: integer
 *            description: The http code of response
 *          message:
 *            type: string
 *            description: The response message
 *        example:
 *          error: Message doesn't exist
 *     updateMessage:
 *        type: object
 *        properties:
 *          code:
 *            type: integer
 *            description: The http code of response
 *          message:
 *            type: string
 *            description: The response message
 *     updatedMessage:
 *       type: object
 *       required:
 *          -content
 *       properties: 
 *         content:
 *           type: string
 *           description: The message body
 *       example:
 *         content: Hello dear!
 */
/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Messages api
 * /api/messages:
 *   post:
 *     summary: Send a message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/send'
 *     responses:
 *       200:
 *         description: Message Sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/sent' 
 *   get:
 *      summary: Gets all messages
 *      tags: [Messages]
 *      responses:
 *        200:
 *          description: Messages Fetched
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/getMessages'
 * /api/messages/{id}:
 *   get:
 *      summary: Gets a message by Id
 *      parameters :
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description : object id of message
 *      tags: [Messages]
 *      responses:
 *        200:
 *          description: Message Found
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/getMessage'
 *   put:
 *      summary: Update a message
 *      parameters :
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description : object id of message
 *      tags: [Messages]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *             schema:
 *               $ref: '#/components/schemas/updatedMessage'
 *      responses:
 *        200:
 *          description: Message Found
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/updateMessage'
 *        404:
 *          description: Message not found
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Messagenotfound'
 *   delete:
 *     summary: Delete Message
 *     security:
 *       - bearerAuth: []
 *     parameters :
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description : object id of the message to be deleted 
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: Message deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/response'
 *       404:
 *         description: Message to delete Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errormessage'
 */

import express from "express"
const router = express.Router();
import {authenticate, authenticateUser }from '../middleware/authenticate.js'
import {
  getMessages,
  getMessage,
  setMessage,
  updateMessage,
  deleteMessage,
  deleteMessages,
} from "../controllers/messageController.js"

// router.route("/").get(authenticate, getMessages).post(setMessage).delete(authenticate,deleteMessages);
// router.route("/:id").put(authenticate, updateMessage).delete(authenticate, deleteMessage).get(authenticate, getMessage);
router.route("/").get(getMessages).post(setMessage).delete(authenticate,deleteMessages);
router.route("/:id").put(updateMessage).delete(deleteMessage).get(getMessage);

export default router
