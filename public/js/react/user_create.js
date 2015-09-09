/** @jsx React.DOM */

var SelectCpn = React.createClass({

    getInitialState: function() {
      return {value: this.props.SelectedOpt};
    },
    handleChange: function(event) {
      this.setState({value: event.target.value});
    },
    render : function(){

      var value = this.state.value;

      var commentNodes = this.props.OptList.map(function (opt) {
              return (
                <option value={opt.v} >{opt.l}</option>
              );
            });

      return (
          <select className="form-control" value={value} name={this.props.SelectName} onChange={this.handleChange}>
            {commentNodes}
          </select>
        );
    }
});

var SelectLine = React.createClass({
  render: function() {
    return (
      <div>
        <label className="col-lg-2 control-label" for="inputDefault">{this.props.SelectLabel} </label>
        <div className="col-lg-7">
          <SelectCpn SelectName={this.props.SelectName} SelectedOpt={this.props.SelectedOpt} OptList={this.props.OptList} />
        </div>
      </div>
    );
  }
});

function generateOptData(data,v,l){

  data = JSON.parse(data);

  var option_data = [];

  for(var i = 0 ; i < data.length ; i++){

    option_data.push({v:data[i][v],l:data[i][l]});

  }

  return  option_data;

}



var dspel = document.getElementById('dspadmin');
var dspadminOptList = dspel.getAttribute("OptList");
if(dspadminOptList){

  var dspadminSelectedOpt = dspel.getAttribute("SelectedOpt");
  dspadminOptList = generateOptData(dspadminOptList,'login','login');

  React.renderComponent(
    <SelectLine SelectLabel='所属管理员' SelectName='dspadmin' SelectedOpt={dspadminSelectedOpt} OptList={dspadminOptList} />,
    dspel
  );

}

var analystel = document.getElementById('analyst');
var analystOptList = analystel.getAttribute("OptList");
if(analystOptList){

  var analystSelectedOpt = analystel.getAttribute("SelectedOpt");
  analystOptList = generateOptData(analystOptList,'login','login');

  React.renderComponent(
    <SelectLine SelectLabel='所属分析师' SelectName='analyst' SelectedOpt={analystSelectedOpt} OptList={analystOptList} />,
    analystel
  );

}

var roleel = document.getElementById('role');
var roleSelectedOpt = roleel.getAttribute("SelectedOpt");
var roleOptList = [{v:'advertiser',l:'广告主'},{v:'analyst',l:'分析师'},{v:'dspadmin',l:'管理员'}];

React.renderComponent(
  <SelectLine SelectLabel='角色' SelectName='role' SelectedOpt={roleSelectedOpt} OptList={roleOptList} />,
  roleel
);


var passwordinput = document.getElementById('passwordinput');
var PswdInput = React.createClass({
  getInitialState: function() {
      return {value: ''};
    },
  handleChange: function(event) {
      this.setState({value: event.target.value});
    },
  render: function() {
    var value = this.state.value;
    return (
      <div>
        <label className="col-lg-2 control-label" for="inputDefault">用户密码</label>
        <div className="col-lg-7">
          <input type="password" className="form-control" name="password" value={value} onChange={this.handleChange}/>
        </div>
      </div>
    );
  }
});

React.renderComponent(
  <PswdInput />,
  passwordinput
);


