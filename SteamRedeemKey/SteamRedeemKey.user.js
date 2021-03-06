// ==UserScript==
// @name        SteamRedeemKey
// @namespace   https://github.com/lzghzr/GreasemonkeyJS
// @version     0.0.5
// @author      lzghzr
// @description 划Key激活
// @supportURL  https://github.com/lzghzr/GreasemonkeyJS/issues
// @match       *://*/*
// @license     MIT
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-end
// ==/UserScript==
/// <reference path="SteamRedeemKey.d.ts" />
/**
 * ASF划Key激活
 *
 * @class SteamRedeemKey
 */
var SteamRedeemKey = (function () {
    function SteamRedeemKey() {
        this._D = document;
        this._W = unsafeWindow || window;
    }
    /**
     * 处理数据以及加载图标
     *
     * @memberof SteamRedeemKey
     */
    SteamRedeemKey.prototype.Start = function () {
        if (GM_getValue('server') == null)
            GM_setValue('server', 'http://127.0.0.1:1242');
        if (location.href.match(/^https:\/\/steamcn\.com\/.*289320/)) {
            var elmDivShowhid = this._D.querySelector('.showhide > p > a');
            this._W['test'] = this._Options.bind(this);
            elmDivShowhid.setAttribute('onclick', 'test()');
        }
        this._AddUI();
        this._D.addEventListener('mouseup', this._ShowUI.bind(this));
    };
    /**
     * 显示图标, 由于冒泡机制, 使用setTimeout 0
     *
     * @private
     * @param {MouseEvent} event
     * @memberof SteamRedeemKey
     */
    SteamRedeemKey.prototype._ShowUI = function (event) {
        var _this = this;
        setTimeout(function () {
            var selection = _this._W.getSelection(), str = selection.toString();
            if (str.length < 17)
                _this._elmDivSRKButton.style.cssText = 'display: none;';
            else {
                var inputKeys = [], elmInputKeys = selection.getRangeAt(0).cloneContents().querySelectorAll('input');
                for (var i = 0; i < elmInputKeys.length; i++)
                    inputKeys.push(elmInputKeys[i].value);
                str = str + inputKeys.join(',');
                var keys = str.match(/[A-Za-z0-9]{5}-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}/g);
                if (keys !== null) {
                    var redeemKey_1 = [];
                    keys.forEach(function (key) {
                        if (redeemKey_1.indexOf(key) === -1)
                            redeemKey_1.push(key);
                    });
                    _this._redeemKey = redeemKey_1.join(',');
                    _this._top = _this._D.body.scrollTop + event.clientY - 30;
                    _this._left = _this._D.body.scrollLeft + event.clientX;
                    _this._elmDivSRKButton.style.cssText = "\ndisplay: block;\nleft: " + _this._left + "px;\ntop: " + _this._top + "px;";
                }
                else
                    _this._elmDivSRKButton.style.cssText = 'display: none;';
            }
        }, 0);
    };
    /**
     * 把图标添加到body
     *
     * @private
     * @memberof SteamRedeemKey
     */
    SteamRedeemKey.prototype._AddUI = function () {
        this._AddCSS();
        this._elmDivSRK = this._D.createElement('div');
        this._elmDivSRKButton = this._D.createElement('div');
        this._elmDivSRKButton.classList.add('SRK_button');
        this._elmDivSRK.appendChild(this._elmDivSRKButton);
        this._D.body.appendChild(this._elmDivSRK);
        this._elmDivSRKButton.addEventListener('click', this._ClickButton.bind(this));
    };
    /**
     * 图标点击事件处理
     *
     * @private
     * @memberof SteamRedeemKey
     */
    SteamRedeemKey.prototype._ClickButton = function () {
        var _this = this;
        var elmDivRedeem = this._D.createElement('div');
        elmDivRedeem.classList.add('SRK_redeem');
        elmDivRedeem.style.cssText = "\nleft: " + this._left + "px;\ntop: " + this._top + "px;";
        this._elmDivSRK.appendChild(elmDivRedeem);
        GM_xmlhttpRequest({
            method: 'GET',
            url: GM_getValue('server') + "/IPC?command=redeem%20" + this._redeemKey,
            onload: function (res) {
                if (res.status === 200) {
                    var elmSpanRedeem = _this._D.createElement('span');
                    elmSpanRedeem.innerHTML = res.responseText;
                    var resText = elmSpanRedeem.innerText;
                    elmSpanRedeem.innerHTML = resText.slice(1).replace(/\n/g, '<br />');
                    elmDivRedeem.appendChild(elmSpanRedeem);
                    elmDivRedeem.classList.add('SRK_redeem_green');
                }
            }
        });
    };
    /**
     * 加载设置界面
     *
     * @private
     * @memberof SteamRedeemKey
     */
    SteamRedeemKey.prototype._Options = function () {
        var elmDivOptions = this._D.querySelector('.showhide'), elmInputServer = this._D.createElement('input');
        elmInputServer.type = 'text';
        elmInputServer.value = GM_getValue('server');
        elmInputServer.addEventListener('input', function () {
            if (elmInputServer.value === '')
                elmInputServer.value = 'http://127.0.0.1:1242';
            GM_setValue('server', elmInputServer.value);
        });
        elmDivOptions.innerText = '服务器地址: ';
        elmDivOptions.appendChild(elmInputServer);
        GM_xmlhttpRequest({
            method: 'GET',
            url: GM_getValue('server') + "/IPC?command=api",
            onload: function (res) {
                if (res.status === 200) {
                    var Bots = JSON.parse(res.responseText), bots = [];
                    for (var bot in Bots.Bots) {
                        bots.push(bot);
                    }
                    console.log(bots);
                }
            }
        });
    };
    /**
     * 插入CSS规则
     *
     * @private
     * @memberof SteamRedeemKey
     */
    SteamRedeemKey.prototype._AddCSS = function () {
        var cssText = "\n.SRK_button {\n  background: no-repeat url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAFRklEQVR4XoXVCWwUVRzH8e+bmZ3dtvTulp4IiLZqBSQoIArKoSIKclQKyNUECInBeCXUCh5F41HFBA8EQSEcFZTbizMoqNAIJQE1CmI4WqhaaKHHzs6bvxuzoUlj6Sf5JflPkvd/8/Lyf8rO6E8rwVQ6Eg9DCZaS7igZC9yh4BYgGwCoFjgOHELUJi3qRCRoMSIxAYMoLP5fjggLw6KmglK0BYnATcB44A1gNVAKnCbqWg2KtKgVoGLogOcJAIahHgMKQWYBq9ptoOAJLcY7XIMyLUKXG6HhPCAAgAFJGX5/XMxKpb3OAm8SpezMOwFAKARZz7VYPpyzZ8AfYOKUMdvHPzJ8t4iois++vu+z1ZsfQGvsnGxw3ceANdEGdwMEgVoQ2qMsi9DZs6RkZTQe2L1ySn5e97015y4MVqYpGRlp+6qO/jJy4NBpK5rq6/3+jExEe1lAjQUmwBI6EG5oQdl+78C3FU/nd88+ff+YuXv8SmtBKcMOuFsqymfu31dR0qdgxNvhxjBWwF4GPKQCWUO7AqfoQEv1KQpnzqhav/T5uaMnz1sRTEms/2hxyauAKpox/0VlWWrdshfmPDjpuaVfrfs8P5CVC9DNMg1rmgjtU2BYJtDEvf1vrQ6H3eGNTY69ZU3JquhVpeLjsmVDH3nymZATHjatcNjxr9Z9mm8oC2C25boy0O+3EREQ2sIwFfW1dRgJN8rYhwedbgk5Wa7GBHIBBQiQrDWmoVSS47jJYEcKC2CQFbri3BY6/zdGMEhiQhzieUjr5nEjNU0XWf7pu5Wdg8ktgJWdma5HTZw/cfniZ3Z7nsfk2a/d37Pghgafz3JWbtjTGzMRw/IBXMfOfUf2FRW/8ldczmgXbhcShkvSDY9Kal6RJPQoFOglo6aV/SUiayPZHskWxwlvnTrnjfMjx5VceHh8ae3cee+dFZGPd31XVYl5l8R1HScpkTUiuaxEZCuQ9cefNbJ6/d70im0Hgr9U/hqD64LPole/W5ord71zxGcZDhALAIQAB0gAPKBu+87K3LFTygpQiuT0FLTnAVxRIrID6A+cBMLak5i1G79N+anq90DfXj2ak1MTnJFD+jQAvtYphge4Pxz+PX7jtgNxVSfOxe/65lCMERsgmJmKdlyiqpWILAeKgXNEjz0aDzDL39+cvG3/8dglZTMu3nR9lgMAqGdfXZNYvmhDPFdaIC2BpIxUbNvC0x6tOKhmLfhkweghvV96cHCvy4BHKxWtdfmKrxN2/PizuWPpU/UnT9eak57+oNOhXYeN2B7ZxHeKRWtNO95S5Ey8mbjA8X5985gwoq+ePmqAJMfH0oae+cpae8LwPl5R6SfmP7+dIZjfBUQQoX0ieSr9oRdwtP7yUk3dCBqaSM/L4cSGUi5caiSpU4C0xDgWbfiOuvom7undjWGTXic1PxflCR3YCzLE8vw2FswK9sg944lQ++sZXly1hyfGDGDxxu9xIgtfUVBWfB8z3tyI0TkNw/YjdECkGEClTS4HAGUUK6WWh13NpfMXeXLyYIb27Co15/6Rgpu7GIs2/cj6LypJ65YB2qNdSgEyB5EloFBp0xdzlWXONyzz5XDY5WJ1HalZKeSkJ8qxUxeUvtxCek4q4gnSdv/REsMAz1uI48xHBNR/Dd6N3hcPbB8EArMw1IeI0BwK47iaGNvC77MQkWtMRAUij9Pc8h7NzVf/xoLWIYcIwFKx7f2YZlkglrGB6HevneOI2orWpSoUOoZIB4++CHjyM7Y5DssqwDQmgeoPdAVSAAXUAadADqK9Clz3KOEwiNDWv8cbRuR4oLfxAAAAAElFTkSuQmCC\");\n  border-radius: 50%;\n  box-shadow: 0px 0px 10px 0px #171a21;\n  cursor: pointer;\n  display: none;\n  height: 24px;\n  position: absolute;\n  width: 24px;\n  z-index: 999;\n}\n.SRK_redeem {\n  background: #57CBDE;\n  border-radius: 50%;\n  height: 24px;\n  position: absolute;\n  width: 24px;\n  z-index: 999;\n}\n.SRK_redeem_green {\n  background: #90BA3C;\n}\n.SRK_redeem > span {\n  background: #FFF;\n  color: #000;\n  display:none;\n  font-size: 15px;\n  margin: 12px 12px;\n  position: absolute;\n  white-space: nowrap;\n  z-index: 999;\n}\n.SRK_redeem:hover > span {\n  display: block;\n}";
        var elmStyle = this._D.createElement('style');
        elmStyle.innerHTML = cssText;
        this._D.body.appendChild(elmStyle);
    };
    return SteamRedeemKey;
}());
var redeem = new SteamRedeemKey();
redeem.Start();
