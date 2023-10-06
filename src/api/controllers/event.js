const  mongoose = require('mongoose')
const {Event, User} = require('../models')
const { BadRequestError } = require('../errors')

const createEvent = async (req,res,next) => {
    try {
        const {event_id, event_name, event_description} = req.body
        const event = new Event({
            event_id,
            event_name,
            event_description
        })
        await event.save()
        res.status(200).send({event})
    } catch (error) {
        next(error)        
    }
}

const getEvents = async (req,res,next) => {
    try {
        const events = await Event.find()
        res.status(200).send({events})
    } catch (error) {
        next(error)
    }
}

const enrollEvent = async (req,res,next) => {
    try {
        const {id} = req.body
        if(!id){
            throw new BadRequestError('provide an event id')
        }
        const e_id = new mongoose.Types.ObjectId(req.body.id)

        const event = await Event.findOne({_id : e_id})
        const user = await User.findOne({email : req.auth.email})

        if(!event || !user){
            throw new BadRequestError('entry not present')
        }

        const findId = user.events.find((id) => {
            return e_id.equals(id)
        })

        if(findId){
            res.status(200).send({msg : 'You have already enrolled here'})
        }
        else{
            event.total_enrolls = event.total_enrolls + 1;
            user.events.push(e_id)
            await event.save()
            await user.save()
            res.status(200).send({msg : 'Thanks for enrolling', event, user})
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {createEvent, getEvents, enrollEvent}