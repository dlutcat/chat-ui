/*
 * @title       : bgiframe.js
 * @description : Chat js.
 * @author      : Patto (pat.inside@gmail.com)
 * @date        : 2012-01-16
 *
 * depend: jQuery, fuwo.js, func.js
 *         ui/chat/util
 *
 */

(function($, FW, undef) {

    FW.UI.Chat = {

        // 缓存dom的jQuery节点
        DOM: {},

        // 缓存对话框: { jid: <Room Object>, jid2: <Room Object2> }
        actives: {},

        // 缓存dom的jQuery节点
        cacheDom: function(DOM) {
            // bottom bar
            DOM.$bottomBar = $('#bottom_bar');
            // 聊天人列表wrapper
            DOM.$roster = $('#J_chat-roster');
            // 聊天人列表底部bar
            DOM.$rosterBottom = $('#J_chat-roster-bottom', DOM.$roster);
            // 聊天人列表窗体
            DOM.$rosterBody = $('#J_chat-roster-body', DOM.$roster);
            // 对话框
            DOM.$chatRooms = $('#J_chat-rooms');
        },

        // 打开新聊天
        create: function(user) {
            var room = this.actives[FW.UI.Chat.Util.escapeJid(user.jid)];

            if (room) {
                room.alarm();
            } else {
                (new this.Model.Room(user)).render();
            }
        },

        // 初始化
        init: function(prebindUrl, httpbindServer) {

            // check user login
            var user = FW.FUNC.getUserInfo();

            if(!user) {
                return;
            }

            this.prebind(prebindUrl, function(jid, sid, rid) {

                var Chat = FW.UI.Chat;

                Chat.cacheDom(FW.UI.Chat.DOM);
                Chat.Bosh.init({
                    server:     httpbindServer,
                    jid:        jid,
                    sid:        sid,
                    rid:        rid,
                    id:         user.user_id,
                    url:        user.url,
                    avatar:     user.avatar,
                    name:       user.user_name
                });
                Chat.Event.init();
            });
        }, 

        // prebind
        prebind: function(prebindUrl, callback) {
            var sid = $.cookie('chat_sid'),
                jid = $.cookie('chat_jid'),
                rid = $.cookie('chat_rid');

            $.ajax({
                url: prebindUrl,
                type: 'GET',
                cache: false,
                success: function(resp) {
                    if(resp.code === '10000') {
                        callback(resp.data.jid, resp.data.sid, resp.data.rid);
                    }
                }
            });
        }

    };

})(jQuery, FW || {});
