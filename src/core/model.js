/*
 * @title       : model.js
 * @description : Model for objects used in chatting.
 * @author      : Patto (pat.inside@gmail.com)
 * @date        : 2012-01-09
 *
 * depend:  ui/chat.js, ui/chat/util.js, ui/chat/bosh.js
 *
 */

(function(FW) {

FW.UI.Chat.Model = (function(self) {

    /*
     * Room for 1v1 chatting.
     * 
     * @jid: ejabbered id <str>
     * @sid: xmpp connection manager session id <int>
     * @user: object user. < dict: { jid, id, url, avatar, name } >
     * [deleted] @owner: Owner of the room. < dict: { jid, id, url, avatar, name } >
     */
    self.Room = function(user, messages) {

        // xmpp session info
        //this.sid = FW.UI.Chat.Bosh.settings.sid;
        this.user = user;
        //this.owner = owner;
        this.roomKey = FW.UI.Chat.Util.escapeJid(user.jid).split('/')[0];

        this.messages = messages || [];

        // jQuery DOM
        this.$wrapper = null;
        this.$dialog = null;
        this.$body = null;
        this.$bottom = null;
        this.$msg = null;
    };

    /*
     * Room template based mustache.js
     */
    self.Room.prototype.template = {

        pane: '<div id="chat{{roomKey}}"  class="J_chat-room bar_button r" style="cursor: default">{{>body}}{{>bottom}}</div>',
        body: '<div class="J_chat-room-body chat_con">{{>header}}{{>dialog}}{{>controller}}</div>',
        header: [
                    '<div class="J_chat-room-body-header Etitle">',
                        '<a class="J_chat-close Eclose r Emar_top2" href="javascript:;"></a>',
                        '<!-- a class="J_chat-max Ebig r Emar_right" href="javascript:;"></a -->',
                        '<a class="J_chat-min Esmall r Emar_top2 Emar_right" href="javascript:;"></a>',
                        '您于 <a target="_blank" href="{{url}}"><font class="Eblue">{{name}}</font></a> 聊天中',
                    '</div>'
                ].join(''),
        dialog: '<div class="J_chat-room-body-dialog Escroll_y Eheight225">{{#messages}}{{>message}}{{/messages}}</div>',
        message: [
                    '<ul class="Emar20 l Ewidth280">',
                        '<li class="l Emar_right">',
                            '<img src="{{avatar}}" width="30" height="30" alt="{{name}}" class="Eborder"/>',
                        '</li>',
                        '<li>',
                            '<a target="_blank" href="{{ url }}">',
                                '<font class="Eblue">{{name}}</font>',
                            '</a>',
                            '<font class="Egrey"> {{timestamp}}</font>',
                        '</li>',
                        '<li class="Emar_top">{{message}}</li>',
                    '</ul>'
                 ].join(''),
        controller: '<div class="J_chat-room-body-controller chat_sendinfor">{{>toolbar}}{{>input}}</div>',
        toolbar: [
                    '<div class="J_chat-room-body-toolbar Eheight30">',
                        '<span class="Eheight20 r Emar_5">',
                            '<span class="icon_chathistory l"></span>',
                            '<a href="javascript:;">聊天记录</a>',
                        '</span>',
                        '标签图标',
                    '</div>'
                 ].join(''),
        input: [
                '<div class="J_chat-room-body-input">',
                    '<div class="Etextareabor">',
                        '<textarea name="message" cols="" rows="" class="l"></textarea>',
                    '</div>',
                    '<input name="send" type="button" class="Esubmit Epointer r Emar_5" />',
                '</div>'
               ].join(''),
        bottom: [
                    '<div class="J_chat-room-bottom bar_button1 bar_buttonactive">',
                        '<a class="J_chat-close Eclose r" href="javascript:;"></a>',
                        '<span class="icon_chat l"></span>',
                        '<span class="l Emar5 Emar_right">{{name}}</span>',
                    '</div>'
                ].join('')
    };

    /*
     * reference FW.UI.Chat.DOM locally
     */
    self.Room.prototype.DOM = FW.UI.Chat.DOM;

    /*
     * reference FW.UI.Chat.actives locally
     */
    self.Room.prototype.actives = FW.UI.Chat.actives;

    /*
     * Render a room, then append to this bottom bar.
     *
     */
    self.Room.prototype.render = function() {

        var escapedJid = FW.UI.Chat.Util.escapeJid(this.user.jid);

        var html = Mustache.to_html(
            this.template.pane,
            {
                jid: this.user.jid,
                roomKey: this.roomKey,
                name: this.user.name,
                url: this.user.url,
                avatar: this.user.avatar,
                messages: this.messages,
                bottom: { name: this.user.name }
            },
            {
                body: this.template.body,
                bottom: this.template.bottom,
                header: this.template.header,
                dialog: this.template.dialog,
                controller: this.template.controller,
                message: this.template.message,
                toolbar: this.template.toolbar,
                input: this.template.input
            }
        );
        this.DOM.$chatRooms.append(html);

        this.DOM.$bottomBar.show();

        // DOM
        this.$wrapper = this.DOM.$chatRooms.find('#chat' + escapedJid);
        this.$dialog = this.$wrapper.find('.J_chat-room-body-dialog');
        this.$body = this.$wrapper.find('.J_chat-room-body');
        this.$bottom = this.$wrapper.find('.J_chat-room-bottom');
        this.$msg = this.$wrapper.find('textarea[name=message]');

        // push into global actives 
        //this.actives[this.user.jid] = this;
        this.actives[this.roomKey] = this;

    };

    /*
     * minimize the room window
     */
    self.Room.prototype.minimize = function() {
        this.$body.hide();
        this.$bottom.removeClass('bar_buttonactive');
    };

    /*
     * show nomormal size room window
     */
    self.Room.prototype.normsize = function() {

        /*
        var i = 0, l = this.actives.length;

        // minimize all rooms
        for ( ; i < l; i++ ) {
            this.actives[i].minimize();
        }
        */

        this.$body.show();
        this.$bottom.addClass('bar_buttonactive');
        this.$bottom.css({
            backgroundColor: '#f7faff'
        });
        this.$dialog.scrollTop(1000);
    };

    /*
     * toggle room window
     */
    self.Room.prototype.toggle = function() {
        if(this.$body.css('display') === 'none') {
            this.normsize();
        } else {
            this.minimize();
        }
    },

    /*
     * maximize the room window
     *
     * TODO
     */
    self.Room.prototype.maximize = function() {

    };

    /*
     * close
     */
    self.Room.prototype.destroy = function() {

        // remove from bottom bar
        this.$wrapper.remove();

        // delete jid from actives
        //delete this.actives[this.user.jid];
        delete this.actives[this.roomKey];

        // destroy current object
        //delete this;
    };

    /*
     * append messages.
     */
    self.Room.prototype.appendMsg = function(username, url, avatar, message) {

        var html = Mustache.to_html(
            this.template.message,
            {
                name: username,
                url: url,
                avatar: avatar,
                message: message,
                timestamp: FW.UTILS.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
            }
        );

        this.$dialog.append(html).scrollTop(1000);

    };

    /*
     * send message
     *
     * @newline<boolean>: need new line
     */
    self.Room.prototype.sendMsg = function(newline) {
        var owner = FW.UI.Chat.Bosh.user,
            message = this.$msg.val();

        if (newline) {
            this.$msg.val(message + '\n');
            return;
        }

        // Avoid blank message
        if($.trim(message).length === 0) {
            return;
        }

        // send via BOSH
        FW.UI.Chat.Bosh.send(owner, this.user.jid, message);

        this.appendMsg(owner.name, owner.url, owner.avatar, message);
        this.$msg.val('');
    };

    /*
     * alarm when receiving new message
     */
    self.Room.prototype.alarm = function() {

        if(this.$body.css('display') !== 'none') {
            return;
        }

        var $bot = this.$bottom,
            flag = true,
            counter = 0,
            t = setInterval(function() {
                if(counter > 5 && flag) {
                    clearInterval(t);
                }
                $bot.css({
                    backgroundColor: flag ? '#88B9F3' : '#f7faff'
                });
                flag = !flag;
                counter++;
            }, 220);

    };


    return self;

})(FW.UI.Chat.Model || {});

})(FW || {});
