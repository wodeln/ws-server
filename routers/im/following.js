let express = require('express');
let router = express.Router();
let Following = require('../../models/Following');

router.get('/getFollowing',function (req,res) {
    let userId = req.session.user.userid;
    Following.find(
        {'follow_user':userId},
    ).exec().then(
        (docs) => {
            if (docs) {
                res.send(docs);
            }else {
                res.send('');
            }
        },
        (err) => {
            console.log(err);
        }
    );
})

module.exports = router;