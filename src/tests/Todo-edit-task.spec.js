import React from 'react';
import {cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import Todo from '../Todo';

describe('should edit tasks', () => {
 
    afterEach(cleanup);

    test('should edit task', async () => {
        const {queryByTestId, getByTestId, queryByRole, findByRole} = render(<Todo />);
        
        expect(queryByTestId('newTask')).toBeTruthy();
        expect(queryByTestId('priority')).toBeTruthy();
      
        const newTask = getByTestId('newTask')
        const priority = getByTestId('priority')

        expect(newTask.value).toBe("");
        expect(priority.value).toBe("low");
      
        fireEvent.change(newTask, {target: { value: "Task 1"}});
        fireEvent.change(priority, {target: { value: "high"}});
      
        const addTaskBtn = getByTestId(/add-button/i);
        UserEvent.click(addTaskBtn);
  
        const firstList = queryByRole('list-item', { 'name': 'list0'})

        const toDoHeader = within(firstList).queryByRole('todoText');
        
        UserEvent.dblClick(toDoHeader);

        const editTaskInput = queryByRole('editTask')
        const editTaskSubmit =  queryByRole('button', {name: 'editTaskOk'})

        fireEvent.change(editTaskInput, {target: { value: "Task 2"}});
        UserEvent.click(editTaskSubmit);

        const editedTask = within(firstList).queryByLabelText('taskText')
        expect(editedTask.textContent).toBe("Task 2");
      });


});
