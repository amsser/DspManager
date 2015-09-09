/** @jsx React.DOM */

var MaxPriceInput = React.createClass({

    getInitialState: function() {
      return {value: this.props.value};
    },
    handleChange: function(event) {
      this.setState({value: event.target.value});
    },
    render : function(){

      var value = this.state.value;

      return (
          <input type="text" className="form-control" name="Max_price" value={value} onChange={this.handleChange} />
        );
    }
});

var MaxPriceNode = React.createClass({

    render : function(){
      return (
          <div className={this.props.NodeAttributes.class}>
            <label className="control-label">{this.props.NodeAttributes.label}</label>
            <div className="input-group">
            <span className="input-group-addon">￥</span>
              <MaxPriceInput value={this.props.NodeAttributes.value} />
            </div>
          </div>
        );
    }
});

var MaxPriceRow = React.createClass({

  render: function() {

    var i = 0 ; 

    var MaxPriceNodes = this.props.MaxPrice.map(function (item) {

      return (
          <MaxPriceNode NodeAttributes={item} />
      );
      
    });

    return (
      <div>
        {MaxPriceNodes}
      </div>
    );
  }
});


var max_price_el = document.getElementById('max_price');
var price_array = max_price_el.getAttribute('max_price_array');
price_array = price_array.split(',');

var MaxPrice = [

{class:'col-md-2 hidden',label : 'GOOGLE' , value : '0' },
{class:'col-md-2 hidden',label : 'ALLYES' , value : '0' },
{class:'col-md-2 hidden',label : 'TAOBAO' , value : '0' },
{class:'col-md-2 hidden',label : 'SINA' , value : '0' },
{class:'col-md-2 hidden',label : 'TENCENT' , value : '0' },
{class:'col-md-2 hidden',label : 'SOHU' , value : '0' },
{class:'col-md-2 hidden',label : 'MIAOZHEN' , value : '0' },
{class:'col-md-2 col-sm-offset-1',label : 'MANGO' , value : '0' },
{class:'col-md-2',label : 'MEGAMEDIA' , value : '0' },
{class:'col-md-2 hidden',label : 'NADX' , value : '0' }

];

for(var i = 0 ; i < price_array.length ; i++){

  if(price_array[i] && price_array[i] !== ''){
    MaxPrice[i].value = price_array[i];
  }
  
}

React.renderComponent(
  <MaxPriceRow MaxPrice={MaxPrice} />,
  max_price_el
);



