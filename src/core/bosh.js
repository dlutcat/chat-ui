/*
 * @title       : bosh.js
 * @description : Bosh manager.
 * @author      : Patto (pat.inside@gmail.com)
 * @date        : 2012-01-10
 *
 * depend:  ui/chat.js, ui/chat/util.js, ui/chat/model.js
 */

(function(FW) {

FW.UI.Chat.Bosh = (function(self) {

    /*
     * connection to ejabbered
     */
    self.connection = null;

    /*
     * init bosh connection
     * settings<dict>: { server, jid, sid, id, username, avatar, url }
     */
    self.init = function(settings) {
        
        // connectiton Object
        self.connection = new Strophe.Connection(settings.server);

        // user
        self.user = settings;

        // attach to existed session created by prebind in backend
        self.connection.attach(settings.jid, settings.sid, settings.rid, function(st) {

            switch(st) {
                case Strophe.Status.CONNECTIONG:
                    break;
                case Strophe.Status.CONNFAIL:
                    break;
                case Strophe.Status.DISCONNECTIONG:
                    break;
                case Strophe.Status.DISCONNECTED:
                    break;
                case Strophe.Status.CONNECTED:
                    break;
                case Strophe.Status.ATTACHED:
                    // message handler
                    self.connection.addHandler(onMessage, null, 'message', null, null, null);
                    // send presence
                    self.connection.send($pres().tree());
                    break;
            } 

        });
    };

    self.send = function(from, to, message) {
        var body = "",
            entry = $msg({ to: to, from: from.jid, type: 'chat' , 
                           username: from.name, uid: from.id, 
                           url: from.url, avatar: from.avatar })
                    .c('body', { xmlns: Strophe.NS.CLIENT }).t(message);

        self.connection.send(entry.tree());
    };

    // handle message
    function onMessage(msg) {

        var actives = FW.UI.Chat.actives,
            to = msg.getAttribute('to'),
            from = msg.getAttribute('from'),
            sid = msg.getAttribute('sid'),
            type = msg.getAttribute('type'),
            username = msg.getAttribute('username'),
            uid = msg.getAttribute('uid'),
            url = msg.getAttribute('url'),
            avatar = msg.getAttribute('avatar'),
            elems = msg.getElementsByTagName('body');

        if (type == "chat" && elems.length > 0) {
            var body = elems[0],
                text = Strophe.getText(body),
                room = actives[FW.UI.Chat.Util.escapeJid(from.split('/')[0])];


            if(room) {
                room.alarm();
            }
            else {
                room = new FW.UI.Chat.Model.Room({ jid: from,
                                                   id: uid,
                                                   url: url, 
                                                   avatar: avatar,  
                                                   name: username });
                room.render();
            }

            room.appendMsg(username, url, avatar, text);

        }

        // Return true if it is to be invoked again; returning false will remove the handler after it returns.
        return true;
    };

    return self;

})(FW.UI.Chat.Bosh || {});

})(FW || {});
