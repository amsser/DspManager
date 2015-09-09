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

var SelectWrapper = React.createClass({
  render: function() {
    return (
      <div className={this.props.scp.divClass}>
        <label for="select" className="control-label">{this.props.scp.SelectLabel}</label>
        <SelectCpn SelectName={this.props.scp.SelectName} SelectedOpt={this.props.SelectedOpt} OptList={this.props.OptList} />
      </div>
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


