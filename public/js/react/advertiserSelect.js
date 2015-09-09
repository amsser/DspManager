/**
 * @jsx React.DOM
 */

 var SelectLineAdManage = React.createClass({
  render: function() {
    return (
			<div className="col-md-6 col-sm-offset-1">
				<label className="control-label" for="inputDefault">{this.props.SelectLabel}</label>
				<SelectCpn SelectName={this.props.SelectName} SelectedOpt={this.props.SelectedOpt} OptList={this.props.OptList} />				
			</div>
    );
  }
});

var advel = document.getElementById('advertiserSelect');
var advOptList = advel.getAttribute("OptList");

if(advOptList){

	var advSelectedOpt = advel.getAttribute("SelectedOpt");
	advOptList = generateOptData(advOptList,'login','login');

	React.renderComponent(
	  <SelectLineAdManage SelectLabel='广告主' SelectName='advertiser' SelectedOpt={advSelectedOpt} OptList={advOptList} />,
	  advel
	);

}

