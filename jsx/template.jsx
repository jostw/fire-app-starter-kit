/** @jsx React.DOM */

var HelloReact = React.createClass({
    render: function() {
        return (
            <h2>Hello React</h2>
        );
    }
});

React.renderComponent(
    <HelloReact />,
    document.getElementsByClassName("react-sample")[0]
);
