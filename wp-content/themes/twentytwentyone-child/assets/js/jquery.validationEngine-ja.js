;/*****************************************************************
 * Japanese language file for jquery.validationEngine.js (ver2.0)
 *
 * Transrator: tomotomo ( Tomoyuki SUGITA )
 * http://tomotomoSnippet.blogspot.com/
 * Licenced under the MIT Licence
 *******************************************************************/
(function($){
    $.fn.validationEngineLanguage = function(){
    };
    $.validationEngineLanguage = {
        newLang: function(){
            $.validationEngineLanguage.allRules = {
                "required": { // Add your regex rules here, you can take telephone as an example
                    "regex": "none",
                    "alertText": "* 必須項目です",
                    "alertTextCheckboxMultiple": "* 選択してください",
                    "alertTextCheckboxe": "* チェックボックスをチェックしてください"
                },
                "requiredSelect": {//追加20150804 セレクトボックスの空欄
                    "regex": /^[^0]/,
                    "alertText": "* 必須項目です"
                },
                "requiredInFunction": {
                    "func": function(field, rules, i, options){
                        return (field.val() == "test") ? true : false;
                    },
                    "alertText": "* Field must equal test"
                },
                "minSize": {
                    "regex": "none",
                    "alertText": "* ",
                    "alertText2": "文字以上にしてください"
                },
                "groupRequired": {
                    "regex": "none",
                    "alertText": "* いずれか１つ以上入力してください"
                },
                "maxSize": {
                    "regex": "none",
                    "alertText": "* ",
                    "alertText2": "文字以下にしてください"
                },
                "min": {
                    "regex": "none",
                    "alertText": "* ",
                    "alertText2": " 以上の数値にしてください"
                },
                "max": {
                    "regex": "none",
                    "alertText": "* ",
                    "alertText2": " 以下の数値にしてください"
                },
                "past": {
                    "regex": "none",
                    "alertText": "* ",
                    "alertText2": " より過去の日付にしてください"
                },
                "future": {
                    "regex": "none",
                    "alertText": "* ",
                    "alertText2": " より最近の日付にしてください"
                },
                "maxCheckbox": {
                    "regex": "none",
                    "alertText": "* チェックしすぎです"
                },
                "minCheckbox": {
                    "regex": "none",
                    "alertText": "* ",
                    "alertText2": "つ以上チェックしてください"
                },
                "equals": {
                    "regex": "none",
                    "alertText": "* 入力された値が一致しません"
                },
                "creditCard": {
                    "regex": "none",
                    "alertText": "* 無効なクレジットカード番号"
                },
                "phone1":{//変更20150721 ハイフンがつかない場合
                    "regex": /^[0-9０-９]{10,11}$/,
                    "alertText": "* 電話番号が正しくありません"
                },
                "phone2":{//変更20150721 ハイフンがつく場合
                    "regex": /^([0-9０-９]{2}[-－―ー]?[0-9０-９]{4}[-－―ー]?[0-9０-９]{4}$)|^([0-9０-９]{3}[-－―ー]?[0-9０-９]{3,4}[-－―ー]?[0-9０-９]{4}$)|^([0-9０-９]{4}[-－―ー]?[0-9０-９]{2}[-－―ー]?[0-9０-９]{4}$)|^([0-9０-９]{4}[-－―ー]?[0-9０-９]{3}[-－―ー]?[0-9０-９]{3}$)|^([0-9０-９]{5}[-－―ー]?[0-9０-９]{1}[-－―ー]?[0-9０-９]{4}$)/,
                    "alertText": "* 電話番号が正しくありません"
                },
                "phone3":{//変更20150721 ハイフンがつく場合  ←下層オリジナルで使われている可能性があるため残す(2018/04/24)
                    "regex": /^[0-9０-９-－―ー]{12,13}$/,
                    "alertText": "* 電話番号が正しくありません"
                },
                "phone4":{// 20200418 phone1 + phone2の合成版
                    "regex": /^(([0-9０-９]{2}[-－―ー]?[0-9０-９]{4}[-－―ー]?[0-9０-９]{4})|([0-9０-９]{3}[-－―ー]?[0-9０-９]{3,4}[-－―ー]?[0-9０-９]{4})|([0-9０-９]{4}[-－―ー]?[0-9０-９]{2}[-－―ー]?[0-9０-９]{4})|([0-9０-９]{4}[-－―ー]?[0-9０-９]{3}[-－―ー]?[0-9０-９]{3})|([0-9０-９]{5}[-－―ー]?[0-9０-９]{1}[-－―ー]?[0-9０-９]{4}|[0-9０-９]{10,11}))$/,
                    "alertText": "* 電話番号が正しくありません"
                },
                "fax":{// FAXのアラート phone1 + phone2の合成版
                    "regex": /^(([0-9０-９]{2}[-－―ー]?[0-9０-９]{4}[-－―ー]?[0-9０-９]{4})|([0-9０-９]{3}[-－―ー]?[0-9０-９]{3,4}[-－―ー]?[0-9０-９]{4})|([0-9０-９]{4}[-－―ー]?[0-9０-９]{2}[-－―ー]?[0-9０-９]{4})|([0-9０-９]{4}[-－―ー]?[0-9０-９]{3}[-－―ー]?[0-9０-９]{3})|([0-9０-９]{5}[-－―ー]?[0-9０-９]{1}[-－―ー]?[0-9０-９]{4}|[0-9０-９]{10,11}))$/,
                    "alertText": "* FAX番号が正しくありません"
                },
                "mobile":{// 携帯番号のアラート phone1 + phone2の合成版
                    "regex": /^(([0-9０-９]{2}[-－―ー]?[0-9０-９]{4}[-－―ー]?[0-9０-９]{4})|([0-9０-９]{3}[-－―ー]?[0-9０-９]{3,4}[-－―ー]?[0-9０-９]{4})|([0-9０-９]{4}[-－―ー]?[0-9０-９]{2}[-－―ー]?[0-9０-９]{4})|([0-9０-９]{4}[-－―ー]?[0-9０-９]{3}[-－―ー]?[0-9０-９]{3})|([0-9０-９]{5}[-－―ー]?[0-9０-９]{1}[-－―ー]?[0-9０-９]{4}|[0-9０-９]{10,11}))$/,
                    "alertText": "* 携帯番号が正しくありません"
                },
                "email": {
                    // Shamelessly lifted from Scott Gonzalez via the Bassistance Validation plugin http://projects.scottsplayground.com/email_address_validation/
                    "regex": /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
                    "alertText": "* メールアドレスが正しくありません"
                },
                "email2": {//変更20150721
                    // Shamelessly lifted from Scott Gonzalez via the Bassistance Validation plugin http://projects.scottsplayground.com/email_address_validation/
                    "regex": /( (ac)|(ad)|(ae)|(aero)|(af)|(ag)|(ai)|(al)|(am)|(an)|(ao)|(aq)|(ar)|(arpa)|(as)|(asia)|(at)|(au)|(aw)|(ax)|(az)|(ba)|(bb)|(bd)|(be)|(bf)|(bg)|(bh)|(bi)|(biz)|(bj)|(bm)|(bn)|(bo)|(br)|(bs)|(bt)|(bv)|(bw)|(by)|(bz)|(ca)|(cat)|(cc)|(cd)|(cf)|(cg)|(ch)|(ci)|(ck)|(cl)|(cm)|(cn)|(co)|(com)|(coop)|(cr)|(cu)|(cv)|(cx)|(cy)|(cz)|(de)|(dj)|(dk)|(dm)|(do)|(dz)|(ec)|(edu)|(ee)|(eg)|(er)|(es)|(et)|(eu)|(fi)|(fj)|(fk)|(fm)|(fo)|(fr)|(ga)|(gb)|(gd)|(ge)|(gf)|(gg)|(gh)|(gi)|(gl)|(gm)|(gn)|(gov)|(gp)|(gq)|(gr)|(gs)|(gt)|(gu)|(gw)|(gy)|(hk)|(hm)|(hn)|(hr)|(ht)|(hu)|(id)|(ie)|(il)|(im)|(in)|(info)|(int)|(io)|(iq)|(ir)|(is)|(it)|(je)|(jm)|(jo)|(jobs)|(jp)|(ke)|(kg)|(kh)|(ki)|(km)|(kn)|(kp)|(kr)|(kw)|(ky)|(kz)|(la)|(lb)|(lc)|(li)|(life)|(lk)|(lr)|(ls)|(lt)|(lu)|(lv)|(ly)|(ma)|(mc)|(md)|(me)|(mg)|(mh)|(mil)|(mk)|(ml)|(mm)|(mn)|(mo)|(mobi)|(mp)|(mq)|(mr)|(ms)|(mt)|(mu)|(museum)|(mv)|(mw)|(mx)|(my)|(mz)|(na)|(name)|(nc)|(ne)|(net)|(nf)|(ng)|(ni)|(nl)|(no)|(np)|(nr)|(nu)|(nz)|(om)|(org)|(pa)|(pe)|(pf)|(pg)|(ph)|(pk)|(pl)|(pm)|(pn)|(pr)|(pro)|(ps)|(pt)|(pw)|(py)|(qa)|(re)|(ro)|(rs)|(ru)|(rw)|(sa)|(sb)|(sc)|(sd)|(se)|(sg)|(sh)|(si)|(sj)|(sk)|(sl)|(sm)|(sn)|(so)|(sr)|(st)|(su)|(sv)|(sy)|(sz)|(tc)|(td)|(tel)|(tf)|(tg)|(th)|(tj)|(tk)|(tl)|(tm)|(tn)|(to)|(tp)|(tr)|(travel)|(tt)|(tv)|(tw)|(tz)|(ua)|(ug)|(uk)|(um)|(us)|(uy)|(uz)|(va)|(vc)|(ve)|(vg)|(vi)|(vn)|(vu)|(wf)|(ws)|(ye)|(yt)|(yu)|(za)|(zm)|(zw) )$/,
                    "alertText": "* メールアドレスのドメインが正しくありません"
                },
                "integer": {
                    "regex": /^[\-\+]?\d+$/,
                    "alertText": "* 整数を半角で入力してください"
                },
                "number": {
                    // Number, including positive, negative, and floating decimal. credit: orefalo
                    "regex": /^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))+([\.]([0-9]+))?$/,
                    "alertText": "* 数値を半角で入力してください"
                },
                "date": {
                    "regex": /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/,
                    "alertText": "* 日付は半角で YYYY-MM-DD の形式で入力してください"
                },
                "ipv4": {
                    "regex": /^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/,
                    "alertText": "* IPアドレスが正しくありません"
                },
                "url": {
                    "regex": /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
                    "alertText": "* URLが正しくありません"
                },
                "onlyNumberSp": {
                    "regex": /^[0-9\ ]+$/,
                    "alertText": "* 半角数字で入力してください"
                },
                "onlyLetterSp": {
                    "regex": /^[a-zA-Z\ \']+$/,
                    "alertText": "* 半角アルファベットで入力してください"
                },
                "onlyLetterNumber": {
                    "regex": /^[0-9a-zA-Z]+$/,
                    "alertText": "* 半角英数で入力してください"
                },
                // --- CUSTOM RULES -- Those are specific to the demos, they can be removed or changed to your likings
                "ajaxUserCall": {
                    "url": "ajaxValidateFieldUser",
                    // you may want to pass extra data on the ajax call
                    "extraData": "name=eric",
                    "alertText": "* This user is already taken",
                    "alertTextLoad": "* Validating, please wait"
                },
                "ajaxNameCall": {
                    // remote json service location
                    "url": "ajaxValidateFieldName",
                    // error
                    "alertText": "* This name is already taken",
                    // if you provide an "alertTextOk", it will show as a green prompt when the field validates
                    "alertTextOk": "* This name is available",
                    // speaks by itself
                    "alertTextLoad": "* Validating, please wait"
                },
                "validate2fields": {
                    "alertText": "* 『HELLO』と入力してください"
                },
                "zipCode":{//追加20150721
                    "regex": /^[0-9０-９]{3}[-－―ー]?[0-9０-９]{4}$/,
                    "alertText": "* 郵便番号が正しくありません"
                },
                "float":{//追加20150721
                    "regex": /^[0-9]+\.?[0-9]*$/,
                    "alertText": "* 数値を半角で入力してください"
                },
                "kana": {
                    "regex": /^[ァ-ヶ|ー|　]+$/,
                    "alertText": "* 全角カタカナで入力してください"
                },
                "price": {
                    "regex": /^[0-9]+,?[0-9]*$/,
                    "alertText": "* 半角数字を入力してください"
                },
                "sevenInteger": {
                    "regex": /^[0-9]{0,7}(\.[0-9]+)?$/,
                    "alertText": "* 整数部分は7桁以下で入力してください"
                },
                "twoDecimal": {
                    "regex": /^[0-9]+\.?[0-9]{0,2}$/,
                    "alertText": "* 小数部分は2桁以下で入力してください"
                }
            };

        }
    };
    $.validationEngineLanguage.newLang();
})(jQuery);


