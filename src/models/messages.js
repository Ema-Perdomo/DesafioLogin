import { Schema, model } from 'mongoose';

const messageSchema = new Schema({
    email: {
        type:  String,
        required: true
        //unique: true --> NO porque sino solo se podria mandar 1 mensaje por email
    },
    message: {
        type:  String,
        required: true
    }
})

const messageModel = model("messages", messageSchema);

export default messageModel;