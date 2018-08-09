let express = require('express');
let router = express.Router();
let message = require('../../models/Message');


router.get('/messages', function (req, res) {
    let hs_id = req.query.hsid;
    let my_id = req.session.user.userid;
    message.find({
        message_group:parseInt(hs_id)+my_id
    },function (err, messages) {
        if (!err) {
            res.send(messages);
        }
    });
});

module.exports = router;