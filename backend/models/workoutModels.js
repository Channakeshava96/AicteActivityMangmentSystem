const mongoose=require('mongoose')

const Schema=mongoose.Schema
const workoutModel=new Schema({
    title:{
        type:String,
        required:true
    },
    points:{
        type:Number,
        required:true
    },
    load:{
        type:Number,
        required:true
    }
},{timestamps:true})

module.exports=mongoose.model('Workout',workoutModel)