/*
 * @title       : utils.js
 * @description : utils for chat.
 * @author      : Patto (pat.inside@gmail.com)
 * @date        : 2012-01-10
 *
 * depend:  ui/chat.js
 */

(function(FW) {

FW.UI.Chat.Util = (function(self) {

    /*
     * Convert uid to jid
     * @uid: app user id
     * @domain: app.com
     * 
     * return: Jid  12345@app.com
     */
    self.convert2Jid = function(uid, domain) {
        return uid + '@' + domain;
    };

    /*
     * Convert jid to uid
     * @jid: foo@app.com
     * 
     * return: uid  foo
     */
    self.convert2Uid = function(jid) {
        return jid.split('@')[0];
    };

    /*
     * Escape (@|.) jid. 
     * @jid foo@app.com
     */
    self.escapeJid = function(jid) {
        return jid.replace(/@/g, '-').replace(/\./g, '_');
    };

    /*
     * Unescape (%|~) jid. 
     * @jid foo@app.com
     */
    self.unescapeJid = function(jid) {
        return jid.replace(/-/g, '@').replace(/_/g, '.');
    }


    return self;

})(FW.UI.Chat.Util || {});

})(FW || {});
