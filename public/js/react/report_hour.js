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

var CheckBoxCell = React.createClass({

  render : function(){
    return(
          <div className="col-md-2">
              <div className="checkbox">
                  <label>
                      <input id="activity" type="checkbox" />{this.props.labelName}
                  </label>
              </div>
          </div>
      );
  }

});

var LabelCell = React.createClass({

  render : function(){
    return(
          <div className="col-md-2">
                  <h4><span className="control-label">{this.props.titleName} : </span></h4>
          </div>
      );
  }

});

var MediaRow = React.createClass({

  render : function(){
    return(

          <div className="row">

              <LabelCell titleName="媒体维度" />

              <CheckBoxCell labelName="Exchange" />

              <CheckBoxCell labelName="媒体" />

              <CheckBoxCell labelName="广告位" />

          </div>

      );
  }

});

var AdRow = React.createClass({

  render : function(){
    return(

          <div className="row">

              <LabelCell titleName="投放维度" />

              <CheckBoxCell labelName="活动" />

              <CheckBoxCell labelName="订单" />

          </div>

      );
  }

});

var TimeRow = React.createClass({

  render : function(){
    return(

      <div className="row">

          <LabelCell titleName="时间维度" />

          <div className="col-md-2">
              <input size="16" type="text" value="2014-05-01" className="form-control form_datetime" />
          </div>

      </div>

      );
  }

});



var QueryForm = React.createClass({

  render : function(){
    return(
            <div className="panel-body">

                <form className="form-horizontal">
                    <fieldset>

                        <TimeRow />
                        <AdRow />
                        <MediaRow />

                        <div className="row">

                            <div className="col-md-9"></div>
                            <div className="col-md-3">
                              <button type="button" className="btn btn-primary btn-md" onclick="queryReport()">开始查询报表</button>
                            </div>

                        </div>
                    </fieldset>
                </form>
            </div>
      );
  }

});

var PanelHeading = React.createClass({
  render: function() {
    return (
        <div className="panel-heading">
            <h3 className="panel-title">{this.props.header}</h3>
        </div>
    );
  }
});



var QueryFormPanel = React.createClass({
  render: function() {
    return (
        <div className="panel panel-primary">
            <PanelHeading header="请选择查询条件" />
            <QueryForm/>
        </div>
    );
  }
});

var QueryTablePanel = React.createClass({
  render: function() {
    return (
          <div className="panel panel-primary">
              <div className="panel-heading">
                  <h3 className="panel-title">查询结果报表</h3>
              </div>
              <div className="panel-body">
                  <table className="table table-striped table-hover ">
                      <thead id="titlediv">
                      <tr>
                          <th>活动名称</th>
                          <th>订单名称</th>
                          <th>Exchange名称</th>
                          <th>媒体名称</th>
                          <th>广告位</th>
                          <th>日期</th>
                          <th>展示数</th>
                          <th>点击数</th>
                          <th>点击率</th>
                          <th>到达数</th>
                          <th>到达率</th>
                          <th>转化数</th>
                      </tr>
                      </thead>
                      <tbody id="recordsdiv">

                      </tbody>
                  </table>
              </div>
          </div>
    );
  }
});


var qfp = document.getElementById('QueryFormPanel');
var qtp = document.getElementById('QueryTablePanel');

React.renderComponent(
  <QueryFormPanel/>,
  qfp
);

React.renderComponent(
  <QueryTablePanel/>,
  qfp
);


