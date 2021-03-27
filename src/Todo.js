import React, { Component } from "react";
import TodoItems from "./TodoItems";

const INITIAL_TASK = {
    key: "",
    text: "",
    done: false,
    priority: "low",
    selected: false,
    editing: false
}

class Todo extends Component {
    constructor(props) {
        super(props);
        this.selectCount = 0;
        this.state = {
            newTask: INITIAL_TASK,
            list : [],
            cursor: -1,
            isEdit: false
        }
    }

    componentDidMount = () => {
        window.addEventListener('beforeunload', this.componentCleanup);
        this.setState({list: JSON.parse(localStorage.getItem('todo') ) || []});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const newList = [...this.state.list].concat({
            ...this.state.newTask,
            key: Date.now()
        } )

        this.setState({list: newList, newTask: INITIAL_TASK})
    }

    handlenewTask = e => {
        const { name, value } = e.target;

        if(name === 'newTask') {
            this.setState({
                newTask: {
                    ...this.state.newTask,
                    text: value
                } 
            } );
        } else if (name === "priority") {
            this.setState({
                newTask: {
                    ...this.state.newTask,
                    priority: value
                } 
            } );
        }
        
    };

    handleDelete = (index=-1) => {
        let lists = [...this.state.list];

        if(index >= 0) {
            lists = lists.filter((item, i) => index !== i)
        } else {
            lists = lists.filter((item) => !item.selected)
        }

        this.setState({ list: lists})
        this.handleSelectCount(lists)
        
    };

    handleKeyDown = (e) => {
        const { cursor, list } = this.state
        // arrow up/down button should select next/previous list element
        if ((e.keyCode === 38 || e.keyCode === 37) && cursor > 0) {
            e.target.focus()
          this.setState( prevState => ({
            cursor: prevState.cursor - 1
          },
          document.getElementById(`check${prevState.cursor - 1}`).focus()
          ))
        } else if ((e.keyCode === 40 || e.keyCode === 39) && cursor < list.length - 1) {
            e.target.focus()
          this.setState( prevState => ({
            cursor: prevState.cursor + 1
          },
            document.getElementById(`check${prevState.cursor + 1}`).focus()
          ))
        }
      };

    handleComplete = (itemIndexArr) => {
        let lists = [...this.state.list];
        itemIndexArr.forEach(i => {
            lists[i].done = !lists[i].done
        });

        lists = lists.filter(list => !list.done).concat(lists.filter(list => list.done))
        this.setState({ list: lists })
    };

    handleSelected = (itemIndex) => {
        const lists = [...this.state.list];
        lists[itemIndex].selected = !lists[itemIndex].selected
        
        this.setState({ list: lists })

        this.handleSelectCount(lists)
    };

    handleSelectCount = (lists) => {
        this.selectCount = lists.filter(list => list.selected).length
    };

    handleFocus = (index, blurIndex=-1) => {
        // document.getElementById(`check${index}`).focus();
        this.setState({cursor: index})
        const updateIndex = blurIndex >= 0 ? blurIndex : index  
        if(updateIndex >= 0) {
            const lists = [...this.state.list];
            lists[updateIndex].editing = false;
            this.setState({ list: lists });
        }
    }

    handleEdit = (itemIndex) => {
        console.log('edit=====')
        const lists = [...this.state.list];
        lists[itemIndex].editing = true;
        // document.getElementById(`check${index}`).focus();
        this.setState({ list: lists });
        return true;
    }

    handleEditSubmit = (index, editText) => {
        if(!editText) 
            return;
        const lists = [...this.state.list];
        lists[index] = {
            ...lists[index],
            text: editText,
            editing: false
        };
        // document.getElementById(`check${index}`).focus();
        this.setState({ list: lists });
    }

    getForm = (newTask) => (
        <form className="col-md-8 form-inline mb-2 row justify-content-between" onSubmit={this.handleSubmit}>
                    <input data-testid="newTask" autoComplete="off" name="newTask" value={newTask.text} 
                        placeholder="Enter Task"
                        onChange={this.handlenewTask} 
                        className="form-control col-md-7"
                    />
                    <select data-testid="priority" name="priority" value={newTask.priority} 
                        onChange={this.handlenewTask} className="form-control col-md-2">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option  value="high">High</option>
                    </select>
                    <button disabled={newTask.text === ""} data-testid="add-button" className="btn btn-primary col-md-2 float-right" type="submit">Add</button>
                </form>
    )

    render() {
        const {newTask, list, edit} = this.state;
		return (
            
            <div className="row d-flex justify-content-center" onKeyDown={this.handleKeyDown}>
                <h1 className="col-md-8 text-center"> My ToDo !! </h1>
                {this.getForm(newTask)}
                <div className="col-md-8">
                    <div className="card-hover-shadow-2x mb-3 card">
                        <div className="card-header-tab card-header">
                            <div className="card-header-title font-size-lg text-capitalize font-weight-normal"><i className="fa fa-tasks"></i>&nbsp;Task Lists</div>
                            
                        </div>
                        <TodoItems entries={list} 
                            handleDelete={this.handleDelete} 
                            cursor={this.state.cursor}
                            handleComplete = {this.handleComplete}
                            handleSelected = {this.handleSelected}
                            handleFocus = {this.handleFocus}
                            handleEdit = {this.handleEdit}
                            handleEditSubmit = {this.handleEditSubmit}
                            edit = {edit}
                        />
                       
                        <div className="d-inline-block d-flex card-footer">
                            <span className="text-left col-md-6">
                                {this.selectCount} Selected
                            </span>
                            <div className="text-right col-md-6">
                                <button aria-label="deleteAll" onClick={this.handleDelete} className={`btn btn-danger ${!this.selectCount ? 'invisible' : ''  }`}>Delete</button>
                            </div>
                            {/* <button className="mr-2 btn btn-link btn-sm">Cancel</button> */}
                        </div>
                    </div>
                </div>
            </div>
		);
    }

    componentWillUnmount = () => {
        this.componentCleanup();
        window.removeEventListener('beforeunload', this.componentCleanup); // remove the event handler for normal unmounting
    }
    
    componentCleanup = () => {
        this.state.list.map(list => {
            list.selected = false;
            list.editing = false;
            return list
        })
        localStorage.setItem('todo', JSON.stringify(this.state.list) || [])
    }
}

export default Todo;
