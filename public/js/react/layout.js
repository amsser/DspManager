/** @jsx React.DOM */

var NavBarUrl = React.createClass({


    render : function(){

        var cls = '';

        if(this.props.active === this.props.url){
            cls = 'active';
        }

        var href = '/' + this.props.url;

      return (
            <li className={cls} >
                <a href={href} > {this.props.label}</a>
            </li>
        );
    }
});

var NavBar = React.createClass({

    render : function(){

        var active = this.props.active;

        var urlNodes = this.props.urlShow.map(function (u) {

              return (
                <NavBarUrl active={active} url={u.url} label={u.label} />
              );
            });

      return (
        <div className="navbar-collapse collapse navbar-responsive-collapse">
            <ul className="nav navbar-nav">
	            {urlNodes}
            </ul>

            <ul className="nav navbar-nav navbar-right">
            	<li><a href="/logout"> {this.props.user} | 退出</a></li>
            </ul>
        </div>   
        );
    }
});

var NavBarEl = document.getElementById('NavBar');
var activeUrl = NavBarEl.getAttribute('active');
var user = NavBarEl.getAttribute('user');
var role = NavBarEl.getAttribute('role');

console.log(role);

var url_show;

if(role === 'admin'){

    url_show = [{url:'user', label:'用户管理'}];

}else if(role === 'dspadmin'){

    url_show = [{url:'user', label:'用户管理'}];

}else if(role === 'analyst'){

    url_show = [{url:'campin', label:'广告管理'},{url:'material', label:'素材管理'},{url:'dashboard', label:'数据分析中心'}];
    
}else if(role === 'advertiser'){

    url_show = [{url:'campin', label:'广告管理'},{url:'material', label:'素材管理'},{url:'dashboard', label:'数据分析中心'}];
    
}

React.renderComponent(
  <NavBar active={activeUrl} urlShow={url_show} user={user} />,
  document.getElementById('NavBar')
);