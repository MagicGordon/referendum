(this.webpackJsonpreferendum=this.webpackJsonpreferendum||[]).push([[0],{109:function(t,e){},111:function(t,e){},145:function(t,e,n){"use strict";n.r(e);var a=n(0),i=n.n(a),r=n(67),l=n.n(r),c=(n(77),n(1)),s=n.n(c),u=n(10),o=n(68),h=n(69),d=n(13),g=n(71),p=n(70),f=(n(79),n(20)),m=n(25),v=n.n(m),_=v()(10).pow(12),b=v()(200).mul(_),w="dev-1630146349634-18193940589410",y=function(t){Object(g.a)(n,t);var e=Object(p.a)(n);function n(t){var a;return Object(o.a)(this,n),(a=e.call(this,t)).state={connected:!1,signedIn:!1,accountId:null,digitals:[],all_digitals:[],own_digital:"",target_digital:"",levelup_target:""},a._digitalRefreshTimer=null,a.handleLevelUpTargetChange=a.handleLevelUpTargetChange.bind(Object(d.a)(a)),a.levelupSubmit=a.levelupSubmit.bind(Object(d.a)(a)),a.handleOwnChange=a.handleOwnChange.bind(Object(d.a)(a)),a.handleTargetChange=a.handleTargetChange.bind(Object(d.a)(a)),a.handleSubmit=a.handleSubmit.bind(Object(d.a)(a)),a._initNear().then((function(){a.setState({connected:!0,signedIn:!!a._accountId,accountId:a._accountId})})),a}return Object(h.a)(n,[{key:"componentDidMount",value:function(){}},{key:"query_digitals",value:function(){var t=Object(u.a)(s.a.mark((function t(){var e,n;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this._contract.get_digitals({accountId:this._accountId});case 2:return e=t.sent,t.next=5,this._contract.get_all_digitals({accountId:this._accountId});case 5:n=t.sent,this.setState({digitals:e,all_digitals:n});case 7:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"refreshAccountStats",value:function(){var t=Object(u.a)(s.a.mark((function t(){var e,n;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this._contract.get_digitals({accountId:this._accountId});case 2:return e=t.sent,t.next=5,this._contract.get_all_digitals({accountId:this._accountId});case 5:n=t.sent,this._digitalRefreshTimer&&(clearInterval(this._digitalRefreshTimer),this._digitalRefreshTimer=null),this.setState({digitals:e,all_digitals:n});case 8:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"_initNear",value:function(){var t=Object(u.a)(s.a.mark((function t(){var e,n,a;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e={networkId:"default",nodeUrl:"https://rpc.testnet.near.org",contractName:w,walletUrl:"https://wallet.testnet.near.org"},n=new f.keyStores.BrowserLocalStorageKeyStore,t.next=4,f.connect(Object.assign({deps:{keyStore:n}},e));case 4:if(a=t.sent,this._keyStore=n,this._nearConfig=e,this._near=a,this._walletConnection=new f.WalletConnection(a,w),this._accountId=this._walletConnection.getAccountId(),this._account=this._walletConnection.account(),this._contract=new f.Contract(this._account,w,{viewMethods:["get_digitals","next_digital","get_all_digitals"],changeMethods:["add_first","pk","levelup"]}),!this._accountId){t.next=15;break}return t.next=15,this.refreshAccountStats();case 15:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"requestSignIn",value:function(){var t=Object(u.a)(s.a.mark((function t(){return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return"Digital War",t.next=3,this._walletConnection.requestSignIn(w,"Digital War");case 3:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"logOut",value:function(){var t=Object(u.a)(s.a.mark((function t(){return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:this._walletConnection.signOut(),this._accountId=null,this.setState({signedIn:!!this._accountId,accountId:this._accountId});case 3:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"addFirst",value:function(){var t=Object(u.a)(s.a.mark((function t(){var e;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this._contract.add_first();case 2:e=t.sent,alert(e),window.location.reload();case 5:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"pk_action",value:function(){var t=Object(u.a)(s.a.mark((function t(){var e;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this._contract.pk({own_digital:parseInt(this.state.own_digital,10),target_digital:parseInt(this.state.target_digital,10)});case 2:e=t.sent,alert(e),window.location.reload();case 5:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"handleOwnChange",value:function(t){this.setState({own_digital:t.target.value})}},{key:"handleTargetChange",value:function(t){this.setState({target_digital:t.target.value})}},{key:"handleSubmit",value:function(t){this.pk_action(),t.preventDefault()}},{key:"action_levelup",value:function(){var t=Object(u.a)(s.a.mark((function t(){var e;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this._contract.levelup({digital:parseInt(this.state.levelup_target,10)},b.toFixed(0),v()(1e10).mul(_).toFixed(0));case 2:e=t.sent,alert(e),window.location.reload();case 5:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"handleLevelUpTargetChange",value:function(t){this.setState({levelup_target:t.target.value})}},{key:"levelupSubmit",value:function(t){this.action_levelup(),t.preventDefault()}},{key:"render",value:function(){var t=this,e=this.state.connected?this.state.signedIn?i.a.createElement("div",null,i.a.createElement("div",{className:"float-right"},i.a.createElement("button",{className:"btn btn-outline-secondary",onClick:function(){return t.logOut()}},"Log out")),i.a.createElement("h4",null,"Hello, ",i.a.createElement("span",{className:"font-weight-bold"},this.state.accountId),"!"),i.a.createElement("form",{onSubmit:this.levelupSubmit},i.a.createElement("label",null," digital: ",i.a.createElement("input",{type:"text",style:{marginLeft:"74px"},value:this.state.levelup_target,onChange:function(e){t.handleLevelUpTargetChange(e)}})," "),i.a.createElement("br",null),i.a.createElement("input",{type:"submit",value:"levelup"})),i.a.createElement("hr",null),i.a.createElement("form",{onSubmit:this.handleSubmit},i.a.createElement("label",null," challenger: ",i.a.createElement("input",{type:"text",style:{marginLeft:"44px"},value:this.state.own_digital,onChange:function(e){t.handleOwnChange(e)}})," "),i.a.createElement("br",null),i.a.createElement("label",null," challenge target: ",i.a.createElement("input",{type:"text",value:this.state.target_digital,onChange:function(e){t.handleTargetChange(e)}})," "),i.a.createElement("br",null),i.a.createElement("input",{type:"submit",value:"challenge"})),i.a.createElement("hr",null),i.a.createElement("div",null,"Your digitals:",i.a.createElement("ul",null,0!==this.state.digitals.length?this.state.digitals.map((function(t){return i.a.createElement("li",{key:t}," ",t)})):i.a.createElement("button",{className:"btn btn-primary",onClick:function(){return t.addFirst()}},"Get first digital"))),i.a.createElement("hr",null),i.a.createElement("div",null,"Digital Pool:",i.a.createElement("ul",null,0!==this.state.all_digitals.length?this.state.all_digitals.map((function(t){return i.a.createElement("li",{style:{whiteSpace:"pre"},key:t.digital}," Digital\uff1a",t.digital,"       Owner\uff1a",t.owner,"       Level\uff1a",t.level)})):i.a.createElement("div",null,"\u6682\u65e0")))):i.a.createElement("div",{style:{marginBottom:"10px"}},i.a.createElement("button",{className:"btn btn-primary",onClick:function(){return t.requestSignIn()}},"Log in with NEAR Wallet")):i.a.createElement("div",null,"Connecting... ",i.a.createElement("span",{className:"spinner-grow spinner-grow-sm",role:"status","aria-hidden":"true"}));return i.a.createElement("div",{className:"px-5"},i.a.createElement("h1",null,"Referendum"),e)}}]),n}(i.a.Component);l.a.render(i.a.createElement(y,null),document.getElementById("root"))},72:function(t,e,n){t.exports=n(145)},77:function(t,e,n){},79:function(t,e,n){},85:function(t,e){},95:function(t,e){}},[[72,1,2]]]);
//# sourceMappingURL=main.ba6101d3.chunk.js.map