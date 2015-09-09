/** @jsx React.DOM */

var ExchangeInput = React.createClass({

    getInitialState: function() {

      var ischecked = false;

      if(this.props.value == '1')
          ischecked = true;

      return {
              value: this.props.value,
              ischecked : ischecked
              };
    },
    handleChange: function(event) {

      if(event.target.checked)
        this.setState({value: '1',ischecked : true });
      else 
        this.setState({value: '0',ischecked : false });

    },
    render : function(){

      var value = this.state.value;
      var ischecked = this.state.ischecked;

      return (
        <div>
          <input name="Exchange" type='hidden' value={value} onChange={this.handleChange} />
          <input type='checkbox' checked={ischecked} onChange={this.handleChange} />
        </div>
        );
    }
});

var ExchangeRow = React.createClass({

    render : function() {

      var ExchangeNodes = this.props.Exchange.map(function (item) {

        return (
            <div className={item.class}>
                <label>{item.label}</label>
                <ExchangeInput type={item.type} value={item.value}/>
            </div>
        );
        
      });

      return (
        <div>
          {ExchangeNodes}
        </div>
      );
    }

});


var exchanges_el = document.getElementById('exchanges_checkbox');
var exchanges_array = exchanges_el.getAttribute('exchanges_array');
exchanges_array = exchanges_array.split(',');

var Exchange = [
  {class:'checkbox col-md-2 col-sm-offset-2 hidden',label : 'GOOGLE' , value : '0' },
  {class:'checkbox col-md-2 col-sm-offset-2 hidden',label : 'ALLYES' , value : '0' },
  {class:'checkbox col-md-2 col-sm-offset-2 hidden',label : 'TAOBAO' , value : '0' },
  {class:'checkbox col-md-2 col-sm-offset-2 hidden',label : 'SINA' , value : '0' },
  {class:'checkbox col-md-2 col-sm-offset-2 hidden',label : 'TENCENT' , value : '0' },
  {class:'checkbox col-md-2 col-sm-offset-2 hidden',label : 'SOHU' , value : '0' },
  {class:'checkbox col-md-2 col-sm-offset-2 hidden',label : 'MIAOZHEN' , value : '0' },
  {class:'checkbox col-md-2 col-sm-offset-2',label : 'MANGO' , value : '0' },
  {class:'checkbox col-md-2 col-sm-offset-2',label : 'MEGAMEDIA' , value : '0' },
  {class:'checkbox col-md-2 col-sm-offset-2 hidden',label : 'NADX' , value : '0' }
];

for(var i = 0 ; i < Exchange.length ; i++){

  Exchange[i].value = exchanges_array[i];

}

React.renderComponent(
  <ExchangeRow Exchange={Exchange} />,
  exchanges_el
);


var priorityel = document.getElementById('priority_select');
var prioritySelectedOpt = priorityel.getAttribute("SelectedOpt");
var priorityOptList = [{v:'0',l:'0'},{v:'1',l:'1'},{v:'2',l:'2'},{v:'3',l:'3'},{v:'4',l:'4'}];

var scp = {
        divClass : 'col-md-3 col-sm-offset-1',
        SelectLabel : '优先级',
        SelectName :  'Priority'
};


React.renderComponent(
  <SelectWrapper scp={scp} SelectedOpt={prioritySelectedOpt} OptList={priorityOptList} />,
  priorityel
);



