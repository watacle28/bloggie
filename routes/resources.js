const router = require('express').Router()
const Resource = require('../models/Resource')
const Channel = require('../models/Channel')
const Course = require('../models/Course')
const Twitter = require('../models/Twitter')
const {check, validationResult} = require('express-validator')
const canEditOrDel = require('../middleware/canEditOrDEL')
const User = require('../models/User')
const canVote = require('../middleware/canVote')

    const getUsername = async(id)=>{
        const user = await User.findById(id)
        return  user.username
    
        }
//add a Resource

router.post('/resource',    
                [check('name','name is required').not().isEmpty(),
                 check('link','link is required').not().isEmpty(),
            
                ], async(req,res)=>{
                    const errors = validationResult(req)
                    if(!errors.isEmpty()){
                        return res.status(400).json({errors: errors.array().map(error=>error.msg)})
                    }
                    const {name,link, type} = req.body;
                    const addedBy =await getUsername(req.user.user)
                    const newResource = new Resource({
                        name,link,type,addedBy
                    })
                    try {
                        const resource = await newResource.save()
                        return res.json({resource})
                    } catch (error) {
                        console.log({error});
                    }
                })

//edit resource
router.put('/resource/:id',canEditOrDel(Resource),async(req,res)=>{
            const {name,link,type} = req.body;
            //resource to edit
            const resource = res.doc
            link ? resource.link = link : null,
            name ? resource.name = name : null,
            type ? resource.type = type : null

           try {
            await resource.save();
           return res.json({resource})
           } catch (error) {
               console.log({error});
           }
})

//delete resource
router.delete('/resource/:id',canEditOrDel(Resource), async(req,res)=>{
          try {
          const resource = res.doc;
          await resource.remove()
            res.json({msg: 'resource deleted'})

          } catch (error) {
              console.log({error});
          }
})



//add Channel

router.post('/channel', [
            check('name','name of channel required').not().isEmpty(),
            check('link','link to channel required').not().isEmpty(),
            check('platform','must be Ytube or Twitch required').not().isEmpty()
            ], async(req,res)=>{
                const errors = validationResult(req)
                    if(!errors.isEmpty()){
                        return res.status(400).json({errors: errors.array().map(error=>error.msg)})
                    }
                 const {name,link,platform}  = req.body;
                 const addedBy = await getUsername(req.user.user)
                 const newChannel = new Channel({name,link,platform,addedBy})
                 try {
                     const channel = await newChannel.save();
                     return res.json({channel})
                 } catch (error) {
                     console.log({error});
                 }

            })

//edit channel
router.put('/channel/:id',canEditOrDel(Channel) ,async(req,res)=>{
               const {name,link,platform} = req.body;
               const channel = await Channel.findById(req.params.id);
               name ? channel.name = name : null,
               link ? channel.link = link : null,
               platform ? channel.platform = platform : null
                try {
                   const updatedChannel = await channel.save();
                    return res.json({updatedChannel})
                } catch (error) {
                    console.log({error});
                }

            })

//delete channel
router.delete('/channel/:id',canEditOrDel(Channel), async(req,res)=>{
                const channel = res.doc;
             try {
                 await channel.remove()
                 return res.json({msg:'removed'})
             } catch (error) {
                 console.log({error});
             }
            })

//add Course
router.post('/course', [
    check('name','name of course required').not().isEmpty(),
    check('link','link to course required').not().isEmpty(),
   
    ], async(req,res)=>{
        const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({errors: errors.array().map(error=>error.msg)})
            }
         const {name,link,price,duration}  = req.body;

         const addedBy =await getUsername(req.user.user)
         const newCourse = new Course({name,link,addedBy})
         price ? newCourse.price = price : null
         duration ? newCourse.duration = duration : null
         try {
             const course = await newCourse.save();
             return res.json({course})
         } catch (error) {
             console.log({error});
         }

    })

 //edit Course
 router.put('/course/:id',canEditOrDel(Course) ,async(req,res)=>{
    const {name,link,price,duration} = req.body;
    const course = res.doc

    name ? course.name = name : null,
    link ? course.link = link : null,
    price ? course.price = price : null,
    duration ? course.duration = duration : null
     try {
        const updatedCourse = await course.save();
         return res.json({updatedCourse})
     } catch (error) {
         console.log({error});
     }

 })

 //delete Course
 router.delete('/course/:id',canEditOrDel(Course), async(req,res)=>{
            const course = res.doc;
            try {
                await course.remove()
                return res.json({msg: 'removed'})
            } catch (error) {
                console.log({error});
        }
        })

//add Twitter acc to follow
router.post('/twitacc',[check('username','username required').not().isEmpty()],async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array().map(error=>error.msg)})
    }
    const {username} = req.body;
    const addedBy = await getUsername(req.user.user)

    const newTwiAcc = new Twitter({username,addedBy})
    try {
        const twitacc = await newTwiAcc.save()
        return res.json({twitacc})
    } catch (error) {
        console.log({error});
    }
})

//edit Twitter acc
router.put('/twitacc/:id',canEditOrDel(Twitter), async(req,res)=>{
        const {username} = req.body;
        const twitter = res.doc;
        username ? twitter.username = username : null
        try {
            const updatedAcc = await twitter.save();
            return res.json({updatedAcc})
        } catch (error) {
            console.log({error});
        }
})

//delete twitter acc
router.delete('/twitacc/:id',canEditOrDel(Twitter), async(req,res)=>{
        const twitter = res.doc;
        try {
            await twitter.remove()
            return res.json({msg: 'removed'})
        } catch (error) {
            console.log({error});
    }
})
//upvote handler
const upVoteHandler = async(req,res)=>{
    try {
      const response =  await res.doc.save();
        return res.json({response})
   
        
    } catch (error) {
        return res.json({erorr})
    }
}
//vote
router.post('/twitacc/upvote/:id', canVote(Twitter),upVoteHandler )
router.post('/course/upvote/:id', canVote(Course),upVoteHandler )
router.post('/resource/upvote/:id', canVote(Resource),upVoteHandler )
router.post('/channel/upvote/:id', canVote(Channel),upVoteHandler )

router.post('/course/upvote/:id')
module.exports = router;