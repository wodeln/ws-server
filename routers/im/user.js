let express = require('express');
let router = express.Router();
let count = require('../../util/Counter');
let tokenUtil = require('../../util/token');
let User = require('../../models/User');
let Following = require('../../models/Following');
let FollowMe = require('../../models/FollowMe');


router.get('/', function (req, res) {
    res.send('user index');
});

router.get('/addUser', function (req, res) {
    let seqPromis = count.getNextSequence("userid");
    seqPromis.then(
        (result) => {
            let user = new User({
                user_nickname: "隔壁男神",
                user_mobile: '15021464553',
                user_email: '',
                user_password: '12344',
                user_avatar: '/public/images/upload/xgg2.jpg',
                user_age: 40,
                user_sex: '男',
                user_province: '四川',
                user_city: '成都',
                user_stata_message: '我吃火锅，你吃火锅底料！',
                user_id: result.seq
            });
            user.save((err) => { //添加
                if (!err) {
                    res.send("添加成功");
                } else {
                    console(err);
                }
            });
        },
        (err) => {
            reject(err);
        }
    )
});

router.get('/users', function (req, res) {
    User.find(function (err, users) {
        if (!err) {
            res.send(users);
        }
    });
});

router.get('/user', function (req, res) {
    let hs_id = req.query.hsid;
    User.aggregate([
        {
            $lookup:
                {
                    from: "followings",
                    pipeline: [
                        {
                            $match:
                                {
                                    user_id: parseInt(hs_id),
                                    follow_user_id: req.session.user.userid
                                }
                        }
                    ],
                    as: "following"
                }
        },
        {
            $lookup:
                {
                    from: "follow_mes",
                    pipeline: [
                        {
                            $match:
                                {
                                    user_id: req.session.user.userid,
                                    follow_user_id: parseInt(hs_id)
                                }
                        }
                    ],
                    as: "follow_me"
                }
        },
        {
            $match: {
                user_id: parseInt(hs_id)
            }
        }
    ],function (err,doc) {
        let attentioned = doc[0].following.length>0 ? true : false;
        let attentionMe = doc[0].follow_me.length>0 ? true : false;

        delete doc[0].following;
        delete doc[0].follow_me;
        doc[0].attentionMe=attentionMe;
        doc[0].attentioned=attentioned;

        res.send(doc[0]);
    });
});

router.post('/attentionOpt', function (req, res) {
    let hs_id = req.body.hsid;
    let attentioned = req.body.attention;
    if (attentioned) {
        User.findOne({user_id: hs_id}, function (err, user) {
            if (!err) {
                let followings = new Following({
                    user_nickname: user.user_nickname,
                    user_mobile: user.user_mobile,
                    user_email: user.user_email,
                    user_password: user.user_password,
                    user_avatar: user.user_avatar,
                    user_age: user.user_age,
                    user_sex: user.user_sex,
                    user_province: user.user_province,
                    user_city: user.user_city,
                    user_id: user.user_id,
                    user_stata_message: user.user_stata_message,
                    is_online: user.is_online,
                    follow_user_id: req.session.user.userid
                });

                followings.save(function (error, doc) {
                    if (!error) {
                    }
                });


                let followMe = new FollowMe({
                    user_nickname: user.user_nickname,
                    user_mobile: user.user_mobile,
                    user_email: user.user_email,
                    user_password: user.user_password,
                    user_avatar: user.user_avatar,
                    user_age: user.user_age,
                    user_sex: user.user_sex,
                    user_province: user.user_province,
                    user_city: user.user_city,
                    user_id: user.user_id,
                    user_stata_message: user.user_stata_message,
                    is_online: user.is_online,
                    follow_user_id: req.session.user.userid
                });

                followMe.save(function (error, doc) {
                    if (!error) {-
                        res.send("关注成功");
                    }
                });
            }
        })
    } else {
        Following.deleteOne(
            {
                follow_user_id: req.session.user.userid,
                user_id: hs_id
            }
        ).then();

        FollowMe.deleteOne(
            {
                follow_user_id: req.session.user.userid,
                user_id: hs_id
            },
            function (err) {

            }
        ).then();
        res.send("取关成功");
    }
});


router.post('/doLogin', function (req, res) {
    User.findOne({
        $or: [{
            user_mobile: req.body.user_name,
            user_password: req.body.password
        }, {
            user_email: req.body.user_name,
            user_password: req.body.password
        }]
    })
        .exec()
        .then(
            (doc) => {
                if (doc) {
                    let sid = req.session.id;
                    let sessionUser = {
                        "username": doc.user_email == "" ? doc.user_mobile : doc.user_email,
                        "userid": doc.user_id
                    }
                    let payloadObj = {
                        "iss": "bolean",
                        "sid": sid,
                        "sessionUser": sessionUser
                    }

                    let token = tokenUtil.createToken(payloadObj, '10000');
                    req.session.user = sessionUser;
                    let result = {
                        user_info: {
                            user_name: doc.user_email == "" ? doc.user_mobile : doc.user_email,
                            user_age: doc.user_age,
                            user_id: doc.user_id,
                            user_avatar: doc.user_avatar,
                            user_stata_message: doc.user_stata_message,
                            user_nickname: doc.user_nickname
                        },
                        token: token
                    }
                    if (token) res.send(result);
                } else {
                    res.send("用户名密码错误");
                }

            },
            (err) => {
                console.log(err);
            }
        );
});

module.exports = router;