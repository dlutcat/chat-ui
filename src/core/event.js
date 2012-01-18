/*
 * @title       : event.js
 * @description : Bind dom events.
 * @author      : Patto (pat.inside@gmail.com)
 * @date        : 2012-01-10
 *
 * depend:  ui/chat.js, ui/chat/util.js
 *
 */

(function(FW) {

FW.UI.Chat.Event = (function(self) {

    self.init = function() {
    
        var DOM = FW.UI.Chat.DOM,
            actives = FW.UI.Chat.actives;

        DOM.$chatRooms
           .delegate('.J_chat-min', 'click', function() {
                var room = actives[$(this).closest('.J_chat-room').attr('id').replace('chat', '')];
                room.minimize();
           })
           .delegate('.J_chat-close', 'click', function() {
                var room = actives[$(this).closest('.J_chat-room').attr('id').replace('chat', '')];
                if(confirm('确定关闭该聊天窗口吗？')) {
                    room.destroy();
                }
           })
           .delegate('.J_chat-room-bottom', 'click', function() {
                var room = actives[$(this).closest('.J_chat-room').attr('id').replace('chat', '')];
                room.toggle();

           })
           .delegate('input[name=send]', 'click', function() {
                var room = actives[$(this).closest('.J_chat-room').attr('id').replace('chat', '')];
                room.sendMsg();
           });

        // bind keyboard
        DOM.$chatRooms.find('textarea[name=message]').live('keydown', function(e) {
            var room = actives[$(this).closest('.J_chat-room').attr('id').replace('chat', '')];

            // Ctrl+Enter: new line
            if ( e.ctrlKey && e.keyCode === 13 ) {
                e.preventDefault();
                room.sendMsg(true);
            }
            // Enter: submit
            else if ( !e.ctrlKey && e.keyCode === 13 ) {
                e.preventDefault();
                room.sendMsg();
            }
        });

        // Chat button
        $('body').delegate('.J_online_chat', 'click', function() {

            if( $.browser.msie && /^(6|7)\..*/.test($.browser.version) ) {
                window.scrollTo(0, window.document.body.clientHeight);
            }

            var $this = $(this),
                uid = $this.attr('data-id');

            FW.UI.Chat.create(
                { jid: FW.UI.Chat.Util.convert2Jid(uid, 'fuwo.com'),
                  id: uid,
                  url: $this.attr('data-url'),
                  avatar: $this.attr('data-avatar'),
                  name: $this.attr('data-name') },
                []
            );
        });

    };

    return self;

})(FW.UI.Chat.Event || {});

})(FW || {});
