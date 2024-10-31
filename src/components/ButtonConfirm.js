import React from 'react';

class ButtonConfirm extends React.Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            title: this.props.title,
            classButtonName: 'buttonForm buttonAlert btn',
            classDialogName: 'dialog_alert',
            query: this.props.query,
            param: "del",
            param_id: this.props.targetID,
            view: "button"
        }
        
    }

    showDialog()
    {
        this.setState({
            view: "query"
        });
    }

    onClickYes()
    {
        this.setState({
            view: "button"
        }); 

        this.props.onConfirm("yes",this.state.param, this.state.param_id);
    }

    onClickNo()
    {
        this.setState({
            view: "button"
        });

        this.props.onConfirm("no",this.state.param, this.state.param_id);
    }

    render()
    {
        if(this.state.view === "button")
        {
            return (
                <div className={this.state.classButtonName+' btn-danger'} onClick={this.showDialog.bind(this) }>{this.state.title}</div>
            );
        }

        if(this.state.view === "query")
        {
            return (
                <div className={this.state.classDialogName}>
                    <div>{this.state.title}</div>
                    <div className='container'>
                        <div>{this.state.query}</div>
                        <div className={this.state.classButtonName+' btn-success'} onClick={this.onClickYes.bind(this) } >YES</div>
                        <div className={this.state.classButtonName+' btn-danger'} onClick={this.onClickNo.bind(this) } >NO</div>
                    </div>
                </div>
            );
        }
    }
 }

 export default ButtonConfirm;    