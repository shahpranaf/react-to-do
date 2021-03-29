import React, { Component } from "react";
import "./Todo.css";

class TodoItems extends Component {
	constructor(props) {
		super(props)
		this.state = {
			editText : ""
		}
	}

	handleEditing = (event) => {
		this.setState({editText: event.target.value})
	}

	handleEditClear = (index) => {
		this.setState({'editText': ''})
		this.props.handleFocus(-1, index)
	}

	handleBlur = (e, index) => {
		// if (e.currentTarget === e.target) {
		// 	console.log('unfocused self');
		// } else {
		// 	console.log('unfocused child', e.target);
		// }
		if (!e.currentTarget.contains(e.relatedTarget)) {
			this.handleEditClear(index)
		}
	}

	createTasks = (item, index) => {
        const badgeClass = item.priority === 'high' ? 'danger' : item.priority === 'medium' ? 'warning' : 'info'
		
		return (
			<li aria-label={`list${index}`}
				className={`list-group-item ${this.props.cursor === index ? 'active' : null} ${!item.done ? null : 'mark-done'}`} 
				key={item.key}
				>

				{/* <div className={`todo-indicator bg-${badgeClass}`}></div> */}
				<div className={`todo-content p-0 `}>

					<div className="todo-content-wrapper">
						<div className={`todo-content-left mr-2 ${ item.editing ? 'blur-on-edit' : ''}`}>
							<div className="custom-checkbox custom-control">
								<input aria-label="selectTask" onFocus={() => this.props.handleFocus(index)} className="custom-control-input" defaultChecked={item.selected} onChange={() => this.props.handleSelected(index)} id={`check${index}`} type="checkbox" />
								<label className="custom-control-label" htmlFor={`check${index}`}>
									&nbsp;
								</label>
							</div>
						</div>
						<div onBlur={(e) => this.handleBlur(e, index) } id={`editTask${index}`} className={`edit-task justify-content-between form-inline row ${ !item.editing ? 'd-none' : ''}`}>
							<input autoComplete="off" name="editText" value={this.state.editText !== '' ? this.state.editText : item.text} 
								ref ={(input) => {input && input.focus()}}
								title="editTask"
								placeholder="Enter Task"
								onChange={this.handleEditing} 
								className="form-control"
							/>
							<button aria-label="editTaskOk" onClick={() => this.props.handleEditSubmit(index, this.state.editText)} className="btn-transition btn btn-sm text-success mr-1">
								<i className={`fa fa-check`}></i>
							</button>
							<button aria-label="editTaskClose" onClick={() => this.handleEditClear(index)} className="btn-transition btn btn-sm text-danger mr-1">
								<i className={`fa fa-close`}></i>
							</button>
						</div>
						<div title="todoText" onDoubleClick = {() => this.props.handleEdit(index)}  className={`todo-content-left col-md-5 ${ item.editing ? 'blur-on-edit' : ''}`}>
							<div className="todo-heading" >
								<span aria-label="taskText" >{item.text}</span>
                                <div aria-label= "priority" className={`badge ml-2 badge-${badgeClass}` }>
                                        {item.priority}
                                </div>
							</div>
						</div>
						<div className={`todo-content-right ${ item.editing ? 'blur-on-edit' : ''}`} onFocus={() => this.props.handleFocus(index)}>
							<button onClick={() => this.props.handleComplete([index])} className="btn-transition btn btn-done mr-1">
								<i className={`fa fa-check ${item.done ? null : 'invisible'}`}></i>
							</button>
							<button aria-label={`delete${index}`} onClick={() => this.props.handleDelete(index)} className="border-0 btn-transition btn btn-outline-danger">
								<i className="fa fa-trash"></i>
							</button>
						</div>
					</div>
				</div>
			</li>
		);

	};

	render() {
		const listItems = this.props.entries.map(this.createTasks);
		return (
			<div className="scroll-area-sm">
				<perfect-scrollbar className="ps-show-limits">
					<div style={{ position: "static" }} className="ps ps--active-y">
						<div className="ps-content">
							<ul className=" list-group list-group-flush">
                                {listItems}
                            </ul>
						</div>
					</div>
				</perfect-scrollbar>
			</div>

			//   <ul className="todo-list">
			//       {listItems}
			//   </ul>
		);
	}
}

export default TodoItems;
