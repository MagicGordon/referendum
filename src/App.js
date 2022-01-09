import "./App.css";
import React from 'react';
// import BN from 'bn.js';
import * as nearAPI from 'near-api-js'
import Big from 'big.js';

const TGas = Big(10).pow(12);
const BoatOfGas = Big(200).mul(TGas);

const {
utils: {
  format: { 
    formatNearAmount, parseNearAmount
  }
}
} = nearAPI;

const ReferendumContractName = 'dev-1641691100358-88696607570579';
const XrefContractName = 'dev-1641291247531-69951278398392';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      connected: false,
      signedIn: false,
      accountId: null,
      digitals: [],
      all_digitals: [],
      own_digital: "",
      target_digital: "",
      levelup_target:"",
      xref_balance: 0,
      near_balance: 0,

      lock_amount: 0,
      lock_session: 0,
      mint_amount: 0,

      referend_meta: null,

      query_proposal_id: 0,
      proposal_info: null,

      redeem_proposal_id:0,

      remove_proposal_id: 0,

      action_proposal_id: 0,
      action: '',
      memo: '',
      //proposal
      description: '',
      policy_type: '',
      session_id: 0,
      start_offset_sec:'',
      lasts_sec: 60,


      latest_block_time: 0,

    };

    this._digitalRefreshTimer = null;


    this.handleMintAmountChange = this.handleMintAmountChange.bind(this);
    this.mintSubmit = this.mintSubmit.bind(this);

    this.handleLockAmountChange = this.handleLockAmountChange.bind(this);
    this.handleLockSessionChange = this.handleLockSessionChange.bind(this);
    this.lockSubmit = this.lockSubmit.bind(this);
 
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handlePolicyTypeChange = this.handlePolicyTypeChange.bind(this);
    this.handleSessionIdChange = this.handleSessionIdChange.bind(this);
    this.handleStartChange = this.handleStartChange.bind(this);
    this.handleLastsChange = this.handleLastsChange.bind(this);
    this.addProposalSubmit = this.addProposalSubmit.bind(this);


    this.handleQueryProposalChange = this.handleQueryProposalChange.bind(this);
    this.queryProposalSubmit = this.queryProposalSubmit.bind(this);

    this.handleRedeemChange = this.handleRedeemChange.bind(this);
    this.redeemSubmit = this.redeemSubmit.bind(this);

    this.handleRemoveChange = this.handleRemoveChange.bind(this);
    this.removeSubmit = this.removeSubmit.bind(this);


    this.handleActionIdChange = this.handleActionIdChange.bind(this);
    this.handleActionChange = this.handleActionChange.bind(this);
    this.handleMemoChange = this.handleMemoChange.bind(this);
    this.actionSubmit = this.actionSubmit.bind(this);

    this._initNear().then(() => {
      this.setState({
        connected: true,
        signedIn: !!this._accountId,
        accountId: this._accountId,
      });
    });
  }

  componentDidMount() {
  }


  async query_digitals() {
    // let digitals = await this._contract.get_digitals({ accountId: this._accountId })
    // let all_digitals = await this._contract.get_all_digitals({ accountId: this._accountId })
    
    let blockchain_status = await this._near.connection.provider.status();
    let now = new Date(blockchain_status.sync_info.latest_block_time)
    this.setState({
      latest_block_time: parseInt(now.getTime() / 1000)
    })
  }

  async refreshAccountStats() {
    // let digitals = await this._contract.get_digitals({ accountId: this._accountId });
    // let all_digitals = await this._contract.get_all_digitals({ accountId: this._accountId })
    // if (this._digitalRefreshTimer) {
    //   clearInterval(this._digitalRefreshTimer);
    //   this._digitalRefreshTimer = null;
    // }

    // const near_account = await this._near.account(this._accountId);
    let near_balance = await this._account.getAccountBalance();
    console.log(formatNearAmount(near_balance.available))

    let blockchain_status = await this._near.connection.provider.status();
    console.log(blockchain_status.sync_info.latest_block_time)

    let now = new Date(blockchain_status.sync_info.latest_block_time);
    let seconds = parseInt(now.getTime() / 1000);
    console.log(seconds)
    let referend_meta = null;
    try{
      referend_meta = await this._referendumContract.contract_metadata();
      console.log(referend_meta)
    }catch(e){
      await this._referendumContract.modify_genesis_timestamp({ genesis_timestamp_in_sec: seconds + 30 });
      window.location.reload()
    }

    let xref_balance = await this._xref_contract.ft_balance_of({ account_id: this._accountId });

    this.setState({
      // digitals: digitals,
      // all_digitals: all_digitals,
      referend_meta: referend_meta,
      near_balance: near_balance.available,
      xref_balance: xref_balance,
    });

    this._digitalRefreshTimer = setInterval(() => {
      this.query_digitals();
    }, 5000);
  }

  async _initNear() {
    const nearConfig = {
      networkId: 'testnet',
      nodeUrl: 'https://rpc.testnet.near.org',
      // contractName: ContractName,
      walletUrl: 'https://wallet.testnet.near.org',
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    };
    const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
    const near = await nearAPI.connect(Object.assign({ deps: { keyStore } }, nearConfig));
    this._keyStore = keyStore;
    this._nearConfig = nearConfig;
    this._near = near;

    this._walletConnection = new nearAPI.WalletConnection(near, XrefContractName);
    this._accountId = this._walletConnection.getAccountId();

    this._account = this._walletConnection.account();
    if (this._accountId) {
      this._referendumContract = new nearAPI.Contract(this._account, ReferendumContractName, {
        viewMethods: ['contract_metadata', 'get_proposal_info', 'get_proposals_in_session', 'get_proposal_ids_in_session', 'get_account_info', 'get_account_proposals_in_session', 'storage_balance_of'],
        changeMethods: ['add_proposal', 'remove_proposal', 'redeem_near_in_expired_proposal', 'act_proposal', 'modify_genesis_timestamp', 'storage_deposit'],
      });
  
      this._xref_contract = new nearAPI.Contract(this._account, XrefContractName, {
        viewMethods: ['ft_balance_of', 'storage_minimum_balance', 'storage_balance_of'],
        changeMethods: ['storage_deposit', 'mint', 'ft_transfer_call', 'ft_transfer'],
      });

      let xref_storage_balance_of_referendum = await this._xref_contract.storage_balance_of({ account_id: ReferendumContractName });
      if (xref_storage_balance_of_referendum == null) {
        await this._xref_contract.storage_deposit({ account_id: ReferendumContractName }, "200000000000000", parseNearAmount('0.01'))
      }

      let referendum_storage_balance_of = await this._referendumContract.storage_balance_of({ account_id: this._accountId });
      if (referendum_storage_balance_of == null) {
        await this._referendumContract.storage_deposit({ account_id: this._accountId }, "200000000000000", parseNearAmount('0.01'))
      }
      console.log('referendum_storage_balance_of', formatNearAmount(referendum_storage_balance_of.total))
      let xref_storage_balance_of = await this._xref_contract.storage_balance_of({ account_id: this._accountId });
      if (xref_storage_balance_of == null) {
        await this._xref_contract.storage_deposit({ account_id: this._accountId }, "200000000000000", parseNearAmount('0.01'))
      }
      await this.refreshAccountStats();
    }else{
      console.log("not login");
    }
  }


  async requestSignIn() {
    const appTitle = 'Referendum';
    await this._walletConnection.requestSignIn(
      ReferendumContractName,
      appTitle
    )
  }

  async logOut() {
    this._walletConnection.signOut();
    this._accountId = null;
    this.setState({
      signedIn: !!this._accountId,
      accountId: this._accountId,
    })
  }

  async action_mint(){
    await this._xref_contract.mint({ account_id: this.state.accountId, amount: parseNearAmount(this.state.mint_amount)}, BoatOfGas.toFixed(0))
  }
  handleMintAmountChange(event) {    this.setState({mint_amount: event.target.value});  }
  mintSubmit(event) {
    this.action_mint();
    event.preventDefault();
  }

  async action_lock(){
    let res = await this._xref_contract.ft_transfer_call({ receiver_id: ReferendumContractName, amount: parseNearAmount(this.state.lock_amount), msg: this.state.lock_session}, "200000000000000", 1)
  }
  handleLockAmountChange(event) {    this.setState({lock_amount: event.target.value});  }
  handleLockSessionChange(event) {    this.setState({lock_session: event.target.value});  }
  lockSubmit(event) {
    this.action_lock();
    event.preventDefault();
  }

  async addProposal(){
    let res = await this._referendumContract.add_proposal({ 
      description: this.state.description, 
      kind: 'Vote', 
      policy_type: this.state.policy_type,
      session_id: parseInt(this.state.session_id, 10),
      start_offset_sec: parseInt(this.state.start_offset_sec, 10),
      lasts_sec: parseInt(this.state.lasts_sec, 10),
    }, "200000000000000", this.state.referend_meta.lock_amount_per_proposal)
    alert(res)
    window.location.reload()
  }
  handleDescriptionChange(event) {    this.setState({description: event.target.value});  }
  handlePolicyTypeChange(event) {    this.setState({policy_type: event.target.value});  }
  handleSessionIdChange(event) {    this.setState({session_id: event.target.value});  }
  handleStartChange(event) {    this.setState({start_offset_sec: event.target.value});  }
  handleLastsChange(event) {    this.setState({lasts_sec: event.target.value});  }
  addProposalSubmit(event) {
    this.addProposal();
    event.preventDefault();
  }

  async query_proposal(){
    let res = await this._referendumContract.get_proposal_info({ proposal_id: parseInt(this.state.query_proposal_id, 10)})
    console.log(res)
    this.setState({proposal_info: res})
  }
  handleQueryProposalChange(event) {    this.setState({query_proposal_id: event.target.value});  }
  queryProposalSubmit(event) {
    this.query_proposal();
    event.preventDefault();
  }

  async redeem_proposal(){
    await this._referendumContract.redeem_near_in_expired_proposal({ id: parseInt(this.state.redeem_proposal_id, 10)}, "200000000000000")
  }
  handleRedeemChange(event) {    this.setState({redeem_proposal_id: event.target.value});  }
  redeemSubmit(event) {
    this.redeem_proposal();
    event.preventDefault();
  }

  async remove_proposal(){
    await this._referendumContract.remove_proposal({ id: parseInt(this.state.remove_proposal_id, 10)}, "200000000000000")
  }
  handleRemoveChange(event) {    this.setState({remove_proposal_id: event.target.value});  }
  removeSubmit(event) {
    this.remove_proposal();
    event.preventDefault();
  }

  async action_proposal(){
    await this._referendumContract.act_proposal({ id: parseInt(this.state.action_proposal_id, 10),
      action: this.state.action, 
      memo: this.state.memo, 
    }, "200000000000000")
  }
  handleActionIdChange(event) {    this.setState({action_proposal_id: event.target.value});  }
  handleActionChange(event) {    this.setState({action: event.target.value});  }
  handleMemoChange(event) {    this.setState({memo: event.target.value});  }
  actionSubmit(event) {
    this.action_proposal();
    event.preventDefault();
  }

  render() {
    const content = !this.state.connected ? (
      <div>Connecting... <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span></div>
    ) : (this.state.signedIn ? (
      <div>
        <div className="float-right">
          <button
            className="btn btn-outline-secondary"
            onClick={() => this.logOut()}>Log out</button>
        </div>
        <h4>Hello, <span className="font-weight-bold">{this.state.accountId}</span>!</h4>
        <h4>near balance: <span className="font-weight-bold">{formatNearAmount(this.state.near_balance)}</span></h4>
        <h4>xref balance: <span className="font-weight-bold">{formatNearAmount(this.state.xref_balance)}</span></h4>
        <hr></hr>
        <h4>threshold nonsense: <span className="font-weight-bold">{ this.state.referend_meta.nonsense_threshold.numerator + "/" + this.state.referend_meta.nonsense_threshold.denominator}</span></h4>
        <h4>threshold Relative minimum voting: <span className="font-weight-bold">{ this.state.referend_meta.vote_policy[0].Relative[0].numerator + "/" + this.state.referend_meta.vote_policy[0].Relative[0].denominator}</span></h4>
        <h4>threshold Relative judgement: <span className="font-weight-bold">{this.state.referend_meta.vote_policy[0].Relative[1].numerator + "/" + this.state.referend_meta.vote_policy[0].Relative[1].denominator}</span></h4>
        <h4>threshold Absolute Pass: <span className="font-weight-bold">{ this.state.referend_meta.vote_policy[1].Absolute[0].numerator + "/" + this.state.referend_meta.vote_policy[1].Absolute[0].denominator}</span></h4>
        <h4>threshold Absolute Fail: <span className="font-weight-bold">{ this.state.referend_meta.vote_policy[1].Absolute[1].numerator + "/" + this.state.referend_meta.vote_policy[1].Absolute[1].denominator}</span></h4>
        <h4>lock_amount_per_proposal(Near): <span className="font-weight-bold">{ formatNearAmount(this.state.referend_meta.lock_amount_per_proposal)}</span></h4>
        <h4>cur_total_ballot: <span className="font-weight-bold">{ formatNearAmount(this.state.referend_meta.cur_total_ballot) }</span></h4>
        <h4>cur_lock_amount: <span className="font-weight-bold">{ formatNearAmount(this.state.referend_meta.cur_lock_amount) }</span></h4>
        <hr></hr>
        <h4>latest_block_time: <span className="font-weight-bold">{ this.state.latest_block_time }</span></h4>
        <h4>offset_current_seesion_begin + 30: <span className="font-weight-bold">{ 
        this.state.latest_block_time === 0 ? 0 : this.state.latest_block_time - 
        this.state.referend_meta.genesis_timestamp_sec - 
        this.state.referend_meta.cur_session_id * 3600 * 24 * 30
         + 30 }</span></h4>
         <h4>offset_current_seesion_begin + 60: <span className="font-weight-bold">{ 
        this.state.latest_block_time === 0 ? 0 : this.state.latest_block_time - 
        this.state.referend_meta.genesis_timestamp_sec - 
        this.state.referend_meta.cur_session_id * 3600 * 24 * 30
         + 60 }</span></h4>
        <hr></hr>
        <form onSubmit={this.mintSubmit}>
          <label> mint xref: <input type="text" style={{marginLeft:"74px"}} value={this.state.mint_amount} onChange={(event) => {this.handleMintAmountChange(event)}} /> </label><br/>
          <input type="submit" value="mint" />
        </form>
        <hr></hr>
        <form onSubmit={this.lockSubmit}>
          <label> lock xref: <input type="text" style={{marginLeft:"74px"}} value={this.state.lock_amount} onChange={(event) => {this.handleLockAmountChange(event)}} /> </label><br/>
          <label> lock session: <input type="text" style={{marginLeft:"48px"}} value={this.state.lock_session} onChange={(event) => {this.handleLockSessionChange(event)}} /> </label><br/>
          <input type="submit" value="lock" />
        </form>
        <hr></hr>
        <form onSubmit={this.addProposalSubmit}>
          <label> description: <input type="text" style={{marginLeft:"70px"}} value={this.state.description} onChange={(event) => {this.handleDescriptionChange(event)}} /> </label><br/>
          <label> policy_type: <input type="text" style={{marginLeft:"67px"}} value={this.state.policy_type} onChange={(event) => {this.handlePolicyTypeChange(event)}} /> </label>Relative/Absolute<br/>
          <label> session_id: <input type="text" style={{marginLeft:"74px"}} value={this.state.session_id} onChange={(event) => {this.handleSessionIdChange(event)}} /> </label><br/>
          <label> start_offset_sec(s): <input type="text" style={{marginLeft:"11px"}} value={this.state.start_offset_sec} onChange={(event) => {this.handleStartChange(event)}} /> </label><br/>
          <label> duration(s): <input type="text" style={{marginLeft:"70px"}} value={this.state.lasts_sec} onChange={(event) => {this.handleLastsChange(event)}} /> </label><br/>
          <input type="submit" value="addProposal" />
        </form>
        <hr></hr>
        <form onSubmit={this.queryProposalSubmit}>
          <label> query proposal id: <input type="text" style={{marginLeft:"74px"}} value={this.state.query_proposal_id} onChange={(event) => {this.handleQueryProposalChange(event)}} /> </label><br/>
          <label> proposal info: <span className="font-weight-bold">{ JSON.stringify(this.state.proposal_info) }</span> </label><br/>
          <label> expire time: <span className="font-weight-bold">{ 
            this.state.proposal_info == null ? 0 : 
            this.state.referend_meta.genesis_timestamp_sec +  
            this.state.referend_meta.cur_session_id * 3600 * 24 * 30 +
            this.state.proposal_info.start_offset_sec + this.state.proposal_info.lasts_sec
           }</span> </label><br/>
          <input type="submit" value="query proposal" />
        </form>
        <hr></hr>
        <form onSubmit={this.redeemSubmit}>
          <label> redeem proposal id: <input type="text" style={{marginLeft:"74px"}} value={this.state.redeem_proposal_id} onChange={(event) => {this.handleRedeemChange(event)}} /> </label><br/>
          <input type="submit" value="redeem" />
        </form>
        <hr></hr>
        <form onSubmit={this.removeSubmit}>
          <label> remove proposal id: <input type="text" style={{marginLeft:"74px"}} value={this.state.remove_proposal_id} onChange={(event) => {this.handleRemoveChange(event)}} /> </label><br/>
          <input type="submit" value="remove" />
        </form>
        <hr></hr>
        <form onSubmit={this.actionSubmit}>
          <label> id: <input type="text" style={{marginLeft:"105px"}} value={this.state.action_proposal_id} onChange={(event) => {this.handleActionIdChange(event)}} /> </label><br/>
          <label> action: <input type="text" style={{marginLeft:"74px"}} value={this.state.action} onChange={(event) => {this.handleActionChange(event)}} /> </label>VoteApprove/VoteReject/VoteNonsense<br/>
          <label> memo: <input type="text" style={{marginLeft:"74px"}} value={this.state.memo} onChange={(event) => {this.handleMemoChange(event)}} /> </label><br/>
          <input type="submit" value="action" />
        </form>
        <hr></hr>
      </div>
    ) : (
      <div style={{ marginBottom: "10px" }}>
        <button
          className="btn btn-primary"
          onClick={() => this.requestSignIn()}>Log in with NEAR Wallet</button>
      </div>
    ));
    return (
      <div className="px-5">
        <h1>Referendum</h1>
        {content}
      </div>
    );
  }
}

export default App;
