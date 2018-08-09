let express = require('express');
let path = require('path');
let mongoose = require('./mongo/mongoose.js');
let bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
let db = mongoose();
let app = new express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
let Message = require('./models/Message');
let Following = require('./models/Following');
let FollowMe = require('./models/FollowMe');
let User = require('./models/User');

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Origin", "*");//配置客户端
    if (req.method == 'OPTIONS') {
        /*让options请求快速返回*/
        res.sendStatus(200);
    }
    else {
        /*防止异步造成多次响应，出现错误*/
        var _send = res.send;
        var sent = false;
        res.send = function (data) {
            if (sent) return;
            _send.bind(res)(data);
            sent = true;
        };
        next();
    }
});

app.use('/public', express.static(path.join(__dirname, 'public')));


let onlineUser= new Map();
io.on('connection', function(socket){


    var query = socket.request._query;

    let user={
        user_id:query.user_id,
        socket_id:socket.id,
    }

    onlineUser.set(parseInt(query.user_id),user);

    /*Message.find({
        to_user_id:parseInt(query.user_id),
        have_read:0
    },function (err, messages) {
        if (!err) {
            // socket.emit('USER_MESSAGE', messages);
            for( let message of messages){
                // console.log(message);
                // console.log(onlineUser.get(parseInt(query.user_id)));
                // socket.send(message);
                socket.emit('USER_MESSAGE', message);
            }
        }
    });
*/

    /*socket.on('attentionOpt',function (obj) {
        let hs_id = obj.hsid;
        let attentioned = obj.attention;
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
                        follow_user_id: parseInt(query.user_id)
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
                        follow_user_id: parseInt(query.user_id)
                    });

                    followMe.save(function (error, doc) {
                        if (!error) {-
                            socket.to(onlineUser.get(parseInt(hs_id)).socket_id).emit('NEW_ATTENTION');
                        }
                    });
                }
            })
        } else {
            Following.deleteOne(
                {
                    follow_user_id: parseInt(query.user_id),
                    user_id: hs_id
                }
            ).then();

            FollowMe.deleteOne(
                {
                    follow_user_id: parseInt(query.user_id),
                    user_id: hs_id
                },
                function (err) {

                }
            ).then();
        }
    });*/

    socket.on('sendMessage',function (msg) {
        let message = new Message({
            from:msg.from,
            isUnread:msg.isUnread,
            source:msg.source,
            time:msg.time,
            to:msg.to,
            type:msg.type,
            group:msg.from+msg.to,
            avatar:msg.avatar
        });
        //socket.to(id).emit('my message', msg);
        message.save((err) => {
            if (!err) {
                if(onlineUser.get(msg.to)){
                    msg.bySelf = false;
                    socket.to(onlineUser.get(msg.to).socket_id).emit('USER_MESSAGE', msg);
                    // socket.to(onlineUser.get(msg.to).socket_id).emit('testMessage', msg);
                }
            } else {
                console.log(err);
            }
        });
    });

    socket.on('disconnect', (reason) => {
        onlineUser.forEach(function (value, key) {
            if(value.socket_id==socket.id){
                onlineUser.delete(key);
            }
        })
    });
});


server.listen(3001, function () {
    console.log("server started")
});